import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // Unauthenticated → login
  if (!user && (pathname.startsWith("/admin") || pathname.startsWith("/dashboard"))) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Authenticated users hitting /login → role-redirect
  if (user && pathname === "/login") {
    return NextResponse.redirect(new URL("/auth/role-redirect", request.url));
  }

  // For authenticated users on protected routes, check profile status + role
  if (user && (pathname.startsWith("/admin") || pathname.startsWith("/dashboard"))) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", user.id)
      .single();

    // Pending/rejected → hold page
    if (!profile || profile.status !== "active") {
      return NextResponse.redirect(new URL("/pending-approval", request.url));
    }

    // Student trying to access /admin → access denied
    if (pathname.startsWith("/admin") && profile.role === "student") {
      return NextResponse.redirect(new URL("/access-denied", request.url));
    }

    // Admin trying to use /dashboard → send to admin panel
    if (pathname.startsWith("/dashboard") && (profile.role === "admin" || profile.role === "instructor")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
