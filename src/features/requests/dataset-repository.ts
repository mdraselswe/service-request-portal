import "server-only";

import { db } from "@/lib/db";

export type DatasetStats = {
  users: number;
  categories: number;
  requests: number;
  activities: number;
};

export type DatasetCounter = {
  countUsers: () => Promise<number>;
  countCategories: () => Promise<number>;
  countRequests: () => Promise<number>;
  countActivities: () => Promise<number>;
};

const prismaDatasetCounter: DatasetCounter = {
  countUsers: () => db.user.count(),
  countCategories: () => db.category.count(),
  countRequests: () => db.serviceRequest.count(),
  countActivities: () => db.requestActivity.count(),
};

export async function getDatasetStats(
  counter: DatasetCounter = prismaDatasetCounter,
): Promise<DatasetStats> {
  const [users, categories, requests, activities] = await Promise.all([
    counter.countUsers(),
    counter.countCategories(),
    counter.countRequests(),
    counter.countActivities(),
  ]);

  return { users, categories, requests, activities };
}
