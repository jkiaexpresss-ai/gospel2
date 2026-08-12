import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSupabaseClient } from '@/lib/supabase';
import { Users, Mail, Heart, MessageSquare, BookOpen, RefreshCw, Rocket, ExternalLink, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, HandHeart, Loader as Loader2, LogOut, PenLine } from 'lucide-react';
import BlogManager from './admin/BlogManager';

type FreeSampleLead = { id: string; first_name: string; email: string; source: string; status: string; created_at: string; };
type NewsletterSub  = { id: string; name: string; email: string; status: string; created_at: string; };
type PrayerPartner  = { id: string; name: string; email: string; status: string; created_at: string; };
type PrayerRequest  = { id: string; name: string; email: string | null; request: string; status: string; created_at: string; };
type ContactMessage = { id: string; name: string; email: string; subject: string; message: string; status: string; country: string | null; city_region: string | null; created_at: string; };
type Donation = { id: string; name: string; email: string; country: string | null; city_region: string | null; amount: number | null; prayer_request: string | null; message: string | null; status: string; created_at: string; };
type BlogPost = { id: string; title: string; slug: string; excerpt: string | null; content: string; cover_image_url: string | null; author: string; category: string | null; status: string; published_at: string | null; created_at: string; updated_at: string; };

type Tab = 'leads' | 'newsletter' | 'partners' | 'prayers' | 'messages' | 'donations' | 'blog';

const TABS: { id: Tab; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'leads',     label: 'Free Sample Leads',    icon: BookOpen,      color: 'text-gold-300' },
  { id: 'newsletter',label: 'Newsletter',           icon: Mail,          color: 'text-gold-300' },
  { id: 'partners',  label: 'Prayer Partners',      icon: Users,         color: 'text-gold-300' },
  { id: 'prayers',   label: 'Prayer Requests',      icon: Heart,         color: 'text-gold-300' },
  { id: 'messages',  label: 'Contact Messages',     icon: MessageSquare, color: 'text-gold-300' },
  { id: 'donations', label: 'Donations',             icon: HandHeart,     color: 'text-gold-300' },
  { id: 'blog',      label: 'Blog Articles',        icon: PenLine,       color: 'text-gold-300' },
];

