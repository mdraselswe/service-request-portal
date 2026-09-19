import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE_NAME } from "@/features/auth/config";
import { verifySessionToken } from "@/features/auth/session-token";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);
  const isLogin = pathname === "/login";

  if (isLogin && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isLogin && !session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { ok: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      );
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnTo", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
