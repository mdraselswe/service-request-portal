import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { requestListHref, type RequestListQuery } from "@/features/requests/request-query";
import { cn } from "@/lib/utils";

type PaginationItem = number | "start-ellipsis" | "end-ellipsis";

function paginationItems(current: number, total: number): PaginationItem[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, "end-ellipsis", total];
  }
  if (current >= total - 3) {
    return [1, "start-ellipsis", total - 4, total - 3, total - 2, total - 1, total];
  }
  return [
    1,
    "start-ellipsis",
    current - 1,
    current,
    current + 1,
    "end-ellipsis",
    total,
  ];
}

export function RequestPagination({
  query,
  total,
}: {
  query: RequestListQuery;
  total: number;
}) {
  const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
  if (totalPages <= 1) return null;

  const hrefFor = (page: number) => requestListHref({ ...query, page });
  return (
    <nav aria-label="Request results pages" className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        Page <span className="font-semibold text-foreground">{query.page}</span> of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        {query.page > 1 ? (
          <Link
            aria-label="First page"
            className={buttonVariants({ size: "sm", variant: "outline" })}
            href={hrefFor(1)}
          >
            <ChevronsLeft aria-hidden="true" />
          </Link>
        ) : null}
        {query.page > 1 ? (
          <Link
            aria-label="Previous page"
            className={buttonVariants({ size: "sm", variant: "outline" })}
            href={hrefFor(query.page - 1)}
          >
            <ChevronLeft aria-hidden="true" />
          </Link>
        ) : null}
        <div className="hidden items-center gap-1 sm:flex">
          {paginationItems(query.page, totalPages).map((item) =>
            typeof item === "number" ? (
              <Link
                aria-current={item === query.page ? "page" : undefined}
                aria-label={
                  item === query.page
                    ? `Page ${item}, current page`
                    : `Go to page ${item}`
                }
                className={cn(
                  buttonVariants({
                    size: "sm",
                    variant: item === query.page ? "default" : "ghost",
                  }),
                  "min-w-9",
                )}
                href={hrefFor(item)}
                key={item}
              >
                {item}
              </Link>
            ) : (
              <span
                aria-hidden="true"
                className="grid size-9 place-items-center text-muted-foreground"
                key={item}
              >
                <MoreHorizontal className="size-4" />
              </span>
            ),
          )}
        </div>
        {query.page < totalPages ? (
          <Link
            aria-label="Next page"
            className={buttonVariants({ size: "sm", variant: "outline" })}
            href={hrefFor(query.page + 1)}
          >
            <ChevronRight aria-hidden="true" />
          </Link>
        ) : null}
        {query.page < totalPages ? (
          <Link
            aria-label="Last page"
            className={buttonVariants({ size: "sm", variant: "outline" })}
            href={hrefFor(totalPages)}
          >
            <ChevronsRight aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
