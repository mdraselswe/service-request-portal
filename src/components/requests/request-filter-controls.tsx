import { SlidersHorizontal } from "lucide-react";

import { REQUEST_PRIORITIES, REQUEST_STATUSES } from "@/features/requests/constants";
import type { RequestListQuery } from "@/features/requests/request-query";
import { cn } from "@/lib/utils";

export type FilterOption = { id: string; name: string };
export type RepeatedFilter = "status" | "priority";
export type SingleFilter = "category" | "assignee";

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

export function FilterControls({
  query,
  categories,
  assignees,
  idPrefix,
  onSelect,
  onToggle,
}: {
  query: RequestListQuery;
  categories: FilterOption[];
  assignees: FilterOption[];
  idPrefix: string;
  onSelect: (name: SingleFilter, value: string) => void;
  onToggle: (name: RepeatedFilter, value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <FilterSelects
        assignees={assignees}
        categories={categories}
        idPrefix={idPrefix}
        onSelect={onSelect}
        query={query}
        stacked
      />
      <FilterChips onToggle={onToggle} query={query} stacked />
    </div>
  );
}

export function FilterSelects({
  query,
  categories,
  assignees,
  idPrefix,
  onSelect,
  stacked = false,
}: {
  query: RequestListQuery;
  categories: FilterOption[];
  assignees: FilterOption[];
  idPrefix: string;
  onSelect: (name: SingleFilter, value: string) => void;
  stacked?: boolean;
}) {
  const categoryId = `${idPrefix}-category-filter`;
  const assigneeId = `${idPrefix}-assignee-filter`;

  return (
    <div className={cn("grid gap-3 sm:grid-cols-2 xl:flex xl:items-center", stacked && "grid-cols-1 sm:grid-cols-2 xl:grid xl:grid-cols-2")}>
      <div className="space-y-2">
        <label className={stacked ? "text-sm font-semibold" : "sr-only"} htmlFor={categoryId}>
          {stacked ? "Category" : "Filter by category"}
        </label>
        <select
          id={categoryId}
          className="select-control h-11 w-full min-w-44 rounded-lg border border-input bg-background pl-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring/25"
          onChange={(event) => onSelect("category", event.target.value)}
          value={query.category ?? ""}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className={stacked ? "text-sm font-semibold" : "sr-only"} htmlFor={assigneeId}>
          {stacked ? "Assignee" : "Filter by assignee"}
        </label>
        <select
          id={assigneeId}
          className="select-control h-11 w-full min-w-44 rounded-lg border border-input bg-background pl-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring/25"
          onChange={(event) => onSelect("assignee", event.target.value)}
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
  );
}

export function FilterChips({
  query,
  onToggle,
  stacked = false,
}: {
  query: RequestListQuery;
  onToggle: (name: RepeatedFilter, value: string) => void;
  stacked?: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between", stacked && "gap-6 lg:flex-col lg:items-stretch")}>
      <FilterChipGroup
        active={query.statuses}
        label="Status"
        onToggle={(value) => onToggle("status", value)}
        options={REQUEST_STATUSES}
      />
      <FilterChipGroup
        active={query.priorities}
        label="Priority"
        onToggle={(value) => onToggle("priority", value)}
        options={REQUEST_PRIORITIES}
        tone="dark"
      />
    </div>
  );
}

function FilterChipGroup({
  label,
  options,
  active,
  onToggle,
  tone = "primary",
}: {
  label: string;
  options: readonly string[];
  active: readonly string[];
  onToggle: (value: string) => void;
  tone?: "primary" | "dark";
}) {
  return (
    <fieldset>
      <legend className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label === "Status" ? <SlidersHorizontal aria-hidden="true" className="size-3.5" /> : null}
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = active.includes(option);
          return (
            <button
              aria-pressed={selected}
              className={cn(
                "whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition-[color,background-color,border-color,transform] duration-200 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selected && tone === "primary" && "border-primary bg-primary text-primary-foreground",
                selected && tone === "dark" && "border-foreground bg-foreground text-background",
                !selected && "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              key={option}
              onClick={() => onToggle(option)}
              type="button"
            >
              {labels[option]}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function FilterCount({ count }: { count: number }) {
  return (
    <p className="text-xs font-medium text-muted-foreground">
      {count} active {count === 1 ? "filter" : "filters"}
    </p>
  );
}
