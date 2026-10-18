import { NextResponse } from "next/server";

import { backendFetch } from "@/lib/api/backend";
import { clearAuthCookies, getAuthCookies } from "@/lib/auth/cookies";

export async function POST() {
  const { refreshToken } = await getAuthCookies();

  if (refreshToken) {
    await backendFetch("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }).catch(() => undefined);
  }

  await clearAuthCookies();

  return NextResponse.json({ success: true });
}
