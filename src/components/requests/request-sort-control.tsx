"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import type { RequestListQuery } from "@/features/requests/request-query";

const sortOptions = [
  { value: "updatedAt:desc", label: "Recently updated" },
  { value: "updatedAt:asc", label: "Oldest update" },
  { value: "createdAt:desc", label: "Newest created" },
  { value: "createdAt:asc", label: "Oldest created" },
  { value: "requestNumber:asc", label: "Request ID ascending" },
  { value: "requestNumber:desc", label: "Request ID descending" },
  { value: "priority:desc", label: "Priority descending" },
] as const;

export function RequestSortControl({ query }: { query: RequestListQuery }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  function replace(update: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    update(params);
    params.delete("page");
    startTransition(() => {
      router.replace(params.toString() ? `${pathname}?${params}` : pathname, {
        scroll: false,
      });
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2" aria-busy={pending}>
      <label className="text-xs font-semibold text-muted-foreground" htmlFor="page-size">
        Rows
      </label>
      <select
        id="page-size"
        className="h-9 rounded-lg border border-input bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/25"
        disabled={pending}
        onChange={(event) =>
          replace((params) => {
            if (event.target.value === "25") params.delete("pageSize");
            else params.set("pageSize", event.target.value);
          })
        }
        value={query.pageSize}
      >
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
      </select>

      <label className="sr-only" htmlFor="request-sort">Sort requests</label>
      <select
        id="request-sort"
        className="h-9 min-w-44 rounded-lg border border-input bg-background px-2 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring/25"
        disabled={pending}
        onChange={(event) => {
          const [sort, order] = event.target.value.split(":");
          replace((params) => {
            if (sort === "updatedAt") params.delete("sort");
            else params.set("sort", sort ?? "updatedAt");
            if (order === "desc") params.delete("order");
            else params.set("order", order ?? "desc");
          });
        }}
        value={`${query.sort}:${query.order}`}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
