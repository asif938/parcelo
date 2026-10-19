import type { NextRequest } from "next/server";

import { proxyBackendGet } from "@/lib/api/proxy";

export async function GET(request: NextRequest) {
  request.nextUrl.searchParams.set("role", "COURIER");
  return proxyBackendGet(request, "/admin/users");
}
