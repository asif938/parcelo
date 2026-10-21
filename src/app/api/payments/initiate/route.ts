import type { NextRequest } from "next/server";

import { proxyBackendMutate } from "@/lib/api/proxy";

export async function POST(request: NextRequest) {
  return proxyBackendMutate(request, "/payments/initiate", "POST");
}
