import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Inbox } from "lucide-react";

import { RequestFilters } from "@/components/requests/request-filters";
import { RequestPagination } from "@/components/requests/request-pagination";
import { RequestResults } from "@/components/requests/request-results";
import { RequestSortControl } from "@/components/requests/request-sort-control";
import {
  parseRequestListQuery,
  requestListHref,
  type RawSearchParams,
} from "@/features/requests/request-query";
import {
  getRequestFilterOptions,
  listRequests,
} from "@/features/requests/request-repository";

export const metadata: Metadata = {
  title: "Requests",
};

type RequestsPageProps = {
  searchParams: Promise<RawSearchParams>;
};

export default async function RequestsPage({ searchParams }: RequestsPageProps) {
  const query = parseRequestListQuery(await searchParams);
  const [{ items, total }, options] = await Promise.all([
    listRequests(query),
    getRequestFilterOptions(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / query.pageSize));

  if (total > 0 && query.page > totalPages) {
    redirect(requestListHref({ ...query, page: totalPages }));
  }

  const start = total === 0 ? 0 : (query.page - 1) * query.pageSize + 1;
  const end = Math.min(query.page * query.pageSize, total);
  const filtered = Boolean(
    query.q ||
      query.statuses.length ||
      query.priorities.length ||
      query.category ||
      query.assignee,
  );

  return (
    <div className="mx-auto max-w-[96rem]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Request management</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Service requests
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Review workload, ownership, status, and priority across the organization.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 shadow-sm">
          <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
            <Inbox aria-hidden="true" className="size-4.5" />
          </span>
          <div>
            <p className="text-lg font-bold leading-none">{total.toLocaleString()}</p>
            <p className="mt-1 text-xs text-muted-foreground">Matching requests</p>
          </div>
        </div>
      </div>

      <div className="mt-7">
        <RequestFilters query={query} {...options} />
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{start}-{end}</span> of{" "}
          <span className="font-semibold text-foreground">{total.toLocaleString()}</span> requests
        </p>
        <RequestSortControl query={query} />
      </div>

      <div className="mt-4">
        <RequestResults filtered={filtered} items={items} />
      </div>

      <div className="mt-5">
        <RequestPagination query={query} total={total} />
      </div>
    </div>
  );
}
