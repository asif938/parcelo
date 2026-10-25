import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { BackendApiError, backendFetch } from "@/lib/api/backend";
import type { ContactMessageResult } from "@/types/contact";

export async function POST(request: NextRequest) {
  const body = await request.text();

  try {
    const result = await backendFetch<ContactMessageResult>("/contact", {
      method: "POST",
      body,
    });
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof BackendApiError) {
      return NextResponse.json(
        { success: false, message: error.message, errors: error.errors },
        { status: error.status },
      );
    }
    return NextResponse.json({ success: false, message: "Something went wrong." }, { status: 502 });
  }
}
