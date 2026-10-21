import type { NextRequest } from "next/server";

import { proxyBackendGet } from "@/lib/api/proxy";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyBackendGet(request, `/payments/${id}`);
}
