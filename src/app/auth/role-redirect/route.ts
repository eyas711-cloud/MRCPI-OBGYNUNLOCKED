import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .single();

  // Pending or rejected → hold page
  if (!profile || profile.status === "pending" || profile.status === "rejected") {
    redirect("/pending-approval");
  }

  // Route by role
  if (profile.role === "admin" || profile.role === "instructor") {
    redirect("/admin");
  }

  redirect("/dashboard");
}
