import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const PREVIEW_ITEMS = {
  "cf-pdf": {
    bucket: "recalls",
    path: "recalls/rc-maternal-medicine/1783981270954-Cystic_Fibrosis_in_Pregnancy.pdf",
  },
  "antenatal-cs": {
    bucket: "last-minute-prep",
    path: "last-minute-prep/687779cd-e6c8-4b17-958f-3f8e2782c18c/1789654486017-Antenatal_Corticosteroids(Laast_minute_prep).pdf",
  },
} as const;

const LAYLA_STUDENT_ID = "45fa97cc-cdf6-4508-8e62-5f4a594507b4";

function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const item = searchParams.get("item");

  if (item === "layla-feedback") {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("student_feedback")
      .select("id, feedback_type, title, content, created_at, updated_at")
      .eq("student_id", LAYLA_STUDENT_ID)
      .order("created_at", { ascending: true });

    if (error) return NextResponse.json({ error: "Could not fetch feedback" }, { status: 500 });
    return NextResponse.json({ feedback: data ?? [] });
  }

  const key = item as keyof typeof PREVIEW_ITEMS | null;
  if (!key || !(key in PREVIEW_ITEMS)) {
    return NextResponse.json({ error: "Invalid item" }, { status: 400 });
  }

  const { bucket, path } = PREVIEW_ITEMS[key];
  const supabase = createServiceClient();
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 3600);

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: "Could not generate URL" }, { status: 500 });
  }

  return NextResponse.json({ url: data.signedUrl });
}
