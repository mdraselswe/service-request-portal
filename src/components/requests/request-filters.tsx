"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { FilterX, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { REQUEST_PRIORITIES, REQUEST_STATUSES } from "@/features/requests/constants";
import type { RequestListQuery } from "@/features/requests/request-query";
import { cn } from "@/lib/utils";

import { useRequestQueryNavigation } from "./use-request-query-navigation";

type FilterOption = { id: string; name: string };

const labels: Record<string, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  WAITING: "Waiting",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

const subscribeToHydration = () => () => undefined;

export function RequestFilters({
  query,
  categories,
  assignees,
}: {
  query: RequestListQuery;
  categories: FilterOption[];
  assignees: FilterOption[];
}) {
  const { clearQuery, isPending, replaceQuery } = useRequestQueryNavigation();

  function toggleRepeated(name: "status" | "priority", value: string) {
    replaceQuery((params) => {
      const current = params.getAll(name);
      params.delete(name);
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      next.forEach((item) => params.append(name, item));
    });
  }

  const activeFilterCount =
    query.statuses.length +
    query.priorities.length +
    Number(Boolean(query.category)) +
    Number(Boolean(query.assignee)) +
    Number(Boolean(query.q));

  return (
    <section
      aria-label="Request search and filters"
      aria-busy={isPending}
      className={cn(
        "rounded-2xl border border-border bg-background p-4 shadow-sm transition-opacity sm:p-5",
        isPending && "opacity-70",
      )}
    >
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <SearchField
          key={query.q}
          initialValue={query.q}
          onCommit={(value) =>
            replaceQuery((params) => {
              if (value) params.set("q", value);
              else params.delete("q");
            })
          }
        />

        <div className="grid gap-3 sm:grid-cols-2 xl:flex xl:items-center">
          <label className="sr-only" htmlFor="category-filter">
            Filter by category
          </label>
          <select
            id="category-filter"
            className="select-control h-11 min-w-44 rounded-lg border border-input bg-background pl-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring/25"
            onChange={(event) =>
              replaceQuery((params) => {
                if (event.target.value) params.set("category", event.target.value);
                else params.delete("category");
              })
            }
            value={query.category ?? ""}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="assignee-filter">
            Filter by assignee
          </label>
          <select
            id="assignee-filter"
            className="select-control h-11 min-w-44 rounded-lg border border-input bg-background pl-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring/25"
            onChange={(event) =>
              replaceQuery((params) => {
                if (event.target.value) params.set("assignee", event.target.value);
                else params.delete("assignee");
              })
            }
            value={query.assignee ?? ""}
          >
            <option value="">All assignees</option>
            <option value="unassigned">Unassigned</option>
            {assignees.map((assignee) => (
              <option key={assignee.id} value={assignee.id}>
                {assignee.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4 border-t border-border pt-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <SlidersHorizontal aria-hidden="true" className="size-3.5" />
              Status
            </span>
            {REQUEST_STATUSES.map((status) => (
              <button
                aria-pressed={query.statuses.includes(status)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  query.statuses.includes(status)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                key={status}
                onClick={() => toggleRepeated("status", status)}
                type="button"
              >
                {labels[status]}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Priority
            </span>
            {REQUEST_PRIORITIES.map((priority) => (
              <button
                aria-pressed={query.priorities.includes(priority)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  query.priorities.includes(priority)
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                key={priority}
                onClick={() => toggleRepeated("priority", priority)}
                type="button"
              >
                {labels[priority]}
              </button>
            ))}
          </div>
        </div>

        {activeFilterCount > 0 ? (
          <div className="flex items-center justify-between gap-4 border-t border-dashed border-border pt-3">
            <p className="text-xs font-medium text-muted-foreground">
              {activeFilterCount} active {activeFilterCount === 1 ? "filter" : "filters"}
            </p>
            <Button
              onClick={clearQuery}
              size="sm"
              type="button"
              variant="ghost"
            >
              <FilterX aria-hidden="true" />
              Clear filters
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function SearchField({
  initialValue,
  onCommit,
}: {
  initialValue: string;
  onCommit: (value: string) => void;
}) {
  const [value, setValue] = useState(initialValue);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return (
    <div className="relative flex-1">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        aria-label="Search requests"
        className="pl-10"
        data-hydrated={hydrated}
        onChange={(event) => {
          const next = event.target.value;
          setValue(next);
          if (timer.current) clearTimeout(timer.current);
          timer.current = setTimeout(() => onCommit(next.trim()), 350);
        }}
        placeholder="Search by ID, subject, requester, or email..."
        readOnly={!hydrated}
        type="search"
        value={value}
      />
    </div>
  );
}
