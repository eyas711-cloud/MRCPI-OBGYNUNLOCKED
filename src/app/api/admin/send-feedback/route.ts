import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

async function sendEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  try {
    await transporter.sendMail({
      from: `"MRCPI OBGYN Unlocked" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (e) {
    console.error("[send-feedback] Error:", e);
    return false;
  }
}

function buildEmailHtml(studentName: string, title: string, content: string, feedbackType: string, isUpdate: boolean): string {
  const typeLabel = feedbackType === "progress" ? "Progress Note" : "General Comment";
  const action = isUpdate ? "updated" : "added";
  return `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#f8f7f4;">
      <div style="background:#0B1E3D;padding:24px 32px;border-radius:12px 12px 0 0;text-align:center;">
        <p style="color:rgba(255,255,255,0.45);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 6px 0;">Instructor Feedback</p>
        <h1 style="color:#15B097;font-size:20px;margin:0;letter-spacing:0.05em;">MRCPI OBGYN Unlocked</h1>
      </div>
      <div style="background:#ffffff;padding:32px;border-radius:0 0 12px 12px;border:1px solid rgba(15,76,92,0.15);border-top:none;">
        <p style="color:#0B1E3D;font-size:16px;margin-top:0;">Dear ${studentName},</p>
        <p style="color:#0B1E3D;font-size:15px;">Your instructor has ${action} feedback on your profile.</p>

        <div style="background:#f0faf8;border-left:4px solid #15B097;border-radius:4px;padding:16px 20px;margin:20px 0;">
          <p style="margin:0 0 4px 0;font-size:12px;color:rgba(26,26,26,0.5);text-transform:uppercase;letter-spacing:0.08em;">${typeLabel}</p>
          <p style="margin:0;font-size:16px;font-weight:700;color:#0B1E3D;">${title}</p>
        </div>

        <div style="background:#f8f7f4;border:1px solid rgba(15,76,92,0.12);border-radius:8px;padding:16px 20px;margin:16px 0;">
          <p style="margin:0;font-size:14px;color:#0B1E3D;line-height:1.7;white-space:pre-line;">${content}</p>
        </div>

        <div style="text-align:center;margin:28px 0 20px 0;">
          <a href="https://mrcpi-obgynunlocked.com/dashboard"
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
        <a href="https://mrcpi-obgynunlocked.com" style="color:rgba(26,26,26,0.35);">mrcpiobgynunlocked.com</a>
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

  const { studentEmail, studentName, title, content, feedbackType, isUpdate } = await req.json();
  const subject = isUpdate
    ? `Your feedback has been updated: ${title}`
    : `New feedback from your instructor: ${title}`;
  const html = buildEmailHtml(studentName, title, content, feedbackType, isUpdate);
  const sent = await sendEmail(studentEmail, subject, html);
  return NextResponse.json({ ok: sent });
}
