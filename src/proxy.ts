import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/constants";
import { decodeAccessToken } from "@/lib/auth/jwt";
import { AUTH_ONLY_ROUTES, PROTECTED_ROUTE_PREFIXES, ROLE_HOME } from "@/lib/routes";

const PROTECTED_PREFIXES = Object.values(PROTECTED_ROUTE_PREFIXES);
const AUTH_ONLY_PATHS: readonly string[] = AUTH_ONLY_ROUTES;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const payload = accessToken ? decodeAccessToken(accessToken) : null;
  const hasValidSession = Boolean(payload && payload.exp * 1000 > Date.now());

  const isProtectedRoute = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isProtectedRoute && !hasValidSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (hasValidSession && payload && AUTH_ONLY_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL(ROLE_HOME[payload.role], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/provider/:path*", "/admin/:path*", "/login", "/register"],
};
