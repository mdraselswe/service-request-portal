export default function Loading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading service portal"
      className="grid min-h-screen place-items-center bg-background px-4"
    >
      <div className="w-full max-w-md space-y-4">
        <div className="h-4 w-28 animate-pulse rounded-full bg-muted" />
        <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
        <div className="h-24 w-full animate-pulse rounded-2xl bg-muted" />
      </div>
    </main>
  );
}
