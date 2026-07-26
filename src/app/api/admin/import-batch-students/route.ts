import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: Request) {
  const { batchId } = await req.json();
  if (!batchId) return NextResponse.json({ error: "Missing batchId" }, { status: 400 });

  const serviceClient = createServiceClient();

  // Get all active students
  const { data: profiles } = await serviceClient
    .from("profiles")
    .select("full_name, email")
    .eq("role", "student")
    .eq("status", "active")
    .not("full_name", "is", null);

  if (!profiles || profiles.length === 0) {
    return NextResponse.json({ imported: 0 });
  }

  // Get existing names in this batch to avoid duplicates
  const { data: existing } = await serviceClient
    .from("batch_students")
    .select("student_name")
    .eq("batch_id", batchId);

  const existingNames = new Set(
    (existing ?? []).map(r => r.student_name?.trim().toLowerCase())
  );

  // Get current max sort_order
  const { data: orderRow } = await serviceClient
    .from("batch_students")
    .select("sort_order")
    .eq("batch_id", batchId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  let sortOrder = (orderRow?.sort_order ?? 0) as number;

  const toInsert = [];
  for (const p of profiles) {
    const name = p.full_name?.trim() ?? "";
    if (!name || existingNames.has(name.toLowerCase())) continue;
    sortOrder++;
    toInsert.push({
      batch_id: batchId,
      student_name: name,
      email: p.email ?? null,
      paid: 0,
      pending: 0,
      telegram: false,
      web_account: false,
      sort_order: sortOrder,
    });
  }

  if (toInsert.length === 0) {
    return NextResponse.json({ imported: 0 });
  }

  await serviceClient.from("batch_students").insert(toInsert);

  return NextResponse.json({ imported: toInsert.length });
}
