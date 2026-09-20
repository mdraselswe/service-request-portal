import { describe, expect, it } from "vitest";

import { buildSeedDataset, SEED_CATEGORIES, SEED_USERS } from "./seed-data";

describe("buildSeedDataset", () => {
  it("builds deterministic, related request and activity records", () => {
    const first = buildSeedDataset(250, 42);
    const second = buildSeedDataset(250, 42);

    expect(first).toEqual(second);
    expect(first.requests).toHaveLength(250);
    expect(first.activities.length).toBeGreaterThan(500);
    expect(new Set(first.requests.map((request) => request.requestNumber)).size).toBe(250);

    const userIds = new Set(SEED_USERS.map((user) => user.id));
    const categoryIds = new Set(SEED_CATEGORIES.map((category) => category.id));
    const requestIds = new Set(first.requests.map((request) => request.id));

    expect(first.requests.every((request) => userIds.has(request.requesterId))).toBe(true);
    expect(first.requests.every((request) => categoryIds.has(request.categoryId))).toBe(true);
    expect(first.activities.every((activity) => requestIds.has(activity.requestId))).toBe(true);

    for (const request of first.requests) {
      const timeline = first.activities
        .filter((activity) => activity.requestId === request.id)
        .sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime());
      let currentStatus: string | null = null;

      for (const activity of timeline) {
        if (activity.type === "CREATED") {
          currentStatus = activity.toValue;
        } else if (
          activity.type === "STATUS_CHANGED" ||
          activity.type === "RESOLVED"
        ) {
          expect(activity.fromValue).toBe(currentStatus);
          currentStatus = activity.toValue;
        }
      }

      expect(currentStatus).toBe(request.status);
      expect(request.updatedAt.getTime()).toBe(timeline.at(-1)?.createdAt.getTime());
      expect(timeline.at(-1)?.createdAt.getTime()).toBeLessThanOrEqual(
        new Date("2026-09-15T12:00:00.000Z").getTime(),
      );
    }
  });

  it("rejects invalid record counts", () => {
    expect(() => buildSeedDataset(0)).toThrowError(/positive integer/i);
    expect(() => buildSeedDataset(1.5)).toThrowError(/positive integer/i);
  });
});
