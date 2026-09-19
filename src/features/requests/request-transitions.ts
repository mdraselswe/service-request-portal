import { REQUEST_STATUSES, type RequestStatus } from "./constants";

const TRANSITIONS: Record<RequestStatus, readonly RequestStatus[]> = {
  OPEN: ["IN_PROGRESS", "WAITING", "RESOLVED"],
  IN_PROGRESS: ["OPEN", "WAITING", "RESOLVED"],
  WAITING: ["IN_PROGRESS", "RESOLVED"],
  RESOLVED: ["IN_PROGRESS", "CLOSED"],
  CLOSED: ["IN_PROGRESS"],
};

export function isRequestStatus(value: string): value is RequestStatus {
  return REQUEST_STATUSES.includes(value as RequestStatus);
}

export function canTransitionStatus(from: RequestStatus, to: RequestStatus) {
  return from === to || TRANSITIONS[from].includes(to);
}

export function selectableStatuses(current: RequestStatus) {
  return [current, ...TRANSITIONS[current]];
}
