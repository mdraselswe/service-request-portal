import type * as React from "react";

import { cn } from "@/lib/utils";

export function BrandMark({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      aria-hidden="true"
      className={cn("size-5", className)}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
        width="6"
        x="3"
        y="3"
      />
      <rect
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
        width="6"
        x="15"
        y="3"
      />
      <rect
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
        width="6"
        x="3"
        y="15"
      />
      <path
        d="m15.5 18 1.75 1.75L21 16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
