type UnknownActivityRecord = {
  assigneeId?: unknown;
  assigneeName?: unknown;
  requestId?: unknown;
  type?: unknown;
  createdAt?: unknown;
};

export type AssigneeActivitySummary = {
  assigneeId: string;
  assigneeName: string;
  totalAssigned: number;
  totalResolved: number;
  averageResolutionHours: number | null;
};

type AssigneeAccumulator = {
  name: string;
  assignedRequests: Set<string>;
  resolvedRequests: Set<string>;
};

type RequestTimeline = {
  assigneeId: string;
  assignedAt?: number;
  resolvedAt?: number;
};

const SUPPORTED_TYPES = new Set(["ASSIGNED", "RESOLVED"]);

function parseTimestamp(value: unknown): number | null {
  if (!(value instanceof Date) && typeof value !== "string" && typeof value !== "number") {
    return null;
  }

  const timestamp = value instanceof Date ? value.getTime() : new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function summarizeAssigneeActivity(
  records: Iterable<UnknownActivityRecord>,
): AssigneeActivitySummary[] {
  const assignees = new Map<string, AssigneeAccumulator>();
  const timelines = new Map<string, RequestTimeline>();

  for (const record of records) {
    if (
      !isNonEmptyString(record.assigneeId) ||
      !isNonEmptyString(record.requestId) ||
      !isNonEmptyString(record.type) ||
      !SUPPORTED_TYPES.has(record.type)
    ) {
      continue;
    }

    const createdAt = parseTimestamp(record.createdAt);
    if (createdAt === null) {
      continue;
    }

    const assigneeId = record.assigneeId.trim();
    const requestId = record.requestId.trim();
    const displayName = isNonEmptyString(record.assigneeName)
      ? record.assigneeName.trim()
      : "Unknown assignee";
    const assignee = assignees.get(assigneeId) ?? {
      name: displayName,
      assignedRequests: new Set<string>(),
      resolvedRequests: new Set<string>(),
    };

    if (assignee.name === "Unknown assignee" && displayName !== assignee.name) {
      assignee.name = displayName;
    }
    assignees.set(assigneeId, assignee);

    const timelineKey = `${assigneeId}\u0000${requestId}`;
    const timeline = timelines.get(timelineKey) ?? { assigneeId };

    if (record.type === "ASSIGNED") {
      assignee.assignedRequests.add(requestId);
      timeline.assignedAt =
        timeline.assignedAt === undefined
          ? createdAt
          : Math.min(timeline.assignedAt, createdAt);
    } else {
      assignee.resolvedRequests.add(requestId);
      timeline.resolvedAt =
        timeline.resolvedAt === undefined
          ? createdAt
          : Math.min(timeline.resolvedAt, createdAt);
    }

    timelines.set(timelineKey, timeline);
  }

  const resolutionTotals = new Map<string, { milliseconds: number; count: number }>();
  for (const timeline of timelines.values()) {
    if (
      timeline.assignedAt === undefined ||
      timeline.resolvedAt === undefined ||
      timeline.resolvedAt < timeline.assignedAt
    ) {
      continue;
    }

    const total = resolutionTotals.get(timeline.assigneeId) ?? {
      milliseconds: 0,
      count: 0,
    };
    total.milliseconds += timeline.resolvedAt - timeline.assignedAt;
    total.count += 1;
    resolutionTotals.set(timeline.assigneeId, total);
  }

  return Array.from(assignees, ([assigneeId, assignee]) => {
    const resolution = resolutionTotals.get(assigneeId);
    return {
      assigneeId,
      assigneeName: assignee.name,
      totalAssigned: assignee.assignedRequests.size,
      totalResolved: assignee.resolvedRequests.size,
      averageResolutionHours: resolution
        ? Number(
            (resolution.milliseconds / resolution.count / 3_600_000).toFixed(2),
          )
        : null,
    };
  }).sort(
    (a, b) =>
      b.totalAssigned - a.totalAssigned ||
      a.assigneeName.localeCompare(b.assigneeName),
  );
}
