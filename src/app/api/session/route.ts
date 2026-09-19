import { NextResponse } from "next/server";

import { getCurrentUser } from "@/features/auth/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(
    { ok: true, data: { user } },
    { headers: { "Cache-Control": "no-store" } },
  );
}
