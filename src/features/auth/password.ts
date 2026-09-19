import "server-only";

import { scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

export async function verifyPassword(password: string, encodedHash: string) {
  const [algorithm, salt, expectedHex, extra] = encodedHash.split("$");
  if (algorithm !== "scrypt" || !salt || !expectedHex || extra) return false;

  const expected = Buffer.from(expectedHex, "hex");
  if (expected.length !== 64) return false;

  const derived = (await scryptAsync(password, salt, expected.length)) as Buffer;
  return timingSafeEqual(derived, expected);
}
