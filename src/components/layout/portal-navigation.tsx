"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, LayoutDashboard } from "lucide-react";

const navigation = [
  { href: "/", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/requests", label: "Requests", icon: Inbox, exact: false },
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
                ? "relative flex h-10 items-center gap-3 rounded-lg bg-primary/10 px-3 text-sm font-semibold text-primary shadow-[inset_3px_0_0_var(--primary)]"
                : "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-[color,background-color,transform] duration-200 hover:translate-x-0.5 hover:bg-muted hover:text-foreground"
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
