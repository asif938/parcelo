import type { NextRequest } from "next/server";

import { proxyBackendMutate } from "@/lib/api/proxy";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyBackendMutate(request, `/shipments/${id}/cancel`, "POST");
}
