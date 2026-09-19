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
  });

  it("rejects invalid record counts", () => {
    expect(() => buildSeedDataset(0)).toThrowError(/positive integer/i);
    expect(() => buildSeedDataset(1.5)).toThrowError(/positive integer/i);
  });
});
