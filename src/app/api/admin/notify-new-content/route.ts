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
  await transporter.sendMail({
    from: `"MRCPI OBGYN Unlocked" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}

function buildEmailHtml(sectionLabel: string, subsectionLabel: string | null, title: string, contentType: string): string {
  const typeIcon: Record<string, string> = {
    video: "🎬",
    "recorded-session": "🎙️",
    pdf: "📄",
    flashcard: "🗂️",
  };
  const icon = typeIcon[contentType] || "📁";

  return `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#f8f7f4;">
      <div style="background:#0B1E3D;padding:24px 32px;border-radius:12px 12px 0 0;text-align:center;">
        <p style="color:rgba(255,255,255,0.45);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 6px 0;">New Content Available</p>
        <h1 style="color:#15B097;font-size:20px;margin:0;letter-spacing:0.05em;">MRCPI OBGYN Unlocked</h1>
      </div>
      <div style="background:#ffffff;padding:32px;border-radius:0 0 12px 12px;border:1px solid rgba(15,76,92,0.15);border-top:none;">
        <p style="color:#0B1E3D;font-size:16px;margin-top:0;">New material has been added to your course!</p>

        <div style="background:#f0faf8;border-left:4px solid #15B097;border-radius:4px;padding:16px 20px;margin:20px 0;">
          <p style="margin:0 0 6px 0;font-size:13px;color:rgba(26,26,26,0.5);text-transform:uppercase;letter-spacing:0.08em;">Section</p>
          <p style="margin:0;font-size:15px;font-weight:700;color:#0B1E3D;">${sectionLabel}${subsectionLabel ? ` › ${subsectionLabel}` : ""}</p>
        </div>

        <div style="background:#f8f7f4;border:1px solid rgba(15,76,92,0.12);border-radius:8px;padding:16px 20px;margin:16px 0;display:flex;align-items:center;gap:12px;">
          <span style="font-size:28px;">${icon}</span>
          <div>
            <p style="margin:0 0 2px 0;font-size:13px;color:rgba(26,26,26,0.5);">Title</p>
            <p style="margin:0;font-size:15px;font-weight:600;color:#0B1E3D;">${title}</p>
          </div>
        </div>

        <div style="text-align:center;margin:28px 0 20px 0;">
          <a href="https://mrcpiobgynunlocked.com/dashboard"
             style="background:#15B097;color:#0B1E3D;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;">
            View in My Dashboard →
          </a>
        </div>

        <hr style="border:none;border-top:1px solid rgba(15,76,92,0.1);margin:24px 0;" />
        <p style="color:rgba(26,26,26,0.5);font-size:13px;margin:0;">
          Questions? Contact us at
          <a href="mailto:info@mrcpiobgynunlocked.com" style="color:#15B097;">info@mrcpiobgynunlocked.com</a>
          or WhatsApp <a href="https://wa.me/201559912306" style="color:#15B097;">+20 155 991 2306</a>.
        </p>
      </div>
      <p style="text-align:center;font-size:12px;color:rgba(26,26,26,0.35);margin-top:16px;">
        © ${new Date().getFullYear()} MRCPI OBGYN Unlocked &nbsp;·&nbsp;
        <a href="https://mrcpiobgynunlocked.com" style="color:rgba(26,26,26,0.35);">mrcpiobgynunlocked.com</a>
      </p>
    </div>
  `;
}

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || (profile.role !== "admin" && profile.role !== "instructor")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { sectionLabel, subsectionLabel, title, contentType } = await req.json();

  const serviceClient = createServiceClient();
  const { data: students } = await serviceClient
    .from("profiles")
    .select("email, full_name")
    .eq("status", "active")
    .eq("role", "student");

  if (!students || students.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  const subject = `New ${sectionLabel} material added: ${title}`;
  const html = buildEmailHtml(sectionLabel, subsectionLabel || null, title, contentType);

  let sent = 0;
  for (const student of students) {
    try {
      await sendEmail(student.email, subject, html);
      sent++;
    } catch (e) {
      console.error(`[notify-new-content] Failed to send to ${student.email}:`, e);
    }
  }

  return NextResponse.json({ ok: true, sent });
}
