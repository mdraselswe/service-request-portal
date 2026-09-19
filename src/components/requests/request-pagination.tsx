import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { requestListHref, type RequestListQuery } from "@/features/requests/request-query";
import { cn } from "@/lib/utils";

function pageWindow(current: number, total: number) {
  const start = Math.max(1, Math.min(current - 2, total - 4));
  const end = Math.min(total, Math.max(current + 2, 5));
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
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
          <Link className={buttonVariants({ size: "sm", variant: "outline" })} href={hrefFor(query.page - 1)}>
            <ChevronLeft aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Previous</span>
          </Link>
        ) : null}
        <div className="hidden items-center gap-1 sm:flex">
          {pageWindow(query.page, totalPages).map((page) => (
            <Link
              aria-current={page === query.page ? "page" : undefined}
              className={cn(
                buttonVariants({ size: "sm", variant: page === query.page ? "default" : "ghost" }),
                "min-w-9",
              )}
              href={hrefFor(page)}
              key={page}
            >
              {page}
            </Link>
          ))}
        </div>
        {query.page < totalPages ? (
          <Link className={buttonVariants({ size: "sm", variant: "outline" })} href={hrefFor(query.page + 1)}>
            <span className="sr-only sm:not-sr-only">Next</span>
            <ChevronRight aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
