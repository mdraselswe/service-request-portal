import { describe, expect, it } from "vitest";

import {
  parseRequestListQuery,
  requestListHref,
  requestQueryToSearchParams,
} from "./request-query";

describe("request list query", () => {
  it("normalizes repeated and comma-separated filters", () => {
    expect(
      parseRequestListQuery({
        q: "  payroll  ",
        status: ["OPEN,RESOLVED", "OPEN"],
        priority: "URGENT,HIGH,INVALID",
        page: "3",
        pageSize: "50",
        sort: "requestNumber",
        order: "asc",
      }),
    ).toMatchObject({
      q: "payroll",
      statuses: ["OPEN", "RESOLVED"],
      priorities: ["URGENT", "HIGH"],
      page: 3,
      pageSize: 50,
      sort: "requestNumber",
      order: "asc",
    });
  });

  it("falls back safely for invalid values", () => {
    expect(
      parseRequestListQuery({ page: "-20", pageSize: "17", sort: "unknown", order: "sideways" }),
    ).toMatchObject({
      page: 1,
      pageSize: 25,
      sort: "updatedAt",
      order: "desc",
      statuses: [],
      priorities: [],
    });
  });

  it("omits defaults and preserves meaningful URL state", () => {
    const query = parseRequestListQuery({
      q: "email",
      status: "OPEN",
      assignee: "unassigned",
      page: "2",
    });

    expect(requestQueryToSearchParams(query).toString()).toContain("q=email");
    expect(requestQueryToSearchParams(query).toString()).not.toContain("sort=");
    expect(requestListHref(query)).toContain("page=2");
  });
});
