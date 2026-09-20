import { Skeleton } from "@/components/ui/skeleton";

export default function RequestDetailsLoading() {
  return (
    <div aria-busy="true" aria-label="Loading request details" className="mx-auto max-w-7xl">
      <Skeleton className="h-5 w-36" />
      <div className="mt-6 space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-28 rounded-full" />
        </div>
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-background shadow-sm">
            <div className="border-b border-border p-5">
              <Skeleton className="h-5 w-44" />
            </div>
            <div className="space-y-3 p-5 sm:p-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <div className="mt-6 grid gap-5 border-t border-border pt-6 sm:grid-cols-2">
                {Array.from({ length: 4 }, (_, index) => (
                  <Skeleton className="h-14" key={index} />
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
            <Skeleton className="h-5 w-36" />
            <div className="mt-6 space-y-5">
              {Array.from({ length: 4 }, (_, index) => (
                <div className="flex gap-3" key={index}>
                  <Skeleton className="size-9 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48 max-w-full" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-background p-5 shadow-sm lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
          <div className="mt-6 space-y-5">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-11 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-11 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
