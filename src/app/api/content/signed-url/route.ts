import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("status").eq("id", user.id).single();
  if (!profile || profile.status !== "active") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { bucket, path } = await request.json();
  if (!bucket || !path) return NextResponse.json({ error: "Missing bucket or path" }, { status: 400 });

  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 3600);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ url: data.signedUrl });
}
