import { useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import { Inbox, Send, ArrowLeft, Loader as Loader2, CircleAlert as AlertCircle, Mail, CircleCheck as CheckCircle2 } from 'lucide-react';

type EmailMessage = {
  id: string;
  from_email: string;
  from_name: string | null;
  to_email: string;
  subject: string;
  body_text: string | null;
  body_html: string | null;
  direction: 'inbound' | 'outbound';
  status: string;
  in_reply_to: string | null;
  created_at: string;
};

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/ on\w+="[^"]*"/gi, '')
    .replace(/ on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}

export default function EmailInbox({ emails, onRefresh }: { emails: EmailMessage[]; onRefresh: () => void }) {
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [replyError, setReplyError] = useState('');
  const [replySuccess, setReplySuccess] = useState(false);

  const inboundEmails = emails.filter((e) => e.direction === 'inbound');
  const thread = selectedEmail
    ? emails.filter((e) => e.id === selectedEmail.id || e.in_reply_to === selectedEmail.id)
    : [];

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedEmail || !replyText.trim()) return;

    setSending(true);
    setReplyError('');
    setReplySuccess(false);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const supabase = getSupabaseClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (!accessToken) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/reply-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          apikey: anonKey,
        },
        body: JSON.stringify({
          messageId: selectedEmail.id,
          replyBody: replyText.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Failed to send reply (${response.status})`);
      }

      setReplySuccess(true);
      setReplyText('');
      setTimeout(() => {
        setReplySuccess(false);
        setSelectedEmail(null);
        onRefresh();
      }, 1500);
    } catch (err) {
      setReplyError(err instanceof Error ? err.message : 'Failed to send reply.');
    } finally {
      setSending(false);
    }
  }

  async function markAsRead(email: EmailMessage) {
    if (email.status === 'new') {
      const supabase = getSupabaseClient();
      await supabase.from('email_messages').update({ status: 'read' }).eq('id', email.id);
      onRefresh();
    }
  }

  function openEmail(email: EmailMessage) {
    setSelectedEmail(email);
    setReplyText('');
    setReplyError('');
    setReplySuccess(false);
    markAsRead(email);
  }

  if (selectedEmail) {
    return (
      <div className="p-6">
        <button
          onClick={() => setSelectedEmail(null)}
          className="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to inbox
        </button>

        <div className="space-y-6 mb-6">
          {thread.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl border p-5 ${
                msg.direction === 'inbound'
                  ? 'bg-white/5 border-white/10'
                  : 'bg-gold-400/5 border-gold-400/20'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {msg.direction === 'inbound' ? (
                    <Mail size={14} className="text-white/50" aria-hidden="true" />
                  ) : (
                    <Send size={14} className="text-gold-300" aria-hidden="true" />
                  )}
                  <span className="text-sm font-medium text-white">
                    {msg.direction === 'inbound'
                      ? `${msg.from_name || msg.from_email}`
                      : 'You (In Him Daily)'}
                  </span>
                </div>
                <span className="text-xs text-white/40">{fmtDateTime(msg.created_at)}</span>
              </div>
              <p className="text-sm text-white/70 mb-3">
                <span className="text-white/40">To:</span> {msg.to_email}
              </p>
              {msg.body_html ? (
                <div
                  className="text-sm text-white/80 leading-relaxed prose-invert max-w-none [&_a]:text-gold-300"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(msg.body_html) }}
                />
              ) : (
                <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
                  {msg.body_text || '(No body content)'}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-gold-400/20 bg-gold-400/5 p-5">
          <h3 className="font-playfair text-lg font-bold text-white mb-1">Reply to {selectedEmail.from_name || selectedEmail.from_email}</h3>
          <p className="text-xs text-white/50 mb-4">
            Your reply will be sent from hello@inhimdaily.org
          </p>

          {replySuccess && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex gap-2 items-start">
              <CheckCircle2 size={16} className="text-green-400 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-green-300">Reply sent successfully!</p>
            </div>
          )}
          {replyError && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex gap-2 items-start">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-red-300">{replyError}</p>
            </div>
          )}

          <form onSubmit={handleReply} className="space-y-4">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              required
              rows={6}
              placeholder="Type your reply..."
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold-400/50 transition-colors resize-none"
            />
            <button
              type="submit"
              disabled={sending || !replyText.trim()}
              className="inline-flex items-center gap-2 px-6 py-3 ih-btn-gold text-sm disabled:opacity-50"
            >
              {sending ? (
                <>
                  <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={15} aria-hidden="true" />
                  Send Reply
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      {inboundEmails.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/40">
          <Inbox size={40} className="mb-4 opacity-50" aria-hidden="true" />
          <p className="text-sm">No emails yet. Emails sent to hello@inhimdaily.org will appear here.</p>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/50 text-[0.72rem] uppercase tracking-wider">
            <tr>
              {['From', 'Subject', 'Status', 'Received'].map((h) => (
                <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {inboundEmails.map((email) => (
              <tr
                key={email.id}
                onClick={() => openEmail(email)}
                className="hover:bg-white/5 transition-colors cursor-pointer"
              >
                <td className="px-5 py-3.5">
                  <div className="font-medium text-white">{email.from_name || email.from_email}</div>
                  {email.from_name && <div className="text-xs text-white/40">{email.from_email}</div>}
                </td>
                <td className="px-5 py-3.5 text-white font-medium max-w-md">
                  <span className={email.status === 'new' ? 'text-white' : 'text-white/70'}>
                    {email.subject}
                  </span>
                  {email.body_text && (
                    <p className="text-xs text-white/40 mt-0.5 line-clamp-1">
                      {email.body_text.substring(0, 120)}
                    </p>
                  )}
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[0.68rem] font-semibold border ${
                      email.status === 'new'
                        ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                        : email.status === 'replied'
                        ? 'bg-green-500/15 text-green-300 border-green-500/30'
                        : email.status === 'read'
                        ? 'bg-gray-500/15 text-gray-400 border-gray-500/30'
                        : 'bg-gray-500/15 text-gray-400 border-gray-500/30'
                    }`}
                  >
                    {email.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-white/60 text-[0.8rem] whitespace-nowrap">
                  {fmtDateTime(email.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
