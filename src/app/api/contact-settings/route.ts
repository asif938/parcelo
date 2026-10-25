import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { BackendApiError, backendFetch } from "@/lib/api/backend";
import { proxyBackendMutate } from "@/lib/api/proxy";
import type { ContactSettingsResult } from "@/types/contact";

export async function GET() {
  try {
    const result = await backendFetch<ContactSettingsResult>("/contact/settings");
    return NextResponse.json({ success: true, data: result });
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

export async function PATCH(request: NextRequest) {
  return proxyBackendMutate(request, "/contact/settings", "PATCH");
}
