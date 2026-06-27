import { createBrowserClient } from "@supabase/ssr";

// Use createBrowserClient so auth sessions are persisted as cookies,
// making them visible to the Next.js middleware and server components.
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);
