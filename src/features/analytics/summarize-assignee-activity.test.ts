import { describe, expect, it } from "vitest";

import { summarizeAssigneeActivity } from "./summarize-assignee-activity";

describe("summarizeAssigneeActivity", () => {
  it("summarizes unique assignments, resolutions, and resolution time", () => {
    const result = summarizeAssigneeActivity([
      {
        assigneeId: "agent-1",
        assigneeName: "Amina Rahman",
        requestId: "request-1",
        type: "RESOLVED",
        createdAt: "2026-01-02T12:00:00.000Z",
      },
      {
        assigneeId: "agent-1",
        assigneeName: "Amina Rahman",
        requestId: "request-1",
        type: "ASSIGNED",
        createdAt: "2026-01-01T12:00:00.000Z",
      },
      {
        assigneeId: "agent-1",
        assigneeName: "Amina Rahman",
        requestId: "request-1",
        type: "ASSIGNED",
        createdAt: "2026-01-01T13:00:00.000Z",
      },
      {
        assigneeId: "agent-2",
        assigneeName: "Fahim Ahmed",
        requestId: "request-2",
        type: "ASSIGNED",
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ]);

    expect(result).toEqual([
      {
        assigneeId: "agent-1",
        assigneeName: "Amina Rahman",
        totalAssigned: 1,
        totalResolved: 1,
        averageResolutionHours: 24,
      },
      {
        assigneeId: "agent-2",
        assigneeName: "Fahim Ahmed",
        totalAssigned: 1,
        totalResolved: 0,
        averageResolutionHours: null,
      },
    ]);
  });

  it("ignores incomplete, invalid, and unsupported records", () => {
    const result = summarizeAssigneeActivity([
      { assigneeId: "", requestId: "request-1", type: "ASSIGNED", createdAt: new Date() },
      { assigneeId: "agent-1", requestId: null, type: "ASSIGNED", createdAt: new Date() },
      { assigneeId: "agent-1", requestId: "request-1", type: "CREATED", createdAt: new Date() },
      { assigneeId: "agent-1", requestId: "request-1", type: "ASSIGNED", createdAt: "invalid" },
      { assigneeId: "agent-1", requestId: "request-1", type: "RESOLVED", createdAt: "2026-01-01" },
    ]);

    expect(result).toEqual([
      {
        assigneeId: "agent-1",
        assigneeName: "Unknown assignee",
        totalAssigned: 0,
        totalResolved: 1,
        averageResolutionHours: null,
      },
    ]);
  });

  it("processes a large iterable without mutating it", () => {
    function* records() {
      for (let index = 0; index < 25_000; index += 1) {
        const assignedAt = new Date(2026, 0, 1, index % 24);
        yield {
          assigneeId: `agent-${index % 10}`,
          assigneeName: `Agent ${index % 10}`,
          requestId: `request-${index}`,
          type: "ASSIGNED",
          createdAt: assignedAt,
        };
        yield {
          assigneeId: `agent-${index % 10}`,
          assigneeName: `Agent ${index % 10}`,
          requestId: `request-${index}`,
          type: "RESOLVED",
          createdAt: new Date(assignedAt.getTime() + 7_200_000),
        };
      }
    }

    const result = summarizeAssigneeActivity(records());

    expect(result).toHaveLength(10);
    expect(result.every((summary) => summary.totalAssigned === 2_500)).toBe(true);
    expect(result.every((summary) => summary.totalResolved === 2_500)).toBe(true);
    expect(result.every((summary) => summary.averageResolutionHours === 2)).toBe(true);
  });
});
