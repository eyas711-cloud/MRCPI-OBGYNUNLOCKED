import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET() {
  const serviceClient = createServiceClient();
  const { data, error } = await serviceClient
    .from("audit_logs")
    .select("id, user_email, action, resource, created_at, details")
    .eq("action", "student_block")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[blocked-logs GET] error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ logs: data ?? [] });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const serviceClient = createServiceClient();

  if (id === "all") {
    await serviceClient.from("audit_logs").delete().eq("action", "student_block");
  } else {
    await serviceClient.from("audit_logs").delete().eq("id", id);
  }

  return NextResponse.json({ ok: true });
}
