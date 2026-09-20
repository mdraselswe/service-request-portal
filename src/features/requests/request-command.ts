import "server-only";

import { Prisma } from "@prisma/client";

import type { AuthenticatedUser } from "@/features/auth/session";
import { db } from "@/lib/db";

import type { RequestMutationResult } from "./request-contracts";
import type { RequestMutationInput } from "./request-mutation-schema";
import { canTransitionStatus, isRequestStatus } from "./request-transitions";

export class RequestCommandError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "RequestCommandError";
  }
}

const resultSelect = {
  requestNumber: true,
  status: true,
  version: true,
  updatedAt: true,
  resolvedAt: true,
  assignee: { select: { id: true, name: true } },
} satisfies Prisma.ServiceRequestSelect;

function serializeRequest(
  request: Prisma.ServiceRequestGetPayload<{ select: typeof resultSelect }>,
): RequestMutationResult["request"] {
  if (!isRequestStatus(request.status)) {
    throw new RequestCommandError("INVALID_STATE", "The request status is invalid.", 409);
  }

  return {
    requestNumber: request.requestNumber,
    status: request.status,
    version: request.version,
    updatedAt: request.updatedAt.toISOString(),
    resolvedAt: request.resolvedAt?.toISOString() ?? null,
    assignee: request.assignee,
  };
}

export async function updateRequest(
  requestNumber: string,
  user: AuthenticatedUser,
  input: RequestMutationInput,
): Promise<RequestMutationResult> {
  try {
    return await db.$transaction(async (transaction) => {
      const receipt = await transaction.mutationReceipt.findUnique({
        where: { id: input.mutationId },
      });
      if (receipt) {
        if (receipt.userId !== user.id) {
          throw new RequestCommandError(
            "IDEMPOTENCY_CONFLICT",
            "This mutation identifier has already been used.",
            409,
          );
        }
        const saved = JSON.parse(receipt.responseJson) as RequestMutationResult;
        if (saved.request.requestNumber !== requestNumber) {
          throw new RequestCommandError(
            "IDEMPOTENCY_CONFLICT",
            "This mutation identifier has already been used.",
            409,
          );
        }
        return { ...saved, replayed: true };
      }

      const existing = await transaction.serviceRequest.findUnique({
        where: { requestNumber },
        select: {
          id: true,
          status: true,
          assigneeId: true,
          resolvedAt: true,
          version: true,
        },
      });
      if (!existing) {
        throw new RequestCommandError("NOT_FOUND", "Request not found.", 404);
      }
      if (existing.version !== input.version) {
        throw new RequestCommandError(
          "VERSION_CONFLICT",
          "This request changed in another session. Refresh and try again.",
          409,
        );
      }
      if (!isRequestStatus(existing.status)) {
        throw new RequestCommandError("INVALID_STATE", "The current request status is invalid.", 409);
      }

      const nextStatus = input.status ?? existing.status;
      if (!canTransitionStatus(existing.status, nextStatus)) {
        throw new RequestCommandError(
          "INVALID_TRANSITION",
          `Status cannot change from ${existing.status} to ${nextStatus}.`,
          422,
        );
      }

      const assigneeChanged =
        input.assigneeId !== undefined && input.assigneeId !== existing.assigneeId;
      const statusChanged = input.status !== undefined && input.status !== existing.status;
      let assignee: { id: string; name: string } | null = null;
      if (input.assigneeId) {
        assignee = await transaction.user.findFirst({
          where: { id: input.assigneeId, role: "AGENT", isActive: true },
          select: { id: true, name: true },
        });
        if (!assignee) {
          throw new RequestCommandError(
            "INVALID_ASSIGNEE",
            "The selected assignee is not available.",
            422,
          );
        }
      }

      if (assigneeChanged || statusChanged) {
        const changedAt = new Date();
        const resolvedAt =
          nextStatus === "RESOLVED" || nextStatus === "CLOSED"
            ? existing.resolvedAt ?? changedAt
            : null;
        const update = await transaction.serviceRequest.updateMany({
          where: { id: existing.id, version: input.version },
          data: {
            status: nextStatus,
            assigneeId:
              input.assigneeId === undefined ? existing.assigneeId : input.assigneeId,
            resolvedAt,
            version: { increment: 1 },
          },
        });
        if (update.count !== 1) {
          throw new RequestCommandError(
            "VERSION_CONFLICT",
            "This request changed in another session. Refresh and try again.",
            409,
          );
        }

        const activity: Prisma.RequestActivityCreateManyInput[] = [];
        if (assigneeChanged) {
          activity.push({
            requestId: existing.id,
            type: "ASSIGNED",
            actorId: user.id,
            assigneeId: input.assigneeId ?? null,
            fromValue: existing.assigneeId,
            toValue: input.assigneeId ?? null,
            note: assignee ? `Assigned to ${assignee.name}.` : "Request unassigned.",
            createdAt: changedAt,
          });
        }
        if (statusChanged) {
          activity.push({
            requestId: existing.id,
            type: nextStatus === "RESOLVED" ? "RESOLVED" : "STATUS_CHANGED",
            actorId: user.id,
            assigneeId:
              input.assigneeId === undefined ? existing.assigneeId : input.assigneeId,
            fromValue: existing.status,
            toValue: nextStatus,
            note: `Status changed from ${existing.status.toLowerCase().replaceAll("_", " ")} to ${nextStatus.toLowerCase().replaceAll("_", " ")}.`,
            createdAt: changedAt,
          });
        }
        if (activity.length) {
          await transaction.requestActivity.createMany({ data: activity });
        }
      }

      const updated = await transaction.serviceRequest.findUniqueOrThrow({
        where: { id: existing.id },
        select: resultSelect,
      });
      const result: RequestMutationResult = {
        request: serializeRequest(updated),
        replayed: false,
      };
      await transaction.mutationReceipt.create({
        data: {
          id: input.mutationId,
          requestId: existing.id,
          userId: user.id,
          responseJson: JSON.stringify(result),
        },
      });
      return result;
    });
  } catch (error) {
    if (error instanceof RequestCommandError) throw error;
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const receipt = await db.mutationReceipt.findUnique({
        where: { id: input.mutationId },
      });
      if (receipt?.userId === user.id) {
        const saved = JSON.parse(receipt.responseJson) as RequestMutationResult;
        if (saved.request.requestNumber === requestNumber) {
          return { ...saved, replayed: true };
        }
      }
    }
    throw error;
  }
}
