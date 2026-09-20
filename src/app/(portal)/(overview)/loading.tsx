import { Skeleton } from "@/components/ui/skeleton";

export default function OverviewRouteLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading overview"
      className="mx-auto w-full max-w-[96rem]"
      role="status"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-9 w-80 max-w-full" />
          <Skeleton className="h-5 w-96 max-w-full" />
        </div>
        <Skeleton className="h-8 w-32 rounded-full" />
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div className="rounded-2xl border border-border bg-background p-5 shadow-sm" key={index}>
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="size-10 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        <div className="border-b border-border p-5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-2 h-4 w-56 max-w-full" />
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 4 }, (_, index) => (
            <div className="flex items-center justify-between gap-6 p-5" key={index}>
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-4 w-full max-w-sm" />
                <Skeleton className="h-3 w-48 max-w-full" />
              </div>
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
