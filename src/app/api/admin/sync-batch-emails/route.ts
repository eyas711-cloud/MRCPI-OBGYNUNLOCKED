import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export async function POST() {
  const serviceClient = createServiceClient();

  // Get all batch students missing an email
  const { data: batchStudents } = await serviceClient
    .from("batch_students")
    .select("id, student_name, email")
    .or("email.is.null,email.eq.");

  if (!batchStudents || batchStudents.length === 0) {
    return NextResponse.json({ synced: 0 });
  }

  // Get all student profiles with emails
  const { data: profiles } = await serviceClient
    .from("profiles")
    .select("email, full_name")
    .eq("role", "student")
    .not("email", "is", null)
    .not("full_name", "is", null);

  if (!profiles || profiles.length === 0) {
    return NextResponse.json({ synced: 0 });
  }

  // Build a name → email map from profiles
  const profileMap = new Map<string, string>();
  for (const p of profiles) {
    if (p.full_name && p.email) {
      profileMap.set(normalize(p.full_name), p.email);
    }
  }

  let synced = 0;
  for (const s of batchStudents) {
    if (!s.student_name) continue;
    const email = profileMap.get(normalize(s.student_name));
    if (email) {
      await serviceClient
        .from("batch_students")
        .update({ email })
        .eq("id", s.id);
      synced++;
    }
  }

  return NextResponse.json({ synced });
}
