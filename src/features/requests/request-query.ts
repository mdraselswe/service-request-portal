import { z } from "zod";

import {
  REQUEST_PRIORITIES,
  REQUEST_STATUSES,
  type RequestPriority,
  type RequestStatus,
} from "./constants";

export const REQUEST_SORTS = [
  "updatedAt",
  "createdAt",
  "requestNumber",
  "priority",
] as const;
export type RequestSort = (typeof REQUEST_SORTS)[number];
export type SortOrder = "asc" | "desc";

export type RequestListQuery = {
  q: string;
  statuses: RequestStatus[];
  priorities: RequestPriority[];
  category?: string;
  assignee?: string;
  sort: RequestSort;
  order: SortOrder;
  page: number;
  pageSize: 10 | 25 | 50;
};

export type RawSearchParams = Record<string, string | string[] | undefined>;

const sortSchema = z.enum(REQUEST_SORTS).catch("updatedAt");
const orderSchema = z.enum(["asc", "desc"]).catch("desc");

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function values(value: string | string[] | undefined) {
  const input = Array.isArray(value) ? value : value ? [value] : [];
  return input.flatMap((item) => item.split(",")).map((item) => item.trim());
}

function uniqueAllowed<T extends string>(value: string | string[] | undefined, allowed: readonly T[]) {
  const allowedSet = new Set<string>(allowed);
  return [...new Set(values(value).filter((item): item is T => allowedSet.has(item)))];
}

function boundedInteger(value: string | undefined, fallback: number, min: number, max: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isInteger(parsed) ? Math.min(Math.max(parsed, min), max) : fallback;
}

export function parseRequestListQuery(params: RawSearchParams): RequestListQuery {
  const requestedPageSize = boundedInteger(first(params.pageSize), 25, 10, 50);
  const pageSize = ([10, 25, 50] as const).includes(
    requestedPageSize as 10 | 25 | 50,
  )
    ? (requestedPageSize as 10 | 25 | 50)
    : 25;

  return {
    q: (first(params.q) ?? "").trim().slice(0, 100),
    statuses: uniqueAllowed(params.status, REQUEST_STATUSES),
    priorities: uniqueAllowed(params.priority, REQUEST_PRIORITIES),
    category: (first(params.category) ?? "").trim() || undefined,
    assignee: (first(params.assignee) ?? "").trim() || undefined,
    sort: sortSchema.parse(first(params.sort)),
    order: orderSchema.parse(first(params.order)),
    page: boundedInteger(first(params.page), 1, 1, 10_000),
    pageSize,
  };
}

export function requestQueryToSearchParams(query: RequestListQuery) {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  query.statuses.forEach((status) => params.append("status", status));
  query.priorities.forEach((priority) => params.append("priority", priority));
  if (query.category) params.set("category", query.category);
  if (query.assignee) params.set("assignee", query.assignee);
  if (query.sort !== "updatedAt") params.set("sort", query.sort);
  if (query.order !== "desc") params.set("order", query.order);
  if (query.page !== 1) params.set("page", String(query.page));
  if (query.pageSize !== 25) params.set("pageSize", String(query.pageSize));
  return params;
}

export function requestListHref(query: RequestListQuery) {
  const value = requestQueryToSearchParams(query).toString();
  return value ? `/requests?${value}` : "/requests";
}
