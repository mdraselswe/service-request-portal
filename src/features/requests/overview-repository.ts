import "server-only";

import { db } from "@/lib/db";

const recentRequestSelect = {
  id: true,
  requestNumber: true,
  subject: true,
  status: true,
  priority: true,
  updatedAt: true,
  requester: { select: { name: true } },
  assignee: { select: { name: true } },
} as const;

export async function getOverviewData() {
  const [open, inProgress, resolved, activeAgents, recentRequests] =
    await Promise.all([
      db.serviceRequest.count({ where: { status: "OPEN" } }),
      db.serviceRequest.count({ where: { status: "IN_PROGRESS" } }),
      db.serviceRequest.count({ where: { status: "RESOLVED" } }),
      db.user.count({ where: { role: "AGENT", isActive: true } }),
      db.serviceRequest.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        select: recentRequestSelect,
      }),
    ]);

  return {
    counts: { activeAgents, inProgress, open, resolved },
    recentRequests,
  };
}