const STATUS_COLORS: Record<string, string> = {
  new:          'bg-blue-500/15 text-blue-300 border-blue-500/30',
  sent:         'bg-green-500/15 text-green-300 border-green-500/30',
  subscribed:   'bg-green-500/15 text-green-300 border-green-500/30',
  active:       'bg-green-500/15 text-green-300 border-green-500/30',
  received:     'bg-amber-500/15 text-amber-300 border-amber-500/30',
  read:         'bg-blue-500/15 text-blue-300 border-blue-500/30',
  replied:      'bg-green-500/15 text-green-300 border-green-500/30',
  prayed_over:  'bg-purple-500/15 text-purple-300 border-purple-500/30',
  closed:       'bg-gray-500/15 text-gray-400 border-gray-500/30',
  unsubscribed: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  inactive:     'bg-gray-500/15 text-gray-400 border-gray-500/30',
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[0.68rem] font-semibold border ${STATUS_COLORS[status] ?? 'bg-gray-500/15 text-gray-400 border-gray-500/30'}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [tab,      setTab]      = useState<Tab>('leads');
  const [loading,  setLoading]  = useState(true);
  const [loadError, setLoadError] = useState('');
  const [counts,   setCounts]   = useState<Record<Tab, number>>({ leads:0, newsletter:0, partners:0, prayers:0, messages:0, donations:0, blog:0 });

  const [leads,    setLeads]    = useState<FreeSampleLead[]>([]);
  const [subs,     setSubs]     = useState<NewsletterSub[]>([]);
  const [partners, setPartners] = useState<PrayerPartner[]>([]);
  const [prayers,  setPrayers]  = useState<PrayerRequest[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    let mounted = true;
    try {
      const supabase = getSupabaseClient();
      supabase.auth.getSession()
        .then(({ data, error }) => {
          if (!mounted) return;
          if (error || !data.session) {
            navigate('/admin-login', { replace: true, state: { from: { pathname: '/admin' } } });
          } else {
            setAuthed(true);
          }
        })
        .catch(() => {
          if (mounted) navigate('/admin-login', { replace: true, state: { from: { pathname: '/admin' } } });
        });
    } catch {
      if (mounted) navigate('/admin-login', { replace: true, state: { from: { pathname: '/admin' } } });
    }
    return () => { mounted = false; };
  }, [navigate]);

  async function handleSignOut() {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    navigate('/admin-login', { replace: true });
  }

  async function loadAll() {
    setLoading(true);
    setLoadError('');

    try {
      const supabase = getSupabaseClient();
      const results = await Promise.allSettled([
        supabase.from('free_sample_leads').select('*').order('created_at', { ascending: false }),
        supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false }),
        supabase.from('prayer_partners').select('*').order('created_at', { ascending: false }),
        supabase.from('prayer_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
        supabase.from('donations').select('*').order('created_at', { ascending: false }),
        supabase.from('blog_posts').select('*').order('updated_at', { ascending: false }),
      ]);

      const labels = ['leads', 'newsletter', 'partners', 'prayers', 'messages', 'donations', 'blog'] as const;
      const errors: string[] = [];
      const data: Record<string, unknown[]> = {};

      results.forEach((r, i) => {
        const label = labels[i];
        if (r.status === 'fulfilled') {
          if (r.value.error) {
            errors.push(`${label}: ${r.value.error.message}`);
          } else {
            data[label] = r.value.data ?? [];
          }
        } else {
          errors.push(`${label}: ${r.reason?.message ?? 'fetch failed'}`);
        }
      });

      if (errors.length > 0 && Object.keys(data).length === 0) {
        throw new Error(errors.join('; '));
      }

      if (errors.length > 0) {
        setLoadError(`Some sections failed to load: ${errors.join('; ')}`);
      }

      setLeads((data['leads'] as FreeSampleLead[]) ?? []);
      setSubs((data['newsletter'] as NewsletterSub[]) ?? []);
      setPartners((data['partners'] as PrayerPartner[]) ?? []);
      setPrayers((data['prayers'] as PrayerRequest[]) ?? []);
      setMessages((data['messages'] as ContactMessage[]) ?? []);
      setDonations((data['donations'] as Donation[]) ?? []);
      setBlogPosts((data['blog'] as BlogPost[]) ?? []);
      setCounts({
        leads:      data['leads']?.length      ?? 0,
        newsletter: data['newsletter']?.length ?? 0,
        partners:   data['partners']?.length   ?? 0,
        prayers:    data['prayers']?.length    ?? 0,
        messages:   data['messages']?.length   ?? 0,
        donations:  data['donations']?.length  ?? 0,
        blog:       data['blog']?.length       ?? 0,
      });
    } catch (err) {
      setLoadError(
        err instanceof Error && err.message
          ? `Could not load data: ${err.message}`
          : 'Submission data could not be loaded. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (authed) loadAll(); }, [authed]);

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 size={28} className="animate-spin text-gold-400" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="text-white px-4 sm:px-6 lg:px-8 py-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-gold-400 text-[0.72rem] font-semibold tracking-[0.16em] uppercase mb-1">Ministry Dashboard</p>
            <h1 className="font-playfair text-3xl font-bold">In Him Daily — Submissions</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadAll} disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors disabled:opacity-50"
              aria-label="Refresh data">
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} aria-hidden="true" />
              Refresh
            </button>
            <button onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-red-500/20 rounded-full text-sm font-medium transition-colors"
              aria-label="Sign out">
              <LogOut size={15} aria-hidden="true" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadError && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3 items-start" role="alert">
            <AlertCircle size={18} className="text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-amber-200">{loadError}</p>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`p-5 rounded-2xl border text-left transition-all duration-200 ${
                tab === t.id ? 'ih-card border-gold-400/50' : 'ih-card-solid border-white/10 hover:border-gold-400/30'
              }`}>
              <t.icon size={20} className={tab === t.id ? 'text-gold-300 mb-3' : `${t.color} mb-3`} aria-hidden="true" />
              <p className={`text-2xl font-bold font-playfair ${tab === t.id ? 'text-white' : 'text-white'}`}>
                {loading ? '—' : counts[t.id]}
              </p>
              <p className={`text-xs mt-0.5 ${tab === t.id ? 'text-white/60' : 'text-white/45'}`}>{t.label}</p>
            </button>
          ))}
        </div>

        <div className="ih-card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-24 text-white/50">
              <RefreshCw size={22} className="animate-spin mr-3" aria-hidden="true" />
              Loading submissions…
            </div>
          ) : (
            <>
              {tab === 'leads' && (
                <table className="w-full text-sm">
                  <thead className="bg-white/5 text-white/50 text-[0.72rem] uppercase tracking-wider">
                    <tr>{['Name','Email','Source','Status','Date'].map(h => <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {leads.length === 0 ? <tr><td colSpan={5} className="px-5 py-10 text-center text-white/40">No leads yet.</td></tr>
                      : leads.map(r => (
                        <tr key={r.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-white">{r.first_name}</td>
                          <td className="px-5 py-3.5 text-white/60">{r.email}</td>
                          <td className="px-5 py-3.5 text-white/60 text-[0.8rem]">{r.source.replace('_', ' ')}</td>
                          <td className="px-5 py-3.5"><StatusBadge status={r.status} /></td>
                          <td className="px-5 py-3.5 text-white/60 text-[0.8rem]">{fmt(r.created_at)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
              {tab === 'newsletter' && (
                <table className="w-full text-sm">
                  <thead className="bg-white/5 text-white/50 text-[0.72rem] uppercase tracking-wider">
                    <tr>{['Name','Email','Status','Subscribed'].map(h => <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {subs.length === 0 ? <tr><td colSpan={4} className="px-5 py-10 text-center text-white/40">No subscribers yet.</td></tr>
                      : subs.map(r => (
                        <tr key={r.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-white">{r.name}</td>
                          <td className="px-5 py-3.5 text-white/60">{r.email}</td>
                          <td className="px-5 py-3.5"><StatusBadge status={r.status} /></td>
                          <td className="px-5 py-3.5 text-white/60 text-[0.8rem]">{fmt(r.created_at)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
              {tab === 'partners' && (
                <table className="w-full text-sm">
                  <thead className="bg-white/5 text-white/50 text-[0.72rem] uppercase tracking-wider">
                    <tr>{['Name','Email','Status','Joined'].map(h => <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {partners.length === 0 ? <tr><td colSpan={4} className="px-5 py-10 text-center text-white/40">No prayer partners yet.</td></tr>
                      : partners.map(r => (
                        <tr key={r.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-white">{r.name}</td>
                          <td className="px-5 py-3.5 text-white/60">{r.email}</td>
                          <td className="px-5 py-3.5"><StatusBadge status={r.status} /></td>
                          <td className="px-5 py-3.5 text-white/60 text-[0.8rem]">{fmt(r.created_at)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
              {tab === 'prayers' && (
                <table className="w-full text-sm">
                  <thead className="bg-white/5 text-white/50 text-[0.72rem] uppercase tracking-wider">
                    <tr>{['Name','Email','Request','Status','Date'].map(h => <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {prayers.length === 0 ? <tr><td colSpan={5} className="px-5 py-10 text-center text-white/40">No prayer requests yet.</td></tr>
                      : prayers.map(r => (
                        <tr key={r.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-white whitespace-nowrap">{r.name}</td>
                          <td className="px-5 py-3.5 text-white/60">{r.email ?? <span className="text-white/30 italic text-xs">anonymous</span>}</td>
                          <td className="px-5 py-3.5 text-white/60 max-w-xs"><span className="line-clamp-2">{r.request}</span></td>
                          <td className="px-5 py-3.5 whitespace-nowrap"><StatusBadge status={r.status} /></td>
                          <td className="px-5 py-3.5 text-white/60 text-[0.8rem] whitespace-nowrap">{fmt(r.created_at)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
              {tab === 'messages' && (
                <table className="w-full text-sm">
                  <thead className="bg-white/5 text-white/50 text-[0.72rem] uppercase tracking-wider">
                    <tr>{['Name','Email','Subject','Message','Status','Date'].map(h => <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {messages.length === 0 ? <tr><td colSpan={6} className="px-5 py-10 text-center text-white/40">No messages yet.</td></tr>
                      : messages.map(r => (
                        <tr key={r.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-white whitespace-nowrap">{r.name}</td>
                          <td className="px-5 py-3.5 text-white/60">{r.email}</td>
                          <td className="px-5 py-3.5 text-white font-medium">{r.subject}</td>
                          <td className="px-5 py-3.5 text-white/60 max-w-xs"><span className="line-clamp-2">{r.message}</span></td>
                          <td className="px-5 py-3.5 whitespace-nowrap"><StatusBadge status={r.status} /></td>
                          <td className="px-5 py-3.5 text-white/60 text-[0.8rem] whitespace-nowrap">{fmt(r.created_at)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
              {tab === 'donations' && (
                <table className="w-full text-sm">
                  <thead className="bg-white/5 text-white/50 text-[0.72rem] uppercase tracking-wider">
                    <tr>{['Name','Email','Amount','Country','City/Region','Date'].map(h => <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {donations.length === 0 ? <tr><td colSpan={6} className="px-5 py-10 text-center text-white/40">No donations yet.</td></tr>
                      : donations.map(r => (
                        <tr key={r.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-white whitespace-nowrap">{r.name}</td>
                          <td className="px-5 py-3.5 text-white/60">{r.email}</td>
                          <td className="px-5 py-3.5 text-gold-300 font-semibold">{r.amount ? `${r.amount}` : '—'}</td>
                          <td className="px-5 py-3.5 text-white/60">{r.country ?? '—'}</td>
                          <td className="px-5 py-3.5 text-white/60">{r.city_region ?? '—'}</td>
                          <td className="px-5 py-3.5 text-white/60 text-[0.8rem] whitespace-nowrap">{fmt(r.created_at)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
              {tab === 'blog' && (
                <div className="p-6">
                  <BlogManager posts={blogPosts} onRefresh={loadAll} />
                </div>
              )}
            </>
          )}
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          In Him Daily Admin · Data secured with Supabase Row Level Security
        </p>

        <div className="mt-12 ih-card overflow-hidden">
          <div className="bg-white/5 px-6 py-5 flex items-center gap-3 border-b border-white/10">
            <Rocket size={20} className="text-gold-300" aria-hidden="true" />
            <h2 className="font-playfair text-lg font-bold text-white">Netlify Deployment</h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[0.68rem] font-semibold text-white/40 uppercase tracking-wider mb-1">Build Command</p>
                <p className="text-sm text-white font-mono">npm run build</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[0.68rem] font-semibold text-white/40 uppercase tracking-wider mb-1">Publish Directory</p>
                <p className="text-sm text-white font-mono">dist</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[0.68rem] font-semibold text-white/40 uppercase tracking-wider mb-1">Framework</p>
                <p className="text-sm text-white font-mono">React + Vite</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-playfair text-base font-bold text-white">Deploy in 3 Steps</h3>
              <ol className="space-y-3">
                <li className="flex gap-3 items-start">
                  <span className="w-6 h-6 rounded-full bg-gold-400/20 text-gold-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <div>
                    <p className="text-sm font-medium text-white">Connect your repository</p>
                    <p className="text-xs text-white/50 mt-0.5">Push this project to GitHub, then log in to Netlify and select &ldquo;Add new site &rarr; Import an existing project&rdquo;.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="w-6 h-6 rounded-full bg-gold-400/20 text-gold-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <div>
                    <p className="text-sm font-medium text-white">Configure build settings</p>
                    <p className="text-xs text-white/50 mt-0.5">Set build command to <code className="text-gold-300 bg-gold-400/10 px-1 rounded">npm run build</code> and publish directory to <code className="text-gold-300 bg-gold-400/10 px-1 rounded">dist</code>.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="w-6 h-6 rounded-full bg-gold-400/20 text-gold-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <div>
                    <p className="text-sm font-medium text-white">Set environment variables</p>
                    <p className="text-xs text-white/50 mt-0.5">In Netlify &rarr; Site settings &rarr; Environment variables, add <code className="text-gold-300 bg-gold-400/10 px-1 rounded">VITE_SUPABASE_URL</code> and <code className="text-gold-300 bg-gold-400/10 px-1 rounded">VITE_SUPABASE_ANON_KEY</code>.</p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex gap-3 items-start">
              <CheckCircle2 size={18} className="text-green-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-green-300">netlify.toml is configured for Vite</p>
                <p className="text-xs text-green-400/70 mt-0.5">Build command, publish directory, and SPA redirect rules are all set up.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3 items-start">
              <AlertCircle size={18} className="text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-amber-300">Environment variables required</p>
                <p className="text-xs text-amber-400/70 mt-0.5">VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in Netlify for forms and dashboard to work in production.</p>
              </div>
            </div>

            <a href="https://app.netlify.com/start" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 ih-btn-gold text-sm">
              <ExternalLink size={16} aria-hidden="true" />
              Go to Netlify
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
