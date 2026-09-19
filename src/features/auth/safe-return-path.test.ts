import { describe, expect, it } from "vitest";

import { safeReturnPath } from "./safe-return-path";

describe("safeReturnPath", () => {
  it("preserves valid internal paths and query strings", () => {
    expect(safeReturnPath("/requests/SR-10001?tab=activity")).toBe(
      "/requests/SR-10001?tab=activity",
    );
  });

  it("rejects external, protocol-relative, and login destinations", () => {
    expect(safeReturnPath("https://malicious.example/path")).toBe("/");
    expect(safeReturnPath("//malicious.example/path")).toBe("/");
    expect(safeReturnPath("/login")).toBe("/");
  });
});
