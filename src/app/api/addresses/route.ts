import type { NextRequest } from "next/server";

import { proxyBackendGet, proxyBackendMutate } from "@/lib/api/proxy";

export async function GET(request: NextRequest) {
  return proxyBackendGet(request, "/users/me/addresses");
}

export async function POST(request: NextRequest) {
  return proxyBackendMutate(request, "/users/me/addresses", "POST");
}
