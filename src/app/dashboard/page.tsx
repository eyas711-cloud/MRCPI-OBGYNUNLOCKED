import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not authenticated → send to login
  if (!user) redirect("/login?next=/dashboard");

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .single();

  // Admins who land on /dashboard should go to their panel
  if (profile?.role === "admin" || profile?.role === "instructor") {
    redirect("/admin");
  }

  return (
    <DashboardClient
      user={{
        id: user.id,
        email: user.email ?? "",
        name: profile?.full_name ?? null,
      }}
    />
  );
}
