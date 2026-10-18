import { NextResponse } from "next/server";

import { BackendApiError, backendFetch } from "@/lib/api/backend";
import type { AuthUser } from "@/stores/auth-store";

interface RegisterResult {
  user: AuthUser;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  try {
    const result = await backendFetch<RegisterResult>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });

    return NextResponse.json({ success: true, data: result }, { status: 201 });
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
