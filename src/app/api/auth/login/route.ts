import { NextResponse } from "next/server";

import { BackendApiError, backendFetch } from "@/lib/api/backend";
import { setAuthCookies } from "@/lib/auth/cookies";
import type { AuthUser } from "@/stores/auth-store";

interface LoginResult {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  try {
    const result = await backendFetch<LoginResult>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });

    await setAuthCookies(result.accessToken, result.refreshToken);

    return NextResponse.json({ success: true, data: { user: result.user } });
  } catch (error) {
    if (error instanceof BackendApiError) {
      return NextResponse.json(
        { success: false, message: error.message, errors: error.errors },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { success: false, message: "Unable to reach the server. Please try again." },
      { status: 502 },
    );
  }
}
