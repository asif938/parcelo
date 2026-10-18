import { NextResponse } from "next/server";

import { BackendApiError, backendFetch } from "@/lib/api/backend";
import { clearAuthCookies, getAuthCookies, setAuthCookies } from "@/lib/auth/cookies";
import type { AuthUser } from "@/stores/auth-store";

interface RefreshResult {
  accessToken: string;
  refreshToken: string;
}

async function fetchMe(accessToken: string) {
  const result = await backendFetch<{ user: AuthUser }>("/users/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return result.user;
}

export async function GET() {
  const { accessToken, refreshToken } = await getAuthCookies();

  if (!accessToken) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  try {
    const user = await fetchMe(accessToken);
    return NextResponse.json({ success: true, data: { user } });
  } catch (error) {
    if (error instanceof BackendApiError && error.status === 401 && refreshToken) {
      try {
        const tokens = await backendFetch<RefreshResult>("/auth/refresh-token", {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        });
        await setAuthCookies(tokens.accessToken, tokens.refreshToken);
        const user = await fetchMe(tokens.accessToken);
        return NextResponse.json({ success: true, data: { user } });
      } catch {
        await clearAuthCookies();
        return NextResponse.json({ success: false, message: "Session expired" }, { status: 401 });
      }
    }

    await clearAuthCookies();
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }
}
