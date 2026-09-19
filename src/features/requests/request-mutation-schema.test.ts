import { describe, expect, it } from "vitest";

import { requestMutationSchema } from "./request-mutation-schema";

describe("requestMutationSchema", () => {
  it("accepts a versioned status or assignee update", () => {
    expect(
      requestMutationSchema.safeParse({
        mutationId: "9fbe5926-9e6e-4f2c-b204-b1b26ef49710",
        version: 3,
        status: "RESOLVED",
      }).success,
    ).toBe(true);
    expect(
      requestMutationSchema.safeParse({
        mutationId: "02eaab15-4468-4e9c-a6a7-048dc259d8c8",
        version: 3,
        assigneeId: null,
      }).success,
    ).toBe(true);
  });

  it("rejects missing changes and invalid status values", () => {
    expect(
      requestMutationSchema.safeParse({
        mutationId: "9fbe5926-9e6e-4f2c-b204-b1b26ef49710",
        version: 3,
      }).success,
    ).toBe(false);
    expect(
      requestMutationSchema.safeParse({
        mutationId: "9fbe5926-9e6e-4f2c-b204-b1b26ef49710",
        version: 3,
        status: "INVALID",
      }).success,
    ).toBe(false);
  });
});
