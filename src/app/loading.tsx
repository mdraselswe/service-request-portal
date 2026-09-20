import { BrandMark } from "@/components/brand-mark";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading service portal"
      className="grid min-h-screen bg-background lg:grid-cols-[1.05fr_0.95fr]"
    >
      <section className="relative hidden overflow-hidden bg-foreground p-10 lg:block xl:p-14">
        <div className="flex items-center gap-3 text-white">
          <span className="grid size-11 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15">
            <BrandMark />
          </span>
          <div className="space-y-2">
            <Skeleton className="h-4 w-44 bg-white/15" />
            <Skeleton className="h-3 w-28 bg-white/10" />
          </div>
        </div>
        <div className="mt-36 max-w-xl space-y-5">
          <Skeleton className="h-6 w-48 rounded-full bg-white/10" />
          <Skeleton className="h-12 w-full bg-white/15" />
          <Skeleton className="h-12 w-4/5 bg-white/15" />
          <Skeleton className="h-5 w-full bg-white/10" />
          <Skeleton className="h-5 w-3/4 bg-white/10" />
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <BrandMark />
            </span>
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="size-11 rounded-xl" />
          <Skeleton className="mt-6 h-9 w-52" />
          <Skeleton className="mt-3 h-5 w-72 max-w-full" />
          <div className="mt-8 space-y-5">
            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-11 w-full" /></div>
            <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-11 w-full" /></div>
            <Skeleton className="h-11 w-full" />
          </div>
          <Skeleton className="mt-6 h-20 w-full rounded-xl" />
        </div>
      </section>
    </main>
  );
}
