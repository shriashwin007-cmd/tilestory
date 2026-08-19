import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Real, server-side device split (not just responsive CSS): phones get a
// genuinely separate component tree (see app/page.tsx branching on this
// header), tablets/desktops get the standard site. Decision happens before
// any HTML is sent, so there's no client-side redirect flicker and no
// duplicate URL (both branches render at "/"), avoiding the classic m.site
// SEO/duplicate-content problem while still giving phones their own build.
const MOBILE_UA_RE = /iPhone|iPod|Android.*Mobile|Windows Phone|BlackBerry|IEMobile|Opera Mini/i;

export async function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(
    "x-device-type",
    MOBILE_UA_RE.test(request.headers.get("user-agent") ?? "") ? "mobile" : "desktop"
  );

  let response = NextResponse.next({ request: { headers: requestHeaders } });

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = request.nextUrl.pathname === "/admin/login";

  // The public site (just "/") never needs an auth check -- only /admin
  // does. Running Supabase's getUser() unconditionally on every request
  // meant a single Supabase hiccup (e.g. its known transient clock-skew
  // "JWT issued at future" error) took down the entire public homepage
  // with a 500, not just the admin panel that actually depends on it.
  if (!isAdminRoute && !isLoginRoute) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request: { headers: requestHeaders } });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Defense in depth even for /admin: a Supabase error here should mean
  // "treat as logged out" (redirect to login), never a hard 500.
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    user = null;
  }

  if (isAdminRoute && !isLoginRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (isLoginRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/", "/collections", "/admin/:path*"],
};
