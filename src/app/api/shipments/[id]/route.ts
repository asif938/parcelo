import type { NextRequest } from "next/server";

import { proxyBackendGet, proxyBackendMutate } from "@/lib/api/proxy";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyBackendGet(request, `/shipments/${id}`);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyBackendMutate(request, `/shipments/${id}`, "PATCH");
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyBackendMutate(request, `/shipments/${id}`, "DELETE");
}
