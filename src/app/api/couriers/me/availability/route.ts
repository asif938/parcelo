import type { NextRequest } from "next/server";

import { proxyBackendMutate } from "@/lib/api/proxy";

export async function PATCH(request: NextRequest) {
  return proxyBackendMutate(request, "/couriers/me/availability", "PATCH");
}
