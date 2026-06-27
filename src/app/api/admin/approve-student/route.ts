import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createClient();

  // Verify caller is an active admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .single();

  if (!adminProfile || adminProfile.role !== "admin" || adminProfile.status !== "active") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { studentId, action } = body as { studentId: string; action: "approve" | "reject" | "block" | "reinstate" };

  if (!studentId || !["approve", "reject", "block", "reinstate"].includes(action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const statusMap: Record<string, string> = {
    approve: "active",
    reject: "rejected",
    block: "blocked",
    reinstate: "active",
  };
  const newStatus = statusMap[action];

  const { error } = await supabase
    .from("profiles")
    .update({
      status: newStatus,
      approved_by: user.id,
      approved_at: new Date().toISOString(),
    })
    .eq("id", studentId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const auditActionMap: Record<string, string> = {
    approve: "approve_student",
    reject: "reject_student",
    block: "block_student",
    reinstate: "reinstate_student",
  };

  await supabase.from("audit_logs").insert([{
    user_id: user.id,
    user_email: user.email,
    user_role: "admin",
    action: auditActionMap[action],
    resource: studentId,
  }]);

  return NextResponse.json({ success: true, status: newStatus });
}
