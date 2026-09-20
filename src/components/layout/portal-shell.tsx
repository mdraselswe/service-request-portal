import {
  ChevronDown,
  LogOut,
  Menu,
} from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/features/auth/actions";
import type { AuthenticatedUser } from "@/features/auth/session";

import { PortalNavigation } from "./portal-navigation";

export function PortalShell({
  user,
  children,
}: {
  user: AuthenticatedUser;
  children: React.ReactNode;
}) {
  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="portal-canvas min-h-screen">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-background px-3 py-2 text-sm font-semibold focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border/80 bg-background/95 shadow-[8px_0_30px_-28px_rgba(15,23,42,0.45)] backdrop-blur lg:flex lg:flex-col">
        <div className="flex h-18 items-center gap-3 border-b border-border px-5">
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <BrandMark />
          </span>
          <div>
            <p className="text-sm font-bold leading-tight">Service Portal</p>
            <p className="text-xs text-muted-foreground">Operations workspace</p>
          </div>
        </div>
        <div className="flex-1 px-3 py-5">
          <p className="mb-2 px-3 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Workspace
          </p>
          <PortalNavigation />
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-18 items-center justify-between border-b border-border/80 bg-background/90 px-4 shadow-[0_8px_24px_-24px_rgba(15,23,42,0.65)] backdrop-blur-xl sm:px-6 lg:px-8">
          <details className="group relative lg:hidden">
            <summary className="grid size-10 cursor-pointer list-none place-items-center rounded-lg border border-border bg-background text-foreground shadow-sm [&::-webkit-details-marker]:hidden">
              <Menu aria-hidden="true" className="size-5" />
              <span className="sr-only">Open navigation</span>
            </summary>
            <div className="menu-surface absolute left-0 top-12 w-64 rounded-xl border border-border bg-background/98 p-3 shadow-2xl shadow-foreground/10 backdrop-blur-xl">
              <PortalNavigation />
            </div>
          </details>

          <div className="hidden lg:block">
            <p className="text-sm font-semibold">Service operations</p>
            <p className="text-xs text-muted-foreground">As-Sunnah Foundation</p>
          </div>

          <details className="group relative ml-auto">
            <summary aria-label="Open account menu" className="flex cursor-pointer list-none items-center gap-3 rounded-lg p-1.5 pr-2 outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
              <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                {initials}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block max-w-40 truncate text-sm font-semibold leading-tight">
                  {user.name}
                </span>
                <span className="block text-xs capitalize text-muted-foreground">
                  {user.role.toLowerCase()}
                </span>
              </span>
              <ChevronDown aria-hidden="true" className="menu-chevron hidden size-4 text-muted-foreground sm:block" />
            </summary>
            <div className="menu-surface absolute right-0 top-12 w-64 origin-top-right rounded-xl border border-border bg-background/98 p-2 shadow-2xl shadow-foreground/10 backdrop-blur-xl">
              <div className="border-b border-border px-3 py-2.5">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
              <form action={logoutAction} className="mt-1">
                <Button className="w-full justify-start" type="submit" variant="ghost">
                  <LogOut aria-hidden="true" />
                  Sign out
                </Button>
              </form>
            </div>
          </details>
        </header>

        <main id="main-content" className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
