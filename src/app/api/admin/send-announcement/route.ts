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

export function buildAnnouncementHtml(subject: string, body: string): string {
  const bodyHtml = body
    .split("\n")
    .map((line: string) =>
      line.trim()
        ? `<p style="color:#1a1a1a;font-size:15px;line-height:1.7;margin:0 0 12px 0;">${line}</p>`
        : "<br/>"
    )
    .join("");

  return `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#f8f7f4;">
      <div style="background:#0B1E3D;padding:24px 32px;border-radius:12px 12px 0 0;text-align:center;">
        <p style="color:rgba(255,255,255,0.45);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 6px 0;">Announcement</p>
        <h1 style="color:#15B097;font-size:20px;margin:0;letter-spacing:0.05em;">MRCPI OBGYN Unlocked</h1>
      </div>
      <div style="background:#ffffff;padding:32px;border-radius:0 0 12px 12px;border:1px solid rgba(15,76,92,0.15);border-top:none;">
        <h2 style="color:#0B1E3D;font-size:17px;margin:0 0 20px 0;font-weight:700;">${subject}</h2>
        ${bodyHtml}
        <hr style="border:none;border-top:1px solid rgba(15,76,92,0.1);margin:24px 0;" />
        <p style="color:rgba(26,26,26,0.5);font-size:13px;margin:0;">
          If you have questions, contact us at
          <a href="mailto:info@mrcpiobgynunlocked.com" style="color:#15B097;">info@mrcpiobgynunlocked.com</a>
          or via WhatsApp at <a href="https://wa.me/201559912306" style="color:#15B097;">+20 155 991 2306</a>.
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

  const { data: profile } = await supabase.from("profiles").select("role, email").eq("id", user.id).single();
  if (!profile || (profile.role !== "admin" && profile.role !== "instructor")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { subject, body, testOnly } = await req.json();
  if (!subject?.trim() || !body?.trim()) {
    return NextResponse.json({ error: "Subject and body are required." }, { status: 400 });
  }

  const html = buildAnnouncementHtml(subject, body);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Test mode — send only to the logged-in admin
  if (testOnly) {
    try {
      await transporter.sendMail({
        from: `"MRCPI OBGYN Unlocked" <${process.env.SMTP_USER}>`,
        to: user.email!,
        subject: `[TEST] ${subject}`,
        html,
      });
      return NextResponse.json({ ok: true, count: 1 });
    } catch (e) {
      console.error("[send-announcement] Test email failed:", e);
      return NextResponse.json({ error: "Failed to send test email." }, { status: 500 });
    }
  }

  // Real send — fetch all active students
  const service = createServiceClient();
  const { data: students } = await service
    .from("profiles")
    .select("email, full_name")
    .eq("role", "student")
    .eq("status", "active");

  if (!students || students.length === 0) {
    return NextResponse.json({ error: "No active students found." }, { status: 404 });
  }

  let sent = 0;
  for (const student of students) {
    try {
      await transporter.sendMail({
        from: `"MRCPI OBGYN Unlocked" <${process.env.SMTP_USER}>`,
        to: student.email,
        subject,
        html,
      });
      sent++;
    } catch (e) {
      console.error(`[send-announcement] Failed to send to ${student.email}:`, e);
    }
  }

  return NextResponse.json({ ok: true, count: sent });
}
