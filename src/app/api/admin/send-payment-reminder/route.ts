import { createClient } from "@/lib/supabase-server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

function serviceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function transporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

function buildReminderHtml(name: string, paid: number, pending: number, batchName: string) {
  const firstName = name.split(" ")[0] || "Doctor";
  return `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#f8f7f4;">
      <div style="background:#0B1E3D;padding:24px 32px;border-radius:12px 12px 0 0;text-align:center;">
        <p style="color:rgba(255,255,255,0.45);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 6px 0;">Payment Reminder</p>
        <h1 style="color:#15B097;font-size:20px;margin:0;letter-spacing:0.05em;">MRCPI OBGYN Unlocked</h1>
      </div>
      <div style="background:#ffffff;padding:32px;border-radius:0 0 12px 12px;border:1px solid rgba(15,76,92,0.15);border-top:none;">
        <p style="color:#0B1E3D;font-size:16px;margin-top:0;">Dear ${firstName},</p>
        <p style="color:#1a1a1a;font-size:15px;line-height:1.7;">
          We hope your MRCPI OBGYN OSCE preparation is going well. This is a friendly reminder
          regarding your outstanding course fee balance for <strong>${batchName}</strong>.
        </p>

        <div style="background:#f0faf8;border:1px solid rgba(21,176,151,0.25);border-radius:10px;padding:20px 24px;margin:24px 0;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:6px 0;color:rgba(26,26,26,0.6);font-size:14px;">Amount Paid</td>
              <td style="padding:6px 0;text-align:right;font-size:15px;font-weight:700;color:#15B097;">SAR ${paid.toLocaleString()}</td>
            </tr>
            <tr style="border-top:1px solid rgba(15,76,92,0.1);">
              <td style="padding:6px 0;color:rgba(26,26,26,0.6);font-size:14px;">Remaining Balance</td>
              <td style="padding:6px 0;text-align:right;font-size:15px;font-weight:700;color:#C9A227;">SAR ${pending.toLocaleString()}</td>
            </tr>
          </table>
        </div>

        <p style="color:#1a1a1a;font-size:15px;line-height:1.7;">
          Kindly arrange payment of the outstanding amount at your earliest convenience to ensure
          uninterrupted access to all course materials and sessions.
        </p>
        <p style="color:#1a1a1a;font-size:14px;line-height:1.6;">
          If you have already made this payment or have any questions, please don't hesitate to
          contact us at
          <a href="mailto:info@mrcpiobgynunlocked.com" style="color:#15B097;">info@mrcpiobgynunlocked.com</a>
          or via WhatsApp at <a href="https://wa.me/201559912306" style="color:#15B097;">+20 155 991 2306</a>.
        </p>
        <p style="color:#1a1a1a;font-size:14px;margin-bottom:0;">
          Kind regards,<br/>
          <strong>Dr. Einas Diab &amp; the MRCPI OBGYN Unlocked Team</strong>
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

  const { studentId, testOnly } = await req.json();
  const service = serviceClient();

  const { data: student } = await service
    .from("batch_students")
    .select("*, payment_batches(name)")
    .eq("id", studentId)
    .single();

  if (!student) return NextResponse.json({ error: "Student not found." }, { status: 404 });

  const toEmail = testOnly ? user.email! : student.email;
  if (!toEmail) return NextResponse.json({ error: "No email address on file for this student." }, { status: 400 });

  const batchName = (student.payment_batches as { name: string } | null)?.name ?? "MRCPI OBGYN Course";
  const html = buildReminderHtml(student.student_name, Number(student.paid), Number(student.pending), batchName);

  try {
    await transporter().sendMail({
      from: `"MRCPI OBGYN Unlocked" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: testOnly
        ? `[TEST] Payment Reminder — ${student.student_name}`
        : `Payment Reminder — Outstanding Balance for ${batchName}`,
      html,
    });
  } catch (e) {
    console.error("[send-payment-reminder] Email failed:", e);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }

  // Update last_reminded_at (skip for test sends)
  if (!testOnly) {
    await service.from("batch_students").update({ last_reminded_at: new Date().toISOString() }).eq("id", studentId);
  }

  return NextResponse.json({ ok: true });
}

