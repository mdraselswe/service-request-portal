export default function RequestsLoading() {
  return (
    <div aria-busy="true" aria-label="Loading service requests" className="mx-auto max-w-[96rem]">
      <div className="h-8 w-56 animate-pulse rounded-lg bg-muted" />
      <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-muted" />
      <div className="mt-7 h-48 animate-pulse rounded-2xl border border-border bg-background" />
      <div className="mt-5 h-[32rem] animate-pulse rounded-2xl border border-border bg-background" />
    </div>
  );
}
