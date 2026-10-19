import { cookies } from "next/headers";

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/auth/constants";
import { decodeAccessToken } from "@/lib/auth/jwt";

const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30;

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const store = await cookies();
  const payload = decodeAccessToken(accessToken);
  const accessMaxAge = payload ? Math.max(Math.floor(payload.exp - Date.now() / 1000), 0) : 15 * 60;

  store.set(ACCESS_TOKEN_COOKIE, accessToken, cookieOptions(accessMaxAge));
  store.set(REFRESH_TOKEN_COOKIE, refreshToken, cookieOptions(REFRESH_TOKEN_MAX_AGE));
}

export async function getAuthCookies() {
  const store = await cookies();
  return {
    accessToken: store.get(ACCESS_TOKEN_COOKIE)?.value,
    refreshToken: store.get(REFRESH_TOKEN_COOKIE)?.value,
  };
}

export async function clearAuthCookies() {
  const store = await cookies();
  store.delete(ACCESS_TOKEN_COOKIE);
  store.delete(REFRESH_TOKEN_COOKIE);
}
