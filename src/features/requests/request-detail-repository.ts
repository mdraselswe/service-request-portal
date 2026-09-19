import "server-only";

import { db } from "@/lib/db";

export async function getRequestDetail(requestNumber: string) {
  return db.serviceRequest.findUnique({
    where: { requestNumber },
    include: {
      requester: { select: { id: true, name: true, email: true } },
      assignee: { select: { id: true, name: true, email: true } },
      category: { select: { id: true, name: true, color: true } },
      activity: {
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        include: {
          actor: { select: { id: true, name: true } },
          assignee: { select: { id: true, name: true } },
        },
      },
    },
  });
}

export function getAssignableUsers() {
  return db.user.findMany({
    where: { role: "AGENT", isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, email: true },
  });
}
