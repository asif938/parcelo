import type { NextRequest } from "next/server";

import { proxyBackendMutate } from "@/lib/api/proxy";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyBackendMutate(request, `/shipments/${id}/status`, "PATCH");
}
