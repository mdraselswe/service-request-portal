import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({ db: {} }));

import { getDatasetStats } from "./dataset-repository";

describe("getDatasetStats", () => {
  it("collects independent dataset counts concurrently", async () => {
    const stats = await getDatasetStats({
      countUsers: vi.fn().mockResolvedValue(43),
      countCategories: vi.fn().mockResolvedValue(8),
      countRequests: vi.fn().mockResolvedValue(10_050),
      countActivities: vi.fn().mockResolvedValue(32_400),
    });

    expect(stats).toEqual({
      users: 43,
      categories: 8,
      requests: 10_050,
      activities: 32_400,
    });
  });
});
