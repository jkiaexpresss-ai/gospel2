import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PostmarkInboundEmail {
  From: string;
  FromName?: string;
  To: string;
  Subject: string;
  TextBody?: string;
  HtmlBody?: string;
  MessageID?: string;
  ReplyTo?: string;
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
    const email = await req.json() as PostmarkInboundEmail;

    if (!email.From || !email.To || !email.Subject) {
      return new Response(
        JSON.stringify({ error: "Missing required email fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const fromMatch = email.From.match(/<([^>]+)>/);
    const fromEmail = fromMatch ? fromMatch[1] : email.From;
    const fromName = email.FromName || (fromMatch ? email.From.replace(/<[^>]+>/, "").trim() : undefined);

    const toMatch = email.To.match(/<([^>]+)>/);
    const toEmail = toMatch ? toMatch[1] : email.To;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing Supabase configuration");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const insertResponse = await fetch(`${supabaseUrl}/rest/v1/email_messages`, {
      method: "POST",
      headers: {
        "apikey": serviceRoleKey,
        "Authorization": `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({
        from_email: fromEmail,
        from_name: fromName || null,
        to_email: toEmail,
        subject: email.Subject,
        body_text: email.TextBody || null,
        body_html: email.HtmlBody || null,
        message_id: email.MessageID || null,
        direction: "inbound",
        status: "new",
      }),
    });

    if (!insertResponse.ok) {
      const errorText = await insertResponse.text();
      console.error("Database insert error:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to store email" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Email received" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Inbound email error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
