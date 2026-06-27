import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

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
  };

  const newStatus = statusMap[action];
  if (!newStatus) return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  await supabase.from("profiles").update({ status: newStatus }).eq("id", studentId);

  await supabase.from("audit_logs").insert([{
    user_id: user.id,
    user_email: user.email,
    user_role: profile.role,
    action: `student_${action}`,
    resource: studentId,
    metadata: { new_status: newStatus },
  }]);

  return NextResponse.json({ ok: true });
}
