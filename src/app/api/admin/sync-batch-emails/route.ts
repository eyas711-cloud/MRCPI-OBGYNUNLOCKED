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

// Strip honorifics and return the first meaningful word
function firstName(s: string) {
  const cleaned = normalize(s)
    .replace(/^dr\.?\s*/i, "")
    .replace(/^prof\.?\s*/i, "")
    .trim();
  return cleaned.split(" ")[0];
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

  // Pass 1: exact normalized full-name match
  const exactMap = new Map<string, string>();
  for (const p of profiles) {
    if (p.full_name && p.email) {
      exactMap.set(normalize(p.full_name), p.email);
    }
  }

  // Pass 2: first-name match (strips Dr. prefix, takes first word)
  // Only use if first name is unique across all profiles to avoid wrong assignment
  const firstNameCount = new Map<string, number>();
  const firstNameMap = new Map<string, string>();
  for (const p of profiles) {
    if (p.full_name && p.email) {
      const fn = firstName(p.full_name);
      firstNameCount.set(fn, (firstNameCount.get(fn) ?? 0) + 1);
      firstNameMap.set(fn, p.email);
    }
  }

  let synced = 0;
  for (const s of batchStudents) {
    if (!s.student_name) continue;

    // Try exact match first
    let email = exactMap.get(normalize(s.student_name));

    // Fall back to first-name match only if that first name is unambiguous
    if (!email) {
      const fn = firstName(s.student_name);
      if (fn && (firstNameCount.get(fn) ?? 0) === 1) {
        email = firstNameMap.get(fn);
      }
    }

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
