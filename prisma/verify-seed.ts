import "dotenv/config";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const [users, categories, requests, activities, statusGroups, unassigned] =
    await Promise.all([
      prisma.user.count(),
      prisma.category.count(),
      prisma.serviceRequest.count(),
      prisma.requestActivity.count(),
      prisma.serviceRequest.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
      prisma.serviceRequest.count({ where: { assigneeId: null } }),
    ]);

  if (requests < 10_000) {
    throw new Error(`Expected at least 10,000 requests, found ${requests}.`);
  }
  if (users < 10 || categories < 5 || activities <= requests) {
    throw new Error("Seeded relations do not meet the expected dataset shape.");
  }
  if (statusGroups.length < 5 || unassigned === 0) {
    throw new Error("Seeded requests do not contain the expected workflow variety.");
  }

  console.info(
    JSON.stringify(
      {
        users,
        categories,
        requests,
        activities,
        unassigned,
        statuses: Object.fromEntries(
          statusGroups.map((group) => [group.status, group._count._all]),
        ),
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
