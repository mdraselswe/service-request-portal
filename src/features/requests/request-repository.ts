import "server-only";

import type { Prisma } from "@prisma/client";

import { db } from "@/lib/db";

import type { RequestListQuery } from "./request-query";

export const requestListSelect = {
  id: true,
  requestNumber: true,
  subject: true,
  priority: true,
  status: true,
  updatedAt: true,
  requester: { select: { name: true, email: true } },
  assignee: { select: { id: true, name: true } },
  category: { select: { id: true, name: true, color: true } },
} satisfies Prisma.ServiceRequestSelect;

export type RequestListItem = Prisma.ServiceRequestGetPayload<{
  select: typeof requestListSelect;
}>;

function buildWhere(query: RequestListQuery): Prisma.ServiceRequestWhereInput {
  const filters: Prisma.ServiceRequestWhereInput[] = [];

  if (query.q) {
    filters.push({
      OR: [
        { requestNumber: { contains: query.q } },
        { subject: { contains: query.q } },
        { requester: { name: { contains: query.q } } },
        { requester: { email: { contains: query.q } } },
      ],
    });
  }
  if (query.statuses.length) filters.push({ status: { in: query.statuses } });
  if (query.priorities.length) filters.push({ priority: { in: query.priorities } });
  if (query.category) filters.push({ categoryId: query.category });
  if (query.assignee === "unassigned") filters.push({ assigneeId: null });
  else if (query.assignee) filters.push({ assigneeId: query.assignee });

  return filters.length ? { AND: filters } : {};
}

function buildOrderBy(query: RequestListQuery): Prisma.ServiceRequestOrderByWithRelationInput[] {
  return [{ [query.sort]: query.order }, { id: "asc" }];
}

export async function listRequests(query: RequestListQuery) {
  const where = buildWhere(query);
  const [items, total] = await Promise.all([
    db.serviceRequest.findMany({
      where,
      orderBy: buildOrderBy(query),
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: requestListSelect,
    }),
    db.serviceRequest.count({ where }),
  ]);

  return { items, total };
}

export async function getRequestFilterOptions() {
  const [categories, assignees] = await Promise.all([
    db.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    db.user.findMany({
      where: { role: "AGENT", isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  return { categories, assignees };
}
