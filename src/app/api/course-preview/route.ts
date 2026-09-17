import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Hardcoded preview items — only these paths are ever signed here
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

function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("item") as keyof typeof PREVIEW_ITEMS | null;

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
