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
      from: `"MRCPI OBGYN Unlocked" <${process.env.SMTP_USER}>`,
      to, subject, html,
    });
    return true;
  } catch (e) {
    console.error("[reinstate] Email error:", e);
    return false;
  }
}

export async function POST(req: Request) {
  const { email, name, logId } = await req.json();
  if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

  const serviceClient = createServiceClient();
  const firstName = (name || "Doctor").split(" ")[0];

  // Find the existing profile by email and reactivate it
  const { data: profile, error: findErr } = await serviceClient
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (findErr || !profile) {
    console.error("[reinstate] Could not find profile for email:", email, findErr?.message);
    return NextResponse.json({ error: "Student profile not found. They may need to re-register." }, { status: 404 });
  }

  const { error: updateErr } = await serviceClient
    .from("profiles")
    .update({ status: "active" })
    .eq("id", profile.id);

  if (updateErr) {
    console.error("[reinstate] Profile update error:", updateErr.message);
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  const loginUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/login`;

  await sendEmail(
    email,
    "Your Access Has Been Reinstated — MRCPI OBGYN Unlocked",
    `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#f8f7f4;">
      <div style="background:#0B1E3D;padding:24px 32px;border-radius:12px 12px 0 0;text-align:center;">
        <h1 style="color:#15B097;font-size:20px;margin:0;letter-spacing:0.05em;">MRCPI OBGYN Unlocked</h1>
      </div>
      <div style="background:#ffffff;padding:36px 32px;border-radius:0 0 12px 12px;border:1px solid rgba(15,76,92,0.15);border-top:none;">
        <p style="color:#0B1E3D;font-size:16px;margin-top:0;">Dear Dr. ${firstName},</p>
        <p style="color:#1a1a1a;font-size:15px;line-height:1.8;margin-bottom:20px;">
          We are pleased to inform you that your access to the <strong style="color:#0B1E3D;">MRCPI OBGYN Unlocked</strong> platform has been reinstated, effective immediately.
        </p>
        <p style="color:#1a1a1a;font-size:15px;line-height:1.8;margin-bottom:28px;">
          You can log back in using your existing email address and password.
        </p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${loginUrl}"
             style="background:#15B097;color:#0B1E3D;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;">
            Log In to My Dashboard →
          </a>
        </div>
        <hr style="border:none;border-top:1px solid rgba(15,76,92,0.1);margin:24px 0;" />
        <p style="color:#1a1a1a;font-size:14px;margin:0;">
          With respect,<br/>
          <strong style="color:#0B1E3D;">Dr. Einas Diab &amp; the MRCPI OBGYN Unlocked Team</strong>
        </p>
      </div>
      <p style="text-align:center;font-size:12px;color:rgba(26,26,26,0.35);margin-top:16px;">
        © ${new Date().getFullYear()} MRCPI OBGYN Unlocked &nbsp;·&nbsp;
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color:rgba(26,26,26,0.35);">mrcpi-obgynunlocked.com</a>
      </p>
    </div>
    `
  );

  // Delete the blocked log entry
  if (logId) {
    await serviceClient.from("audit_logs").delete().eq("id", logId);
  }

  await serviceClient.from("audit_logs").insert([{
    action: "student_reinstate_from_block",
    resource: profile.id,
    details: { reinstated_email: email, reinstated_name: name },
  }]);

  return NextResponse.json({ ok: true });
}
