import "dotenv/config";

import { mkdir, open } from "node:fs/promises";
import { dirname, isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function resolveDatabasePath(databaseUrl: string) {
  if (!databaseUrl.startsWith("file:")) {
    throw new Error("DATABASE_URL must use a file: URL for the SQLite database.");
  }

  const encodedPath = databaseUrl.slice("file:".length).split("?", 1)[0];
  if (!encodedPath || encodedPath === ":memory:") return null;

  const databasePath = decodeURIComponent(encodedPath);
  const schemaDirectory = dirname(fileURLToPath(import.meta.url));
  return isAbsolute(databasePath)
    ? databasePath
    : resolve(schemaDirectory, databasePath);
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required.");
  }

  const databasePath = resolveDatabasePath(databaseUrl);
  if (!databasePath) return;

  await mkdir(dirname(databasePath), { recursive: true });
  const database = await open(databasePath, "a");
  await database.close();
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
