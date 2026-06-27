import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not authenticated → send to login
  if (!user) redirect("/login?next=/admin");

  // Fetch role from database (server-side, not spoofable)
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .single();

  // Wrong role → access denied
  if (!profile || (profile.role !== "admin" && profile.role !== "instructor")) {
    redirect("/access-denied");
  }

  return (
    <AdminClient
      user={{
        id: user.id,
        email: user.email ?? "",
        name: profile.full_name ?? null,
        role: profile.role,
      }}
    />
  );
}
