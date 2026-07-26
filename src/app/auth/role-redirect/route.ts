import { createClient } from "@/lib/supabase-server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import nodemailer from "nodemailer";

function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function notifyAdminOfReinstate(email: string, name: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  try {
    await transporter.sendMail({
      from: `"MRCPI OBGYN Unlocked" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `Reinstated student is now active — ${name || email}`,
      html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#f8f7f4;">
        <div style="background:#0B1E3D;padding:24px 32px;border-radius:12px 12px 0 0;">
          <h1 style="color:#15B097;font-size:18px;margin:0;">Student Access Reinstated</h1>
        </div>
        <div style="background:#ffffff;padding:32px;border-radius:0 0 12px 12px;border:1px solid rgba(15,76,92,0.15);border-top:none;">
          <p style="color:#1a1a1a;font-size:15px;line-height:1.8;margin-top:0;">
            The following reinstated student has successfully set their password and is now active on the platform:
          </p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <tr><td style="padding:8px 12px;font-size:13px;color:rgba(26,26,26,0.5);width:100px;">Name</td><td style="padding:8px 12px;font-size:14px;font-weight:600;color:#0B1E3D;">${name || "—"}</td></tr>
            <tr style="background:rgba(15,76,92,0.03);"><td style="padding:8px 12px;font-size:13px;color:rgba(26,26,26,0.5);">Email</td><td style="padding:8px 12px;font-size:14px;color:#0B1E3D;">${email}</td></tr>
          </table>
          <p style="color:rgba(26,26,26,0.55);font-size:13px;margin-bottom:0;">This is an automated notification from MRCPI OBGYN Unlocked.</p>
        </div>
      </div>
      `,
    });
  } catch (e) {
    console.error("[role-redirect] Admin notify error:", e);
  }
}

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status, full_name, email")
    .eq("id", user.id)
    .single();

  // Blocked → blocked page
  if (profile?.status === "blocked") {
    redirect("/access-blocked");
  }

  // Pending or rejected → hold page
  if (!profile || profile.status === "pending" || profile.status === "rejected") {
    redirect("/pending-approval");
  }

  // Check if this is a reinstated student logging in for the first time
  if (profile.role === "student" && profile.status === "active") {
    const serviceClient = createServiceClient();
    const { data: reinstateLog } = await serviceClient
      .from("audit_logs")
      .select("id")
      .eq("action", "student_reinstate_from_block")
      .eq("resource", user.id)
      .single();

    if (reinstateLog) {
      // Delete the audit entry so this only fires once
      await serviceClient.from("audit_logs").delete().eq("id", reinstateLog.id);
      // Notify admin
      await notifyAdminOfReinstate(
        profile.email ?? user.email ?? "",
        profile.full_name ?? ""
      );
    }
  }

  // Route by role
  if (profile.role === "admin" || profile.role === "instructor") {
    redirect("/admin");
  }

  redirect("/dashboard");
}
