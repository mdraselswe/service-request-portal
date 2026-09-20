"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { FilterX, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RequestListQuery } from "@/features/requests/request-query";
import { cn } from "@/lib/utils";

import { MobileRequestFilterSheet } from "./mobile-request-filter-sheet";
import {
  FilterChips,
  FilterControls,
  FilterCount,
  FilterSelects,
  type FilterOption,
  type RepeatedFilter,
  type SingleFilter,
} from "./request-filter-controls";
import { useRequestQueryNavigation } from "./use-request-query-navigation";

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
  const { isPending, replaceQuery } = useRequestQueryNavigation();
  const [sheetOpen, setSheetOpen] = useState(false);

  function toggleRepeated(name: RepeatedFilter, value: string) {
    replaceQuery((params) => {
      const current = params.getAll(name);
      params.delete(name);
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      next.forEach((item) => params.append(name, item));
    });
  }

  function setSingle(name: SingleFilter, value: string) {
    replaceQuery((params) => {
      if (value) params.set(name, value);
      else params.delete(name);
    });
  }

  function clearFilters() {
    replaceQuery((params) => {
      params.delete("status");
      params.delete("priority");
      params.delete("category");
      params.delete("assignee");
    });
  }

  const filterCount =
    query.statuses.length +
    query.priorities.length +
    Number(Boolean(query.category)) +
    Number(Boolean(query.assignee));

  const search = (
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
  );

  return (
    <>
      <section
        aria-label="Search service requests"
        aria-busy={isPending}
        className={cn(
          "rounded-2xl border border-border bg-background/90 p-3 shadow-md backdrop-blur-xl transition-opacity md:hidden",
          isPending && "opacity-70",
        )}
      >
        {search}
      </section>

      <section
        aria-label="Request search and filters"
        aria-busy={isPending}
        className={cn(
          "hidden rounded-2xl border border-border bg-background/95 p-4 shadow-sm backdrop-blur-xl transition-[opacity,box-shadow,border-color] duration-200 md:block sm:p-5",
          isPending && "opacity-70",
        )}
      >
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          {search}
          <FilterSelects
            assignees={assignees}
            categories={categories}
            idPrefix="desktop"
            onSelect={setSingle}
            query={query}
          />
        </div>

        <div className="mt-4 border-t border-border pt-4">
          <FilterChips onToggle={toggleRepeated} query={query} />
          {filterCount > 0 ? (
            <div className="mt-4 flex items-center justify-between gap-4 border-t border-dashed border-border pt-3">
              <FilterCount count={filterCount} />
              <Button onClick={clearFilters} size="sm" type="button" variant="ghost">
                <FilterX aria-hidden="true" />
                Clear filters
              </Button>
            </div>
          ) : null}
        </div>
      </section>

      <MobileRequestFilterSheet
        filterCount={filterCount}
        isPending={isPending}
        onClear={clearFilters}
        onOpenChange={setSheetOpen}
        open={sheetOpen}
      >
        <FilterControls
          assignees={assignees}
          categories={categories}
          idPrefix="mobile"
          onSelect={setSingle}
          onToggle={toggleRepeated}
          query={query}
        />
      </MobileRequestFilterSheet>
    </>
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
