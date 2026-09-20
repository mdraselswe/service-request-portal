import { Skeleton } from "@/components/ui/skeleton";

export default function RequestsListLoading() {
  return (
    <div aria-busy="true" aria-label="Loading service requests" className="mx-auto w-full max-w-[96rem] pb-20 md:pb-0" role="status">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-5 w-[32rem] max-w-full" />
        </div>
        <Skeleton className="h-16 w-full rounded-xl sm:w-48" />
      </div>

      <div className="mt-7 rounded-2xl border border-border bg-background p-3 shadow-md md:hidden">
        <Skeleton className="h-11 w-full" />
      </div>

      <div className="mt-7 hidden rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-5 md:block">
        <div className="flex flex-col gap-3 xl:flex-row">
          <Skeleton className="h-11 flex-1" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Skeleton className="h-11 sm:w-44" />
            <Skeleton className="h-11 sm:w-44" />
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 lg:flex-row lg:justify-between">
          {[5, 4].map((count, group) => (
            <div key={group}>
              <Skeleton className="mb-2 h-3 w-16" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: count }, (_, index) => (
                  <Skeleton className="h-8 w-20 rounded-full" key={index} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <Skeleton className="h-4 w-52" />
        <Skeleton className="h-9 w-56" />
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        <div className="divide-y divide-border lg:hidden">
          {Array.from({ length: 4 }, (_, index) => (
            <div className="space-y-4 p-4" key={index}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-full" />
                </div>
                <Skeleton className="h-7 w-24 rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }, (_, cell) => (
                  <Skeleton className="h-10" key={cell} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="hidden lg:block">
          <div className="grid grid-cols-8 gap-4 border-b border-border bg-muted/45 px-5 py-4">
            {Array.from({ length: 8 }, (_, index) => (
              <Skeleton className="h-3" key={index} />
            ))}
          </div>
          {Array.from({ length: 6 }, (_, row) => (
            <div className="grid grid-cols-8 gap-4 border-b border-border px-5 py-5 last:border-0" key={row}>
              {Array.from({ length: 8 }, (_, cell) => (
                <Skeleton className="h-5" key={cell} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
