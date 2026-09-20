import { NextResponse } from "next/server";

import { getCurrentUser } from "@/features/auth/session";
import {
  RequestCommandError,
  updateRequest,
} from "@/features/requests/request-command";
import type { RequestMutationResponse } from "@/features/requests/request-contracts";
import { requestMutationSchema } from "@/features/requests/request-mutation-schema";

type RouteContext = {
  params: Promise<{ requestId: string }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json<RequestMutationResponse>(
      { ok: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json<RequestMutationResponse>(
      { ok: false, error: { code: "INVALID_JSON", message: "Request body must be valid JSON." } },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const parsed = requestMutationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<RequestMutationResponse>(
      {
        ok: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "The request update is invalid.",
          fields: parsed.error.flatten().fieldErrors,
        },
      },
      { status: 422, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const { requestId } = await params;
    const result = await updateRequest(requestId, user, parsed.data);
    return NextResponse.json<RequestMutationResponse>(
      { ok: true, data: result },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof RequestCommandError) {
      return NextResponse.json<RequestMutationResponse>(
        { ok: false, error: { code: error.code, message: error.message } },
        { status: error.status, headers: { "Cache-Control": "no-store" } },
      );
    }

    console.error("Request update failed", error);
    return NextResponse.json<RequestMutationResponse>(
      {
        ok: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "The request could not be updated. Try again.",
        },
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
