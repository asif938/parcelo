import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { BackendApiError, backendFetch } from "@/lib/api/backend";
import { getAuthCookies } from "@/lib/auth/cookies";

export async function proxyBackendGet(request: NextRequest, backendPath: string) {
  const { accessToken } = await getAuthCookies();
  if (!accessToken) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  try {
    const data = await backendFetch(`${backendPath}${request.nextUrl.search}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof BackendApiError) {
      return NextResponse.json(
        { success: false, message: error.message, errors: error.errors },
        { status: error.status },
      );
    }
    return NextResponse.json({ success: false, message: "Something went wrong." }, { status: 502 });
  }
}

export async function proxyBackendMutate(
  request: NextRequest,
  backendPath: string,
  method: "POST" | "PATCH" | "PUT" | "DELETE",
) {
  const { accessToken } = await getAuthCookies();
  if (!accessToken) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  const rawBody = method === "DELETE" ? "" : await request.text();
  const hasBody = rawBody.length > 0;

  try {
    const data = await backendFetch(backendPath, {
      method,
      headers: { Authorization: `Bearer ${accessToken}` },
      body: hasBody ? rawBody : undefined,
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof BackendApiError) {
      return NextResponse.json(
        { success: false, message: error.message, errors: error.errors },
        { status: error.status },
      );
    }
    return NextResponse.json({ success: false, message: "Something went wrong." }, { status: 502 });
  }
}
