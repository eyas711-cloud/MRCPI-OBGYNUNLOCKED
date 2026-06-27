import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  console.log("notify-registration API called");
  const { fullName, email } = await req.json();
  console.log("Sending notification for:", email);

  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const adminEmails = ["eyas711@gmail.com", "einass_m_salih@yahoo.com"];

  try { await transporter.verify(); console.log("SMTP connection OK"); } catch (e) { console.error("SMTP verify failed:", e); return NextResponse.json({ error: "SMTP failed" }, { status: 500 }); }

  await transporter.sendMail({
    from: `"MRCPI-OBGYN Unlocked" <${process.env.SMTP_USER}>`,
    to: adminEmails.join(", "),
    subject: "New Student Registration — Pending Approval",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0b1e3d;">New Student Registration</h2>
        <p>A new student has registered and is awaiting your approval:</p>
        <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555;">Name:</td>
            <td style="padding: 8px;">${fullName}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold; color: #555;">Email:</td>
            <td style="padding: 8px;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555;">Registered at:</td>
            <td style="padding: 8px;">${new Date().toLocaleString("en-GB", { timeZone: "Asia/Riyadh" })} (KSA)</td>
          </tr>
        </table>
        <a href="https://mrcpi-obgynunlocked.com/admin" style="display:inline-block; padding: 12px 24px; background: #15b097; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Review in Admin Panel
        </a>
        <p style="margin-top: 24px; color: #888; font-size: 12px;">MRCPI-OBGYN Unlocked Platform</p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
