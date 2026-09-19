"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-destructive">Something went wrong</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          We could not load the portal
        </h1>
        <p className="mt-3 text-muted-foreground">
          Please try again. If the problem continues, contact the service team.
        </p>
        <Button className="mt-6" onClick={reset}>
          Try again
        </Button>
      </div>
    </main>
  );
}
