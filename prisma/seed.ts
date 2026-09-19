import { scryptSync } from "node:crypto";

import { PrismaClient } from "@prisma/client";

import {
  buildSeedDataset,
  DEFAULT_SEEDED_REQUEST_COUNT,
  SEED_CATEGORIES,
  SEED_USERS,
  TEST_PASSWORD,
} from "./seed-data";

const prisma = new PrismaClient();
const INSERT_BATCH_SIZE = 500;

function hashPassword(password: string, salt: string) {
  const digest = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${digest}`;
}

async function insertInBatches<T>(
  records: readonly T[],
  insert: (batch: T[]) => Promise<unknown>,
) {
  for (let index = 0; index < records.length; index += INSERT_BATCH_SIZE) {
    await insert(records.slice(index, index + INSERT_BATCH_SIZE));
  }
}

function requestedCount() {
  const parsed = Number.parseInt(process.env.SEED_REQUEST_COUNT ?? "", 10);
  return Number.isFinite(parsed)
    ? Math.max(DEFAULT_SEEDED_REQUEST_COUNT, parsed)
    : DEFAULT_SEEDED_REQUEST_COUNT;
}

async function main() {
  const requestCount = requestedCount();
  const { requests, activities } = buildSeedDataset(requestCount);

  await prisma.$transaction([
    prisma.mutationReceipt.deleteMany(),
    prisma.requestActivity.deleteMany(),
    prisma.serviceRequest.deleteMany(),
    prisma.category.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  await prisma.user.createMany({
    data: SEED_USERS.map((user) => ({
      ...user,
      passwordHash: hashPassword(TEST_PASSWORD, `service-portal:${user.email}`),
    })),
  });
  await prisma.category.createMany({ data: [...SEED_CATEGORIES] });
  await insertInBatches(requests, (data) => prisma.serviceRequest.createMany({ data }));
  await insertInBatches(activities, (data) => prisma.requestActivity.createMany({ data }));

  const [savedRequests, savedActivities] = await Promise.all([
    prisma.serviceRequest.count(),
    prisma.requestActivity.count(),
  ]);

  if (savedRequests < 10_000 || savedRequests !== requestCount) {
    throw new Error(`Seed verification failed: expected ${requestCount} requests, saved ${savedRequests}.`);
  }

  console.info(
    `Seed complete: ${SEED_USERS.length} users, ${SEED_CATEGORIES.length} categories, ${savedRequests} requests, and ${savedActivities} activity records.`,
  );
  console.info(`Test login prepared for Phase 3: admin@assunnah.org / ${TEST_PASSWORD}`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
