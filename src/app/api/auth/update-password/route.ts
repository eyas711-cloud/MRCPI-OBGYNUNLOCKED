import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const authHeader = req.headers.get("Authorization");
  const accessToken = authHeader?.replace("Bearer ", "");
  if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { password } = await req.json();
  if (!password || password.length < 8) return NextResponse.json({ error: "Password too short" }, { status: 400 });

  const serviceClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Verify the access token and get the user
  const { data: { user }, error: userError } = await serviceClient.auth.getUser(accessToken);
  if (userError || !user) return NextResponse.json({ error: "Invalid or expired session. Please request a new reset link." }, { status: 401 });

  const { error: updateError } = await serviceClient.auth.admin.updateUserById(user.id, { password });
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
