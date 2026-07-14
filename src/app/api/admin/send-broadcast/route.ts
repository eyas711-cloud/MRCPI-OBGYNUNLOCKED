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

  const card = (icon: string, label: string, body: string, italic = false) => `
    <div style="background:#f0faf8;border-radius:12px;padding:18px 20px;margin-bottom:14px;">
      <p style="margin:0 0 6px 0;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#15B097;font-family:Georgia,serif;">${icon ? icon + " " : ""}${label}</p>
      <p style="margin:0;font-size:15px;color:#0B1E3D;line-height:1.75;font-family:Georgia,serif;white-space:pre-line;${italic ? "font-style:italic;" : ""}">${body}</p>
    </div>`;

  const sections = [
    todaysMessage     ? card("✉", "Today&rsquo;s Message",    todaysMessage)     : "",
    weekFocus         ? card("🎯", "This Week&rsquo;s Focus",  weekFocus)         : "",
    todaysChallenge   ? card("⚡", "Today&rsquo;s Challenge",  todaysChallenge)   : "",
    closingEncouragement ? card("💬", "Closing Encouragement", closingEncouragement, true) : "",
  ].filter(Boolean).join("");

  const footerRows = [
    lastFeedbackSnippet ? card("📌", "Where We Left Off", `"${lastFeedbackSnippet}"`, true) : "",
    contentSection      ? card("📚", "Content to Focus On", contentSection)                  : "",
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
    <p style="color:#0B1E3D;font-size:17px;margin:0 0 24px 0;">Dear ${studentName},</p>

    ${quote ? `
    <div style="background:#0B1E3D;border-radius:12px;padding:20px 24px;margin-bottom:20px;text-align:center;">
      <p style="margin:0;font-size:16px;font-style:italic;color:#ffffff;line-height:1.7;font-family:Georgia,serif;">${quote}</p>
    </div>` : ""}

    ${sections}

  </div>

  ${footerRows ? `
  <div style="background:#0B1E3D;border-radius:16px;padding:28px 28px 20px 28px;margin-top:16px;">
    <p style="margin:0 0 16px 0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#15B097;text-align:center;font-family:Georgia,serif;">Keep Your Momentum Alive</p>
    ${footerRows}
    <div style="text-align:center;margin-top:16px;">
      <a href="https://mrcpi-obgynunlocked.com/dashboard"
         style="background:#15B097;color:#0B1E3D;padding:14px 36px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;font-family:Georgia,serif;letter-spacing:0.02em;">
        Resume Learning →
      </a>
    </div>
  </div>` : `
  <div style="text-align:center;margin-top:20px;">
    <a href="https://mrcpi-obgynunlocked.com/dashboard"
       style="background:#0B1E3D;color:#15B097;padding:14px 36px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;font-family:Georgia,serif;">
      Resume Learning →
    </a>
  </div>`}

  <div style="text-align:center;margin-top:24px;">
    <p style="margin:0;font-size:14px;color:rgba(26,26,26,0.55);font-family:Georgia,serif;">With care,</p>
    <p style="margin:4px 0 0 0;font-size:16px;font-weight:700;color:#0B1E3D;font-family:Georgia,serif;">Dr. Einas Diab</p>
    <p style="margin:2px 0 8px 0;font-size:12px;color:#15B097;font-family:Georgia,serif;">MRCPI OBGYN Unlocked</p>
  </div>

  <p style="text-align:center;font-size:11px;color:rgba(26,26,26,0.3);margin-top:16px;font-family:Georgia,serif;">
    © ${new Date().getFullYear()} MRCPI OBGYN Unlocked &nbsp;·&nbsp;
    <a href="https://mrcpi-obgynunlocked.com" style="color:rgba(26,26,26,0.3);text-decoration:none;">mrcpi-obgynunlocked.com</a>
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
