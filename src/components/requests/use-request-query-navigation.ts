"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type QueryUpdater = (params: URLSearchParams) => void;

export function useRequestQueryNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function replaceQuery(update: QueryUpdater) {
    const params = new URLSearchParams(searchParams.toString());
    update(params);
    params.delete("page");

    const query = params.toString();
    const target = query ? `${pathname}?${query}` : pathname;
    startTransition(() => router.replace(target, { scroll: false }));
  }

  function clearQuery() {
    startTransition(() => router.replace(pathname, { scroll: false }));
  }

  return { clearQuery, isPending, replaceQuery };
}
