"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Inbox, LayoutDashboard, Users } from "lucide-react";

const navigation = [
  { href: "/", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/requests", label: "Requests", icon: Inbox, exact: false },
  { href: "/analytics", label: "Analytics", icon: BarChart3, exact: false },
  { href: "/team", label: "Team", icon: Users, exact: false },
] as const;

export function PortalNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation" className="space-y-1">
      {navigation.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "flex h-10 items-center gap-3 rounded-lg bg-primary/10 px-3 text-sm font-semibold text-primary"
                : "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            }
            href={href}
            key={href}
          >
            <Icon aria-hidden="true" className="size-4.5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
