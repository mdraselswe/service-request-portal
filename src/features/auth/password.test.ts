import { scryptSync } from "node:crypto";

import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { verifyPassword } from "./password";

function hash(password: string) {
  const salt = "test-salt";
  return `scrypt$${salt}$${scryptSync(password, salt, 64).toString("hex")}`;
}

describe("verifyPassword", () => {
  it("accepts the matching scrypt password", async () => {
    await expect(verifyPassword("Portal@123", hash("Portal@123"))).resolves.toBe(true);
  });

  it("rejects a different password and malformed hashes", async () => {
    await expect(verifyPassword("incorrect", hash("Portal@123"))).resolves.toBe(false);
    await expect(verifyPassword("Portal@123", "invalid")).resolves.toBe(false);
  });
});
