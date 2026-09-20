export const USER_ROLES = ["ADMIN", "AGENT", "REQUESTER"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const REQUEST_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
export type RequestPriority = (typeof REQUEST_PRIORITIES)[number];

export const REQUEST_PRIORITY_RANK = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  URGENT: 4,
} as const satisfies Record<RequestPriority, number>;

export const REQUEST_STATUSES = [
  "OPEN",
  "IN_PROGRESS",
  "WAITING",
  "RESOLVED",
  "CLOSED",
] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const ACTIVITY_TYPES = [
  "CREATED",
  "ASSIGNED",
  "STATUS_CHANGED",
  "COMMENT_ADDED",
  "RESOLVED",
] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];