// Admin notification digest — called when checking for due students
export async function GET(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || (profile.role !== "admin" && profile.role !== "instructor")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(req.url);
  const intervalDays = parseInt(url.searchParams.get("interval") ?? "30");
  const notify = url.searchParams.get("notify") === "1";

  const service = serviceClient();

  // Get all students with pending > 0
  const { data: students } = await service
    .from("batch_students")
    .select("*, payment_batches(name)")
    .gt("pending", 0)
    .not("student_name", "eq", "");

  if (!students) return NextResponse.json({ due: [] });

  const now = Date.now();
  const intervalMs = intervalDays * 24 * 60 * 60 * 1000;

  const due = students.filter(s => {
    if (!s.last_reminded_at) return true; // never reminded → always due
    return (now - new Date(s.last_reminded_at).getTime()) >= intervalMs;
  });

  // Optionally email the admin a digest
  if (notify && due.length > 0 && user.email) {
    const rows = due.map((s, i) =>
      `<tr style="background:${i % 2 === 0 ? "#f9fafb" : "#ffffff"}">
        <td style="padding:8px 12px;font-size:14px;color:#0B1E3D;">${s.student_name}</td>
        <td style="padding:8px 12px;font-size:14px;color:#15B097;text-align:right;">SAR ${Number(s.paid).toLocaleString()}</td>
        <td style="padding:8px 12px;font-size:14px;color:#C9A227;font-weight:700;text-align:right;">SAR ${Number(s.pending).toLocaleString()}</td>
        <td style="padding:8px 12px;font-size:13px;color:rgba(26,26,26,0.5);">${s.last_reminded_at ? new Date(s.last_reminded_at).toLocaleDateString("en-GB") : "Never"}</td>
      </tr>`
    ).join("");

    const html = `
      <div style="font-family:Georgia,serif;max-width:640px;margin:0 auto;padding:32px 24px;background:#f8f7f4;">
        <div style="background:#0B1E3D;padding:24px 32px;border-radius:12px 12px 0 0;text-align:center;">
          <p style="color:rgba(255,255,255,0.45);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 6px 0;">Admin Alert</p>
          <h1 style="color:#15B097;font-size:20px;margin:0;">MRCPI OBGYN Unlocked</h1>
        </div>
        <div style="background:#fff;padding:32px;border-radius:0 0 12px 12px;border:1px solid rgba(15,76,92,0.15);border-top:none;">
          <p style="color:#0B1E3D;font-size:16px;margin-top:0;font-weight:700;">
            ${due.length} student${due.length !== 1 ? "s" : ""} ${due.length !== 1 ? "are" : "is"} due for a payment reminder
          </p>
          <p style="color:#1a1a1a;font-size:14px;">The following students have outstanding balances and have not been reminded in the last ${intervalDays} days:</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;border-radius:8px;overflow:hidden;">
            <thead>
              <tr style="background:#0B1E3D;">
                <th style="padding:10px 12px;text-align:left;font-size:12px;color:rgba(255,255,255,0.7);font-weight:600;">Student</th>
                <th style="padding:10px 12px;text-align:right;font-size:12px;color:rgba(255,255,255,0.7);font-weight:600;">Paid</th>
                <th style="padding:10px 12px;text-align:right;font-size:12px;color:rgba(255,255,255,0.7);font-weight:600;">Pending</th>
                <th style="padding:10px 12px;text-align:left;font-size:12px;color:rgba(255,255,255,0.7);font-weight:600;">Last Reminded</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <p style="color:#1a1a1a;font-size:14px;">Log in to the admin panel to send individual reminders.</p>
          <a href="https://mrcpiobgynunlocked.com/admin" style="display:inline-block;padding:12px 24px;background:#15B097;color:#0B1E3D;text-decoration:none;border-radius:8px;font-weight:700;font-size:14px;margin-top:8px;">Open Admin Panel →</a>
        </div>
        <p style="text-align:center;font-size:12px;color:rgba(26,26,26,0.35);margin-top:16px;">
          © ${new Date().getFullYear()} MRCPI OBGYN Unlocked
        </p>
      </div>
    `;

    try {
      await transporter().sendMail({
        from: `"MRCPI OBGYN Unlocked" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: `[Admin] ${due.length} payment reminder${due.length !== 1 ? "s" : ""} due — MRCPI OBGYN Unlocked`,
        html,
      });
    } catch (e) {
      console.error("[payment-reminder] Admin digest failed:", e);
    }
  }

  return NextResponse.json({ due: due.map(s => s.id) });
}
