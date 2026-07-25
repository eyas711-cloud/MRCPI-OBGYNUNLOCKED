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
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  try {
    await transporter.sendMail({
      from: `"MRCPI OBGYN Unlocked" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log("[sendEmail] Email sent to:", to);
    return true;
  } catch (e) {
    console.error("[sendEmail] Error:", e);
    return false;
  }
}

export async function POST(req: Request) {
  console.log("[approve-student] POST called");
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  console.log("[approve-student] user:", user?.email);
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
  if (!newStatus && action !== "clear") return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  // Clear rejected — delete silently, no email
  if (action === "clear") {
    const serviceClient = createServiceClient();
    const { data: student } = await serviceClient.from("profiles").select("email, full_name").eq("id", studentId).single();
    await serviceClient.from("profiles").delete().eq("id", studentId);
    await serviceClient.auth.admin.deleteUser(studentId);
    await supabase.from("audit_logs").insert([{
      user_id: user.id, user_email: user.email, user_role: profile.role,
      action: "student_clear_rejected", resource: studentId,
      details: { deleted_email: student?.email },
    }]);
    return NextResponse.json({ ok: true });
  }

  if (action === "terminate") {
    const serviceClient = createServiceClient();
    const { data: student } = await serviceClient.from("profiles").select("email, full_name").eq("id", studentId).single();

    if (student?.email) {
      const firstName = student.full_name?.split(" ")[0] || "Doctor";
      await sendEmail(
        student.email,
        "A message from MRCPI OBGYN Unlocked",
        `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#f8f7f4;">
          <div style="background:#0B1E3D;padding:24px 32px;border-radius:12px 12px 0 0;text-align:center;">
            <p style="color:rgba(255,255,255,0.45);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 6px 0;">MRCPI OBGYN Unlocked</p>
            <h1 style="color:#15B097;font-size:20px;margin:0;letter-spacing:0.05em;">A Message for You</h1>
          </div>
          <div style="background:#ffffff;padding:36px 32px;border-radius:0 0 12px 12px;border:1px solid rgba(15,76,92,0.15);border-top:none;">
            <p style="color:#0B1E3D;font-size:16px;margin-top:0;">Dear ${firstName},</p>
            <p style="color:#1a1a1a;font-size:15px;line-height:1.8;margin-bottom:20px;">
              If you get this email, this means our journey has come to an end, however; you will always remain a part of <strong style="color:#0B1E3D;">MRCPI-OBGYNUNLOCKED</strong> family. We wish you all the best.
            </p>
            <p style="color:#1a1a1a;font-size:15px;line-height:1.8;margin-bottom:28px;">
              Thank you for letting us be a part of your Academic journey.
            </p>
            <hr style="border:none;border-top:1px solid rgba(15,76,92,0.1);margin:24px 0;" />
            <p style="color:#1a1a1a;font-size:14px;margin:0;">
              With warmth and gratitude,<br/>
              <strong style="color:#0B1E3D;">Dr. Einas Diab &amp; the MRCPI OBGYN Unlocked Team</strong>
            </p>
          </div>
          <p style="text-align:center;font-size:12px;color:rgba(26,26,26,0.35);margin-top:16px;">
            © ${new Date().getFullYear()} MRCPI OBGYN Unlocked &nbsp;·&nbsp;
            <a href="https://mrcpi-obgynunlocked.com" style="color:rgba(26,26,26,0.35);">mrcpi-obgynunlocked.com</a>
          </p>
        </div>
        `
      );
    }

    await serviceClient.from("profiles").delete().eq("id", studentId);
    await serviceClient.auth.admin.deleteUser(studentId);
    await supabase.from("audit_logs").insert([{
      user_id: user.id,
      user_email: user.email,
      user_role: profile.role,
      action: "student_terminate",
      resource: studentId,
      details: { deleted_email: student?.email },
    }]);
    return NextResponse.json({ ok: true });
  }

  // Block: send email, log it, then delete the profile so they can't log in and can re-register
  if (action === "block") {
    console.log("[block] Starting block for studentId:", studentId);
    const serviceClient = createServiceClient();
    const { data: student, error: studentErr } = await serviceClient
      .from("profiles")
      .select("email, full_name")
      .eq("id", studentId)
      .single();
    console.log("[block] Profile fetch:", student?.email, "error:", studentErr?.message);

    if (student?.email) {
      const firstName = student.full_name?.split(" ")[0] || "Doctor";
      await sendEmail(
        student.email,
        "Important Notice Regarding Your Account — MRCPI OBGYN Unlocked",
        `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#f8f7f4;">
          <div style="background:#0B1E3D;padding:24px 32px;border-radius:12px 12px 0 0;text-align:center;">
            <h1 style="color:#15B097;font-size:20px;margin:0;letter-spacing:0.05em;">MRCPI OBGYN Unlocked</h1>
          </div>
          <div style="background:#ffffff;padding:36px 32px;border-radius:0 0 12px 12px;border:1px solid rgba(15,76,92,0.15);border-top:none;">
            <p style="color:#0B1E3D;font-size:16px;margin-top:0;">Dear Dr. ${firstName},</p>
            <p style="color:#1a1a1a;font-size:15px;line-height:1.8;margin-bottom:20px;">
              We are writing to inform you that your access to the <strong style="color:#0B1E3D;">MRCPI OBGYN Unlocked</strong> platform has been temporarily suspended, effective immediately.
            </p>
            <p style="color:#1a1a1a;font-size:15px;line-height:1.8;margin-bottom:20px;">
              During this period, you will not be able to log in or access any course materials or resources on the platform.
            </p>
            <p style="color:#1a1a1a;font-size:15px;line-height:1.8;margin-bottom:28px;">
              If you believe this has been done in error, or if you would like to discuss this matter further, please do not hesitate to reach out to us directly at
              <a href="mailto:info@mrcpiobgynunlocked.com" style="color:#15B097;">info@mrcpiobgynunlocked.com</a>
              or via WhatsApp at <a href="https://wa.me/201559912306" style="color:#15B097;">+20 155 991 2306</a>.
            </p>
            <p style="color:#1a1a1a;font-size:15px;line-height:1.8;margin-bottom:28px;">
              We remain committed to supporting your academic journey and hope to resolve any outstanding matters promptly.
            </p>
            <hr style="border:none;border-top:1px solid rgba(15,76,92,0.1);margin:24px 0;" />
            <p style="color:#1a1a1a;font-size:14px;margin:0;">
              With respect,<br/>
              <strong style="color:#0B1E3D;">Dr. Einas Diab &amp; the MRCPI OBGYN Unlocked Team</strong>
            </p>
          </div>
          <p style="text-align:center;font-size:12px;color:rgba(26,26,26,0.35);margin-top:16px;">
            © ${new Date().getFullYear()} MRCPI OBGYN Unlocked &nbsp;·&nbsp;
            <a href="https://mrcpi-obgynunlocked.com" style="color:rgba(26,26,26,0.35);">mrcpi-obgynunlocked.com</a>
          </p>
        </div>
        `
      );
    }

    // Log to audit before deleting (use serviceClient to bypass RLS)
    const { error: auditErr } = await serviceClient.from("audit_logs").insert([{
      user_id: user.id,
      user_email: user.email,
      user_role: profile.role,
      action: "student_block",
      resource: studentId,
      details: { blocked_email: student?.email, blocked_name: student?.full_name },
    }]);
    console.log("[block] Audit log error:", auditErr?.message ?? "none");

    // Delete profile and auth account so student can re-register
    const { error: profileDelErr } = await serviceClient.from("profiles").delete().eq("id", studentId);
    console.log("[block] Profile delete error:", profileDelErr?.message ?? "none");
    const { error: authDelErr } = await serviceClient.auth.admin.deleteUser(studentId);
    console.log("[block] Auth delete error:", authDelErr?.message ?? "none");

    return NextResponse.json({ ok: true });
  }

  await supabase.from("profiles").update({ status: newStatus }).eq("id", studentId);

  await supabase.from("audit_logs").insert([{
    user_id: user.id,
    user_email: user.email,
    user_role: profile.role,
    action: `student_${action}`,
    resource: studentId,
    details: { new_status: newStatus },
  }]);

  if (action === "approve" || action === "reject" || action === "reinstate") {
    console.log("[approve-student] Sending email for action:", action, "studentId:", studentId);
    const serviceClient = createServiceClient();
    const { data: student, error: studentErr } = await serviceClient
      .from("profiles")
      .select("email, full_name")
      .eq("id", studentId)
      .single();

    console.log("[approve-student] Student fetch:", student?.email, "error:", studentErr?.message);

    if (student?.email) {
      const firstName = student.full_name?.split(" ")[0] || "Doctor";

      if (action === "approve" || action === "reinstate") {
        const emailResult = await sendEmail(
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
        console.log("[approve-student] Approval email sent:", emailResult);
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
