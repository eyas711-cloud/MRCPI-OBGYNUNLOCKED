import { createClient } from "@/lib/supabase-server";

export default async function AnnouncementBanner() {
  const supabase = createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["banner_enabled", "banner_text"]);

  const map: Record<string, string> = {};
  (data ?? []).forEach((r: { key: string; value: string }) => { map[r.key] = r.value ?? ""; });

  if (map.banner_enabled !== "true" || !map.banner_text?.trim()) return null;

  return (
    <div
      className="w-full px-4 py-2.5 text-center text-sm font-medium"
      style={{ backgroundColor: "var(--gold)", color: "var(--navy)" }}
    >
      {map.banner_text}
    </div>
  );
}
