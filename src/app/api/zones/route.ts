import type { NextRequest } from "next/server";

import { proxyBackendGet, proxyBackendMutate } from "@/lib/api/proxy";

export async function GET(request: NextRequest) {
  return proxyBackendGet(request, "/zones");
}

export async function POST(request: NextRequest) {
  return proxyBackendMutate(request, "/zones", "POST");
}
