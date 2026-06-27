import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { studentName, studentEmail, date, timeSlot, meetLink, bookingId } = await req.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.verify();
  } catch (e) {
    console.error("SMTP verify failed:", e);
    return NextResponse.json({ error: "SMTP failed" }, { status: 500 });
  }

  await transporter.sendMail({
    from: `"MRCPI-OBGYN Unlocked" <${process.env.SMTP_USER}>`,
    to: studentEmail,
    subject: "Your Mock OSCE Session is Confirmed",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <div style="background: #0b1e3d; padding: 32px 40px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #ffffff; font-size: 22px; margin: 0 0 4px 0;">Mock OSCE Session Confirmed</h1>
          <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 13px;">MRCPI-OBGYN Unlocked</p>
        </div>
        <div style="background: #ffffff; padding: 32px 40px; border: 1px solid #e5e5e5; border-top: none;">
          <p style="font-size: 15px; margin: 0 0 20px 0;">Dear ${studentName},</p>
          <p style="font-size: 15px; color: #444; margin: 0 0 24px 0;">
            Your Mock OSCE session has been confirmed. Please find your session details below.
          </p>

          <table style="width:100%; border-collapse: collapse; margin-bottom: 28px; background: #f9f9f9; border-radius: 8px; overflow: hidden;">
            <tr>
              <td style="padding: 12px 16px; font-weight: bold; color: #555; font-size: 13px; width: 140px;">Date</td>
              <td style="padding: 12px 16px; font-size: 14px; color: #0b1e3d; font-weight: 600;">${date}</td>
            </tr>
            <tr style="background: #f0f0f0;">
              <td style="padding: 12px 16px; font-weight: bold; color: #555; font-size: 13px;">Time</td>
              <td style="padding: 12px 16px; font-size: 14px; color: #0b1e3d; font-weight: 600;">${timeSlot} (Arabia Standard Time)</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: bold; color: #555; font-size: 13px;">Meeting Link</td>
              <td style="padding: 12px 16px; font-size: 14px;">
                <a href="${meetLink}" style="color: #15b097; font-weight: 600;">${meetLink}</a>
              </td>
            </tr>
          </table>

          <a href="${meetLink}" style="display:inline-block; padding: 14px 28px; background: #15b097; color: #0b1e3d; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; margin-bottom: 28px;">
            Join Your Session
          </a>

          <div style="background: #f0f7f6; border-left: 3px solid #15b097; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
            <p style="font-weight: bold; color: #0b1e3d; margin: 0 0 8px 0; font-size: 13px;">Preparation Checklist</p>
            <ul style="margin: 0; padding-left: 18px; color: #444; font-size: 13px; line-height: 1.8;">
              <li>Join the meeting 5 minutes before the scheduled time</li>
              <li>Ensure you have a quiet, private space with good lighting</li>
              <li>Test your microphone and camera before the session</li>
              <li>Have a pen and paper ready for station brief notes</li>
              <li>Dress professionally as you would for a real OSCE</li>
            </ul>
          </div>

          <p style="font-size: 13px; color: #888;">
            If you need to reschedule or have any questions, please contact us at
            <a href="mailto:info@mrcpi-obgynunlocked.com" style="color: #15b097;">info@mrcpi-obgynunlocked.com</a>
          </p>

          <p style="font-size: 14px; color: #444; margin-top: 24px;">
            We look forward to seeing you in your session.<br/>
            <strong style="color: #0b1e3d;">Dr. Einas Diab</strong><br/>
            <span style="color: #888; font-size: 12px;">MRCPI-OBGYN Unlocked</span>
          </p>
        </div>
        <div style="background: #f5f5f5; padding: 16px 40px; border-radius: 0 0 12px 12px; text-align: center;">
          <p style="color: #aaa; font-size: 11px; margin: 0;">MRCPI-OBGYN Unlocked Platform · mrcpi-obgynunlocked.com</p>
        </div>
      </div>
    `,
  });

  return NextResponse.json({ ok: true, bookingId });
}
