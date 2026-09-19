import { describe, expect, it } from "vitest";

import {
  canTransitionStatus,
  isRequestStatus,
  selectableStatuses,
} from "./request-transitions";

describe("request status transitions", () => {
  it("allows supported workflow changes and the current value", () => {
    expect(canTransitionStatus("OPEN", "IN_PROGRESS")).toBe(true);
    expect(canTransitionStatus("RESOLVED", "CLOSED")).toBe(true);
    expect(canTransitionStatus("WAITING", "WAITING")).toBe(true);
  });

  it("rejects unsupported workflow changes", () => {
    expect(canTransitionStatus("OPEN", "CLOSED")).toBe(false);
    expect(canTransitionStatus("CLOSED", "OPEN")).toBe(false);
  });

  it("returns selectable statuses and recognizes valid values", () => {
    expect(selectableStatuses("CLOSED")).toEqual(["CLOSED", "IN_PROGRESS"]);
    expect(isRequestStatus("RESOLVED")).toBe(true);
    expect(isRequestStatus("INVALID")).toBe(false);
  });
});
