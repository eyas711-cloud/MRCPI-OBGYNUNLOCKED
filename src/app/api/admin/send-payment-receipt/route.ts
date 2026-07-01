import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

function transporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

function buildReceiptHtml(p: {
  receipt_number: string;
  payment_date: string;
  student_name: string;
  student_email: string;
  amount: number;
  payment_status: "paid_full" | "paid_part";
  total_fee: number;
  remaining_fee: number;
  currency: string;
}) {
  const fmt = (n: number) => `${p.currency} ${Number(n).toLocaleString()}`;
  const dateStr = new Date(p.payment_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const isPaidFull = p.payment_status === "paid_full";

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Georgia,serif;">
<div style="max-width:640px;margin:32px auto;background:#faf8f3;border:1px solid rgba(0,0,0,0.08);border-radius:4px;overflow:hidden;">

  <!-- HEADER -->
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 40px 24px;">
    <tr>
      <td style="vertical-align:top;width:50%;">
        <!-- Logo text block (image not available in email) -->
        <div style="display:inline-block;">
          <p style="margin:0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#0B1E3D;font-weight:700;">MRCPI-OBGYN</p>
          <p style="margin:2px 0 0;font-size:13px;color:#15B097;letter-spacing:0.08em;border-bottom:2px solid #C9A227;padding-bottom:2px;">Unlocked</p>
        </div>
      </td>
      <td style="text-align:right;vertical-align:top;">
        <h1 style="margin:0;font-size:26px;font-weight:700;color:#6B1E2E;letter-spacing:0.08em;text-transform:uppercase;">PAYMENT RECEIPT</h1>
        <div style="margin:6px 0 0;text-align:right;">
          <div style="display:inline-block;width:100px;height:1px;background:#C9A227;vertical-align:middle;"></div>
          <span style="color:#C9A227;font-size:14px;vertical-align:middle;"> ◇ </span>
          <div style="display:inline-block;width:100px;height:1px;background:#C9A227;vertical-align:middle;"></div>
        </div>
      </td>
    </tr>
  </table>

  <!-- RECEIPT META -->
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 40px 28px;">
    <tr>
      <td width="50%"></td>
      <td style="font-size:13px;color:#1a1a1a;line-height:2;">
        <table cellpadding="0" cellspacing="0" width="100%">
          ${[
            ["Receipt No.", p.receipt_number],
            ["Date", dateStr],
            ["Student Name", p.student_name],
            ["Email", p.student_email],
          ].map(([label, val]) => `
          <tr>
            <td style="color:rgba(26,26,26,0.65);font-size:13px;padding:2px 0;white-space:nowrap;">${label}:</td>
            <td style="padding:2px 0 2px 8px;font-size:13px;color:#0B1E3D;border-bottom:1px solid #C9A227;min-width:180px;">${val}</td>
          </tr>`).join("")}
        </table>
      </td>
    </tr>
  </table>

  <!-- DIVIDER -->
  <div style="border-top:1px solid #C9A227;margin:0 40px;"></div>

  <!-- THANK YOU -->
  <p style="text-align:center;font-size:14px;color:#1a1a1a;padding:20px 40px 16px;">Thank you for your payment for the following course.</p>

  <!-- COURSE BOX -->
  <div style="margin:0 40px;background:#6B1E2E;border-radius:8px;padding:20px 24px;display:flex;align-items:center;">
    <table cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="width:56px;vertical-align:middle;">
          <div style="width:48px;height:48px;border-radius:50%;border:2px solid #C9A227;display:flex;align-items:center;justify-content:center;text-align:center;line-height:48px;">
            <span style="color:#C9A227;font-size:22px;">&#9635;</span>
          </div>
        </td>
        <td style="vertical-align:middle;padding-left:16px;">
          <p style="margin:0 0 2px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#C9A227;">Course</p>
          <p style="margin:0;font-size:22px;font-weight:700;color:#C9A227;letter-spacing:0.05em;">MRCPI-OBGYN OSCE</p>
        </td>
      </tr>
    </table>
  </div>

  <!-- PAYMENT SUMMARY -->
  <div style="margin:24px 40px 0;border:1px solid #6B1E2E;border-radius:8px;overflow:hidden;">
    <div style="background:#6B1E2E;padding:12px 24px;text-align:center;">
      <p style="margin:0;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#C9A227;font-weight:700;">Payment Summary</p>
    </div>

    <!-- Row: Amount Paid -->
    <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid rgba(107,30,46,0.15);">
      <tr>
        <td style="padding:16px 20px;width:55%;border-right:1px solid rgba(107,30,46,0.12);">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="width:40px;vertical-align:middle;">
              <div style="width:34px;height:34px;background:#6B1E2E;border-radius:50%;text-align:center;line-height:34px;">
                <span style="color:#C9A227;font-size:16px;">&#128179;</span>
              </div>
            </td>
            <td style="padding-left:12px;vertical-align:middle;">
              <p style="margin:0;font-size:13px;font-weight:700;color:#1a1a1a;text-transform:uppercase;">Amount Paid</p>
              <p style="margin:2px 0 0;font-size:11px;color:rgba(26,26,26,0.5);">(Please enter amount)</p>
            </td>
          </tr></table>
        </td>
        <td style="padding:16px 20px;text-align:center;">
          <div style="border:1px solid rgba(107,30,46,0.2);border-radius:4px;padding:10px 16px;display:inline-block;min-width:140px;text-align:left;">
            <p style="margin:0;font-size:16px;font-weight:700;color:#0B1E3D;">${fmt(p.amount)}</p>
          </div>
        </td>
      </tr>
    </table>

    <!-- Row: Payment Status -->
    <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid rgba(107,30,46,0.15);">
      <tr>
        <td style="padding:16px 20px;width:55%;border-right:1px solid rgba(107,30,46,0.12);">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="width:40px;vertical-align:middle;">
              <div style="width:34px;height:34px;background:#6B1E2E;border-radius:50%;text-align:center;line-height:34px;">
                <span style="color:#C9A227;font-size:16px;">&#10003;</span>
              </div>
            </td>
            <td style="padding-left:12px;vertical-align:middle;">
              <p style="margin:0;font-size:13px;font-weight:700;color:#1a1a1a;text-transform:uppercase;">Payment Status</p>
              <p style="margin:2px 0 0;font-size:11px;color:rgba(26,26,26,0.5);">(Please select one)</p>
            </td>
          </tr></table>
        </td>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 6px;font-size:13px;color:#1a1a1a;">
            <span style="display:inline-block;width:14px;height:14px;border:1.5px solid #6B1E2E;border-radius:2px;vertical-align:middle;margin-right:6px;background:${isPaidFull ? "#6B1E2E" : "transparent"};"></span>
            <strong>PAID IN FULL</strong>
          </p>
          <p style="margin:0;font-size:13px;color:#1a1a1a;">
            <span style="display:inline-block;width:14px;height:14px;border:1.5px solid #6B1E2E;border-radius:2px;vertical-align:middle;margin-right:6px;background:${!isPaidFull ? "#6B1E2E" : "transparent"};"></span>
            <strong>PAID IN PART</strong>
          </p>
        </td>
      </tr>
    </table>

    <!-- Row: Total Course Fee -->
    <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid rgba(107,30,46,0.15);">
      <tr>
        <td style="padding:16px 20px;width:55%;border-right:1px solid rgba(107,30,46,0.12);">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="width:40px;vertical-align:middle;">
              <div style="width:34px;height:34px;background:#6B1E2E;border-radius:50%;text-align:center;line-height:34px;">
                <span style="color:#C9A227;font-size:14px;">&#128200;</span>
              </div>
            </td>
            <td style="padding-left:12px;vertical-align:middle;">
              <p style="margin:0;font-size:13px;font-weight:700;color:#1a1a1a;text-transform:uppercase;">Total Course Fee</p>
              <p style="margin:2px 0 0;font-size:11px;color:rgba(26,26,26,0.5);">(Please enter total fee)</p>
            </td>
          </tr></table>
        </td>
        <td style="padding:16px 20px;text-align:center;">
          <div style="border:1px solid rgba(107,30,46,0.2);border-radius:4px;padding:10px 16px;display:inline-block;min-width:140px;text-align:left;">
            <p style="margin:0;font-size:16px;font-weight:700;color:#0B1E3D;">${fmt(p.total_fee)}</p>
          </div>
        </td>
      </tr>
    </table>

    <!-- Row: Remaining Fees -->
    <table width="100%" cellpadding="0" cellspacing="0;">
      <tr>
        <td style="padding:16px 20px;width:55%;border-right:1px solid rgba(107,30,46,0.12);">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="width:40px;vertical-align:middle;">
              <div style="width:34px;height:34px;background:#6B1E2E;border-radius:50%;text-align:center;line-height:34px;">
                <span style="color:#C9A227;font-size:14px;">&#9685;</span>
              </div>
            </td>
            <td style="padding-left:12px;vertical-align:middle;">
              <p style="margin:0;font-size:13px;font-weight:700;color:#1a1a1a;text-transform:uppercase;">Remaining Fees</p>
              <p style="margin:2px 0 0;font-size:11px;color:rgba(26,26,26,0.5);">(If any)</p>
            </td>
          </tr></table>
        </td>
        <td style="padding:16px 20px;text-align:center;">
          <div style="border:1px solid rgba(107,30,46,0.2);border-radius:4px;padding:10px 16px;display:inline-block;min-width:140px;text-align:left;">
            <p style="margin:0;font-size:16px;font-weight:700;color:${p.remaining_fee > 0 ? "#C9A227" : "#15B097"};">${fmt(p.remaining_fee)}</p>
          </div>
        </td>
      </tr>
    </table>

    ${!isPaidFull ? `<div style="padding:10px 20px 14px;background:rgba(107,30,46,0.04);border-top:1px solid rgba(107,30,46,0.1);">
      <p style="margin:0;font-size:12px;color:rgba(26,26,26,0.6);font-style:italic;">If paid in part, the remaining balance is due as per the payment terms communicated.</p>
    </div>` : ""}
  </div>

  <!-- IMPORTANT NOTES -->
  <div style="margin:28px 40px 0;">
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#C9A227;">Important Notes</p>
    <div style="border-top:1px solid #C9A227;padding-top:12px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="vertical-align:top;width:60%;">
            <ul style="margin:0;padding:0 0 0 18px;font-size:13px;color:#1a1a1a;line-height:1.8;">
              <li>This receipt is confirmation of payment received.</li>
              <li>Please retain this receipt for your records.</li>
              <li>For any queries, contact us at<br/><a href="mailto:info@mrcpi-obgynunlocked.com" style="color:#6B1E2E;font-weight:700;">info@mrcpi-obgynunlocked.com</a></li>
            </ul>
          </td>
          <td style="vertical-align:top;text-align:right;padding-top:4px;">
            <div style="border-top:1px solid #1a1a1a;padding-top:8px;display:inline-block;min-width:160px;text-align:center;">
              <p style="margin:0;font-size:13px;font-weight:700;color:#1a1a1a;">Authorised By</p>
              <p style="margin:4px 0 0;font-size:13px;color:#1a1a1a;">MRCPI-OBGYN Unlocked</p>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>

  <!-- FOOTER -->
  <div style="margin-top:28px;background:#6B1E2E;padding:14px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="font-size:12px;color:rgba(255,255,255,0.85);">
          <span style="margin-right:6px;">&#127760;</span> mrcpiobgynunlocked.com
        </td>
        <td style="text-align:right;font-size:12px;color:rgba(255,255,255,0.85);">
          <span style="margin-right:6px;">&#9993;</span> info@mrcpi-obgynunlocked.com
        </td>
      </tr>
    </table>
  </div>

</div>
</body>
</html>
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

  const body = await req.json();
  const { paymentId, testOnly } = body;

  const { data: payment } = await supabase
    .from("payments")
    .select("*")
    .eq("id", paymentId)
    .single();

  if (!payment) return NextResponse.json({ error: "Payment not found." }, { status: 404 });

  const toEmail = testOnly ? user.email! : payment.student_email;

  const html = buildReceiptHtml({
    receipt_number: payment.receipt_number ?? `RCP-${String(payment.id).slice(0, 6).toUpperCase()}`,
    payment_date: payment.payment_date,
    student_name: payment.student_name,
    student_email: payment.student_email,
    amount: Number(payment.amount),
    payment_status: payment.payment_status ?? "paid_full",
    total_fee: Number(payment.total_fee ?? payment.amount),
    remaining_fee: Number(payment.remaining_fee ?? 0),
    currency: payment.currency ?? "SAR",
  });

  try {
    await transporter().sendMail({
      from: `"MRCPI OBGYN Unlocked" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: testOnly
        ? `[TEST] Payment Receipt — ${payment.student_name}`
        : `Payment Receipt — MRCPI OBGYN OSCE Course`,
      html,
    });
  } catch (e) {
    console.error("[send-payment-receipt] Email failed:", e);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
