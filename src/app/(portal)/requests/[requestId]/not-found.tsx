import Link from "next/link";
import { FileQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function RequestNotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-4 text-center">
      <div className="max-w-md">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
          <FileQuestion aria-hidden="true" className="size-6" />
        </span>
        <h1 className="mt-4 text-2xl font-bold">Request not found</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          The request may have been removed, or the address may be incorrect.
        </p>
        <Button asChild className="mt-5">
          <Link href="/requests">Return to requests</Link>
        </Button>
      </div>
    </div>
  );
}
