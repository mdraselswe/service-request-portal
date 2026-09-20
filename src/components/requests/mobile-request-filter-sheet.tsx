"use client";

import { useEffect, useRef, useState } from "react";
import { Filter, FilterX, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { FilterCount } from "./request-filter-controls";

export function MobileRequestFilterSheet({
  open,
  onOpenChange,
  filterCount,
  isPending,
  onClear,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filterCount: number;
  isPending: boolean;
  onClear: () => void;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  function closeSheet() {
    if (closing) return;
    setClosing(true);
    closeTimer.current = setTimeout(() => {
      dialogRef.current?.close();
      setClosing(false);
      onOpenChange(false);
    }, 180);
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden">
        <button
          aria-expanded={open}
          aria-haspopup="dialog"
          className="pointer-events-auto inline-flex h-12 min-w-36 items-center justify-center gap-2 rounded-full border border-primary/15 bg-foreground px-5 text-sm font-semibold text-background shadow-[0_16px_40px_-14px_rgba(15,23,42,0.6)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={() => onOpenChange(true)}
          type="button"
        >
          <Filter aria-hidden="true" className="size-4" />
          Filters
          {filterCount > 0 ? (
            <span className="grid size-5 place-items-center rounded-full bg-primary text-[0.68rem] font-bold text-primary-foreground">
              {filterCount}
            </span>
          ) : null}
        </button>
      </div>

      <dialog
        aria-labelledby="mobile-filters-title"
        className="mobile-filter-dialog md:hidden"
        data-closing={closing ? "true" : undefined}
        onCancel={(event) => {
          event.preventDefault();
          closeSheet();
        }}
        ref={dialogRef}
      >
        <button
          aria-label="Close filters"
          className="mobile-filter-backdrop"
          onClick={closeSheet}
          tabIndex={-1}
          type="button"
        />
        <section aria-busy={isPending} className="mobile-filter-panel">
          <div aria-hidden="true" className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-border" />
          <header className="flex items-start justify-between gap-4 border-b border-border px-5 pb-4 pt-3">
            <div>
              <h2 className="text-lg font-bold" id="mobile-filters-title">Filter requests</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Narrow the request list using one or more filters.
              </p>
              {filterCount > 0 ? (
                <div className="mt-2" aria-live="polite">
                  <FilterCount count={filterCount} />
                </div>
              ) : null}
            </div>
            <Button aria-label="Close filters" onClick={closeSheet} size="icon" type="button" variant="ghost">
              <X aria-hidden="true" />
            </Button>
          </header>

          <div className={cn("max-h-[min(60dvh,34rem)] overflow-y-auto px-5 py-5 transition-opacity", isPending && "opacity-65")}>
            {children}
          </div>

          <footer className="flex items-center justify-between gap-4 border-t border-border bg-background px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
            {filterCount > 0 ? (
              <Button onClick={onClear} type="button" variant="ghost">
                <FilterX aria-hidden="true" />
                Clear
              </Button>
            ) : (
              <span className="text-sm text-muted-foreground">No filters applied</span>
            )}
            <Button onClick={closeSheet} type="button">
              View results
            </Button>
          </footer>
        </section>
      </dialog>
    </>
  );
}
