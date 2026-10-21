import type { NextRequest } from "next/server";

import { proxyBackendGet, proxyBackendMutate } from "@/lib/api/proxy";

export async function GET(request: NextRequest) {
  return proxyBackendGet(request, "/users/me");
}

export async function PATCH(request: NextRequest) {
  return proxyBackendMutate(request, "/users/me", "PATCH");
}
