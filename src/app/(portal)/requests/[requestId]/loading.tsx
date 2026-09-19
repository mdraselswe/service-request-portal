export default function RequestDetailsLoading() {
  return (
    <div aria-busy="true" aria-label="Loading request details" className="mx-auto max-w-7xl">
      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      <div className="mt-6 h-10 w-3/4 animate-pulse rounded-lg bg-muted" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="h-[36rem] animate-pulse rounded-2xl border border-border bg-background" />
        <div className="h-72 animate-pulse rounded-2xl border border-border bg-background" />
      </div>
    </div>
  );
}
