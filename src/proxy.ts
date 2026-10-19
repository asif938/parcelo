import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/constants";
import { decodeAccessToken } from "@/lib/auth/jwt";
import { AUTH_ONLY_ROUTES, ROLE_HOME, roleForProtectedPath } from "@/lib/routes";

const AUTH_ONLY_PATHS: readonly string[] = AUTH_ONLY_ROUTES;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const payload = accessToken ? decodeAccessToken(accessToken) : null;
  const hasValidSession = Boolean(payload && payload.exp * 1000 > Date.now());
  const ownerRole = roleForProtectedPath(pathname);

  if (ownerRole && !hasValidSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (ownerRole && hasValidSession && payload && payload.role !== ownerRole) {
    return NextResponse.redirect(new URL(ROLE_HOME[payload.role], request.url));
  }

  if (hasValidSession && payload && AUTH_ONLY_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL(ROLE_HOME[payload.role], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/provider/:path*", "/admin/:path*", "/login", "/register"],
};
