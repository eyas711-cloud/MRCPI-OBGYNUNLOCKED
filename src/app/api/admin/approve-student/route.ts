import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "MRCPI OBGYN Unlocked <noreply@mrcpiobgynunlocked.com>",
      to: [to],
      subject,
      html,
    }),
  });
  return res.ok;
}

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || (profile.role !== "admin" && profile.role !== "instructor")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { studentId, action } = await req.json();
  const statusMap: Record<string, string> = {
    approve: "active",
    reject: "rejected",
    block: "blocked",
    reinstate: "active",
    terminate: "terminated",
  };

  const newStatus = statusMap[action];
  if (!newStatus) return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  if (action === "terminate") {
    // Get student email before deleting
    const { data: student } = await supabase.from("profiles").select("email, full_name").eq("id", studentId).single();
    await supabase.from("profiles").delete().eq("id", studentId);
    // Delete auth user via service role
    await supabase.auth.admin.deleteUser(studentId);
    await supabase.from("audit_logs").insert([{
      user_id: user.id,
      user_email: user.email,
      user_role: profile.role,
      action: "student_terminate",
      resource: studentId,
      metadata: { deleted_email: student?.email },
    }]);
    return NextResponse.json({ ok: true });
  }

  await supabase.from("profiles").update({ status: newStatus }).eq("id", studentId);

  await supabase.from("audit_logs").insert([{
    user_id: user.id,
    user_email: user.email,
    user_role: profile.role,
    action: `student_${action}`,
    resource: studentId,
    metadata: { new_status: newStatus },
  }]);

  // Send email notification for approve or reject
  if (action === "approve" || action === "reject" || action === "reinstate") {
    const { data: student } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", studentId)
      .single();

    if (student?.email) {
      const firstName = student.full_name?.split(" ")[0] || "Doctor";

      if (action === "approve" || action === "reinstate") {
        await sendEmail(
          student.email,
          "Your MRCPI OBGYN Unlocked account has been approved",
          `
          <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#f8f7f4;">
            <div style="background:#0B1E3D;padding:24px 32px;border-radius:12px 12px 0 0;text-align:center;">
              <h1 style="color:#15B097;font-size:20px;margin:0;letter-spacing:0.05em;">MRCPI OBGYN Unlocked</h1>
            </div>
            <div style="background:#ffffff;padding:32px;border-radius:0 0 12px 12px;border:1px solid rgba(15,76,92,0.15);border-top:none;">
              <p style="color:#0B1E3D;font-size:16px;margin-top:0;">Dear ${firstName},</p>
              <p style="color:#1a1a1a;font-size:15px;line-height:1.6;">
                Congratulations! Your registration has been <strong style="color:#15B097;">approved</strong>.
                You now have full access to your student dashboard and all course materials.
              </p>
              <div style="text-align:center;margin:32px 0;">
                <a href="https://mrcpiobgynunlocked.com/login"
                   style="background:#15B097;color:#0B1E3D;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;">
                  Access My Dashboard →
                </a>
              </div>
              <p style="color:#1a1a1a;font-size:14px;line-height:1.6;">
                If you have any questions, please don't hesitate to contact us at
                <a href="mailto:info@mrcpiobgynunlocked.com" style="color:#15B097;">info@mrcpiobgynunlocked.com</a>.
              </p>
              <p style="color:#1a1a1a;font-size:14px;margin-bottom:0;">
                Best of luck with your MRCPI OBGYN OSCE preparation.<br/>
                <strong>Dr. Einas Diab &amp; the MRCPI OBGYN Unlocked Team</strong>
              </p>
            </div>
            <p style="text-align:center;font-size:12px;color:rgba(26,26,26,0.4);margin-top:16px;">
              © ${new Date().getFullYear()} MRCPI OBGYN Unlocked · <a href="https://mrcpiobgynunlocked.com" style="color:rgba(26,26,26,0.4);">mrcpiobgynunlocked.com</a>
            </p>
          </div>
          `
        );
      } else if (action === "reject") {
        await sendEmail(
          student.email,
          "Update on your MRCPI OBGYN Unlocked registration",
          `
          <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#f8f7f4;">
            <div style="background:#0B1E3D;padding:24px 32px;border-radius:12px 12px 0 0;text-align:center;">
              <h1 style="color:#15B097;font-size:20px;margin:0;letter-spacing:0.05em;">MRCPI OBGYN Unlocked</h1>
            </div>
            <div style="background:#ffffff;padding:32px;border-radius:0 0 12px 12px;border:1px solid rgba(15,76,92,0.15);border-top:none;">
              <p style="color:#0B1E3D;font-size:16px;margin-top:0;">Dear ${firstName},</p>
              <p style="color:#1a1a1a;font-size:15px;line-height:1.6;">
                Thank you for registering on MRCPI OBGYN Unlocked. Unfortunately, we were unable to approve your registration at this time.
              </p>
              <p style="color:#1a1a1a;font-size:14px;line-height:1.6;">
                If you believe this is an error or would like more information, please contact us directly at
                <a href="mailto:info@mrcpiobgynunlocked.com" style="color:#15B097;">info@mrcpiobgynunlocked.com</a>
                or via WhatsApp at <a href="https://wa.me/201559912306" style="color:#15B097;">+20 155 991 2306</a>.
              </p>
              <p style="color:#1a1a1a;font-size:14px;margin-bottom:0;">
                Kind regards,<br/>
                <strong>The MRCPI OBGYN Unlocked Team</strong>
              </p>
            </div>
            <p style="text-align:center;font-size:12px;color:rgba(26,26,26,0.4);margin-top:16px;">
              © ${new Date().getFullYear()} MRCPI OBGYN Unlocked · <a href="https://mrcpiobgynunlocked.com" style="color:rgba(26,26,26,0.4);">mrcpiobgynunlocked.com</a>
            </p>
          </div>
          `
        );
      }
    }
  }

  return NextResponse.json({ ok: true });
}
