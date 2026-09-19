// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createSessionToken, verifySessionToken } from "./session-token";

const originalSecret = process.env.SESSION_SECRET;

describe("session tokens", () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = "test-session-secret-with-more-than-32-characters";
  });

  afterEach(() => {
    process.env.SESSION_SECRET = originalSecret;
  });

  it("round-trips a signed session payload", async () => {
    const token = await createSessionToken({ userId: "usr_admin_001", role: "ADMIN" });
    await expect(verifySessionToken(token)).resolves.toEqual({
      userId: "usr_admin_001",
      role: "ADMIN",
    });
  });

  it("rejects missing and tampered tokens", async () => {
    await expect(verifySessionToken(undefined)).resolves.toBeNull();
    await expect(verifySessionToken("invalid.token.value")).resolves.toBeNull();
  });
});
