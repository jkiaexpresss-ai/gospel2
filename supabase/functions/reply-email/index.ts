import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const POSTMARK_URL = "https://api.postmarkapp.com/email";

interface ReplyRequest {
  messageId: string;
  replyBody: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const { messageId, replyBody } = await req.json() as ReplyRequest;

    if (!messageId || !replyBody) {
      return new Response(
        JSON.stringify({ error: "Message ID and reply body are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const postmarkToken = Deno.env.get("POSTMARK_SERVER_TOKEN");
    if (!postmarkToken) {
      return new Response(
        JSON.stringify({ error: "Email service is not configured." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const fetchResponse = await fetch(
      `${supabaseUrl}/rest/v1/email_messages?id=eq.${messageId}&direction=eq.inbound&select=*`,
      {
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
        },
      },
    );

    if (!fetchResponse.ok) {
      console.error("Database fetch error:", await fetchResponse.text());
      return new Response(
        JSON.stringify({ error: "Failed to find original email." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const emails = await fetchResponse.json() as Array<{
      id: string;
      from_email: string;
      from_name: string | null;
      subject: string;
      message_id: string | null;
    }>;

    if (!emails || emails.length === 0) {
      return new Response(
        JSON.stringify({ error: "Original email not found." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const originalEmail = emails[0];

    const senderEmail = Deno.env.get("POSTMARK_SENDER_EMAIL") || "hello@inhimdaily.org";
    const senderName = Deno.env.get("POSTMARK_SENDER_NAME") || "In Him Daily";

    const replySubject = originalEmail.subject.toLowerCase().startsWith("re:")
      ? originalEmail.subject
      : `Re: ${originalEmail.subject}`;

    const htmlBody = buildReplyHtml(replyBody);
    const textBody = replyBody;

    const postmarkResponse = await fetch(POSTMARK_URL, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": postmarkToken,
      },
      body: JSON.stringify({
        From: `${senderName} <${senderEmail}>`,
        To: originalEmail.from_email,
        Subject: replySubject,
        HtmlBody: htmlBody,
        TextBody: textBody,
        MessageStream: "outbound",
        Tag: "admin_reply",
        TrackOpens: true,
      }),
    });

    if (!postmarkResponse.ok) {
      const errorText = await postmarkResponse.text();
      console.error("Postmark error:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to send reply email." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Store the outbound reply in the database
    const insertResponse = await fetch(`${supabaseUrl}/rest/v1/email_messages`, {
      method: "POST",
      headers: {
        "apikey": serviceRoleKey,
        "Authorization": `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({
        from_email: senderEmail,
        from_name: senderName,
        to_email: originalEmail.from_email,
        subject: replySubject,
        body_text: textBody,
        body_html: htmlBody,
        in_reply_to: originalEmail.id,
        direction: "outbound",
        status: "sent",
      }),
    });

    if (!insertResponse.ok) {
      console.error("Failed to store reply:", await insertResponse.text());
    }

    // Update the original email's status to "replied"
    const updateResponse = await fetch(
      `${supabaseUrl}/rest/v1/email_messages?id=eq.${messageId}`,
      {
        method: "PATCH",
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({ status: "replied" }),
      },
    );

    if (!updateResponse.ok) {
      console.error("Failed to update email status:", await updateResponse.text());
    }

    return new Response(
      JSON.stringify({ success: true, message: "Reply sent successfully." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Reply email error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildReplyHtml(replyBody: string): string {
  const escaped = escapeHtml(replyBody);
  const paragraphs = escaped
    .split(/\n\n+/)
    .map((p) => `<p style="margin:0 0 16px 0;">${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#0E2035;font-family:Georgia,'Times New Roman',serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0E2035;">
<tr><td align="center" style="padding:40px 16px;">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<tr><td style="padding:0 0 20px 0;">
<p style="font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#C9983A;margin:0 0 8px 0;">In Him Daily</p>
</td></tr>

<tr><td style="padding:0 0 24px 0;">
<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:32px;">
${paragraphs}
</div>
</td></tr>

<tr><td align="center" style="padding:16px 0 40px 0;border-top:1px solid rgba(212,175,55,0.15);">
<p style="font-size:12px;color:rgba(250,248,243,0.4);margin:24px 0 0 0;line-height:1.6;">In Him Daily · inhimdaily.com<br/>Reply sent from the In Him Daily admin dashboard</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
