import { supabase } from "./supabase";

export async function logAudit(
  userId: string,
  userEmail: string,
  userRole: string,
  action: string,
  resource?: string,
  details?: Record<string, unknown>
) {
  await supabase.from("audit_logs").insert([{
    user_id: userId,
    user_email: userEmail,
    user_role: userRole,
    action,
    resource: resource ?? null,
    details: details ?? null,
  }]);
}
