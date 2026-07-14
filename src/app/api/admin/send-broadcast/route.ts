import { createClient } from "@/lib/supabase-server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function sendEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  try {
    await transporter.sendMail({
      from: `"Dr. Einas Diab — MRCPI OBGYN Unlocked" <${process.env.SMTP_USER}>`,
      to, subject, html,
    });
    return true;
  } catch (e) {
    console.error("[send-broadcast] Email error:", e);
    return false;
  }
}

function buildBroadcastHtml(fields: {
  studentName: string;
  quote: string;
  todaysMessage: string;
  weekFocus: string;
  todaysChallenge: string;
  closingEncouragement: string;
  lastFeedbackSnippet: string;
  contentSection: string;
}): string {
  const {
    studentName, quote, todaysMessage, weekFocus,
    todaysChallenge, closingEncouragement, lastFeedbackSnippet, contentSection,
  } = fields;

  const block = (num: string, label: string, body: string) => `
    <div style="margin-bottom:24px;">
      <p style="margin:0 0 6px 0;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#15B097;font-family:Georgia,serif;">${num} · ${label}</p>
      <p style="margin:0;font-size:15px;color:#0B1E3D;line-height:1.75;font-family:Georgia,serif;white-space:pre-line;">${body}</p>
    </div>`;

  const optionalFooterRows = [
    lastFeedbackSnippet ? `
      <div style="background:#f0faf8;border-left:3px solid #15B097;border-radius:4px;padding:14px 18px;margin-bottom:16px;">
        <p style="margin:0 0 4px 0;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#15B097;font-family:Georgia,serif;">Where We Left Off</p>
        <p style="margin:0;font-size:14px;color:#0B1E3D;line-height:1.65;font-style:italic;font-family:Georgia,serif;">"${lastFeedbackSnippet}"</p>
      </div>` : "",
    contentSection ? `
      <div style="background:#f8f7f4;border:1px solid rgba(15,76,92,0.12);border-radius:8px;padding:14px 18px;margin-bottom:16px;">
        <p style="margin:0 0 4px 0;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(26,26,26,0.45);font-family:Georgia,serif;">Content to Focus On</p>
        <p style="margin:0;font-size:14px;color:#0B1E3D;font-weight:600;font-family:Georgia,serif;">${contentSection}</p>
      </div>` : "",
  ].filter(Boolean).join("");

  return `
<div style="font-family:Georgia,serif;max-width:620px;margin:0 auto;padding:32px 20px;background:#f8f7f4;">

  <!-- Header -->
  <div style="background:#0B1E3D;padding:28px 36px;border-radius:16px 16px 0 0;text-align:center;">
    <p style="color:rgba(255,255,255,0.4);font-size:10px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 6px 0;font-family:Georgia,serif;">A Message from Your Mentor</p>
    <h1 style="color:#15B097;font-size:22px;margin:0;letter-spacing:0.04em;font-family:Georgia,serif;">Dr. Einas Diab</h1>
    <p style="color:rgba(255,255,255,0.35);font-size:12px;margin:6px 0 0 0;font-family:Georgia,serif;">MRCPI OBGYN Unlocked</p>
  </div>

  <!-- Body -->
  <div style="background:#ffffff;padding:36px 36px 28px 36px;border-radius:0 0 16px 16px;border:1px solid rgba(15,76,92,0.12);border-top:none;">
    <p style="color:#0B1E3D;font-size:17px;margin:0 0 28px 0;">Dear ${studentName},</p>

    ${quote ? `
    <!-- Quote -->
    <div style="background:#0B1E3D;border-radius:12px;padding:20px 24px;margin-bottom:28px;text-align:center;">
      <p style="margin:0;font-size:16px;font-style:italic;color:#ffffff;line-height:1.7;font-family:Georgia,serif;">${quote}</p>
    </div>` : ""}

    ${block("2", "Today&rsquo;s Message", todaysMessage)}

    ${weekFocus ? `
    <div style="background:#f0faf8;border-radius:10px;padding:18px 22px;margin-bottom:24px;display:flex;gap:14px;align-items:flex-start;">
      <div style="flex-shrink:0;width:36px;height:36px;border-radius:50%;background:#15B097;display:flex;align-items:center;justify-content:center;font-size:16px;">🎯</div>
      <div>
        <p style="margin:0 0 4px 0;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#15B097;font-family:Georgia,serif;">3 · This Week&rsquo;s Focus</p>
        <p style="margin:0;font-size:15px;color:#0B1E3D;line-height:1.65;font-family:Georgia,serif;">${weekFocus}</p>
      </div>
    </div>` : ""}

    ${todaysChallenge ? `
    <div style="background:#fff8ee;border:1px solid rgba(201,162,39,0.25);border-radius:10px;padding:18px 22px;margin-bottom:24px;display:flex;gap:14px;align-items:flex-start;">
      <div style="flex-shrink:0;font-size:20px;">⚡</div>
      <div>
        <p style="margin:0 0 4px 0;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#C9A84C;font-family:Georgia,serif;">4 · Today&rsquo;s Challenge</p>
        <p style="margin:0;font-size:15px;color:#0B1E3D;line-height:1.65;font-family:Georgia,serif;">${todaysChallenge}</p>
      </div>
    </div>` : ""}

    <!-- Closing -->
    <div style="border-top:1px solid rgba(15,76,92,0.08);padding-top:22px;margin-top:8px;">
      <p style="margin:0 0 4px 0;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(26,26,26,0.4);font-family:Georgia,serif;">5 · Closing Encouragement</p>
      <p style="margin:0 0 20px 0;font-size:15px;color:#0B1E3D;line-height:1.75;font-style:italic;font-family:Georgia,serif;">${closingEncouragement}</p>
      <p style="margin:0;font-size:14px;color:rgba(26,26,26,0.55);font-family:Georgia,serif;">With care,</p>
      <p style="margin:4px 0 0 0;font-size:16px;font-weight:700;color:#0B1E3D;font-family:Georgia,serif;">Dr. Einas Diab</p>
      <p style="margin:2px 0 0 0;font-size:12px;color:#15B097;font-family:Georgia,serif;">MRCPI OBGYN Unlocked</p>
    </div>
  </div>

  ${optionalFooterRows || (lastFeedbackSnippet || contentSection) ? `
  <!-- Keep Your Momentum Alive footer -->
  <div style="background:#0B1E3D;border-radius:16px;padding:28px 36px;margin-top:16px;">
    <p style="margin:0 0 18px 0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#15B097;text-align:center;font-family:Georgia,serif;">Keep Your Momentum Alive</p>
    ${optionalFooterRows}
    <div style="text-align:center;margin-top:20px;">
      <a href="https://mrcpiobgynunlocked.com/dashboard"
         style="background:#15B097;color:#0B1E3D;padding:14px 36px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;font-family:Georgia,serif;letter-spacing:0.02em;">
        Resume Learning →
      </a>
    </div>
  </div>` : `
  <!-- Resume button standalone -->
  <div style="text-align:center;margin-top:20px;">
    <a href="https://mrcpiobgynunlocked.com/dashboard"
       style="background:#0B1E3D;color:#15B097;padding:14px 36px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;font-family:Georgia,serif;">
      Resume Learning →
    </a>
  </div>`}

  <p style="text-align:center;font-size:11px;color:rgba(26,26,26,0.3);margin-top:20px;font-family:Georgia,serif;">
    © ${new Date().getFullYear()} MRCPI OBGYN Unlocked &nbsp;·&nbsp;
    <a href="https://mrcpiobgynunlocked.com" style="color:rgba(26,26,26,0.3);text-decoration:none;">mrcpiobgynunlocked.com</a>
  </p>
</div>`;
}

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || (profile.role !== "admin" && profile.role !== "instructor")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { targetAll, studentIds, quote, todaysMessage, weekFocus, todaysChallenge, closingEncouragement, lastFeedbackSnippet, contentSection } = body;

  const serviceClient = createServiceClient();

  let recipients: { id: string; email: string; full_name: string | null }[] = [];

  if (targetAll) {
    const { data } = await serviceClient.from("profiles").select("id, email, full_name").eq("role", "student").eq("status", "active");
    recipients = data ?? [];
  } else {
    const { data } = await serviceClient.from("profiles").select("id, email, full_name").in("id", studentIds ?? []);
    recipients = data ?? [];
  }

  if (recipients.length === 0) return NextResponse.json({ error: "No recipients found" }, { status: 400 });

  const subject = "A Message from Your Mentor — Dr. Einas Diab";
  let sent = 0;

  for (const r of recipients) {
    const html = buildBroadcastHtml({
      studentName: r.full_name || r.email,
      quote, todaysMessage, weekFocus, todaysChallenge,
      closingEncouragement, lastFeedbackSnippet, contentSection,
    });
    const ok = await sendEmail(r.email, subject, html);
    if (ok) sent++;
  }

  await serviceClient.from("broadcast_log").insert([{
    sent_by: user.id,
    target_all: targetAll,
    recipient_ids: targetAll ? [] : (studentIds ?? []),
    recipient_count: sent,
    quote: quote || null,
    todays_message: todaysMessage || null,
    week_focus: weekFocus || null,
    todays_challenge: todaysChallenge || null,
    closing_encouragement: closingEncouragement || null,
    last_feedback_snippet: lastFeedbackSnippet || null,
    content_section: contentSection || null,
  }]);

  return NextResponse.json({ ok: true, sent, total: recipients.length });
}
