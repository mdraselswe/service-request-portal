import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  LayoutDashboard,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const capabilities = [
  {
    icon: Search,
    title: "Find requests quickly",
    description: "Server-side search, filters, sorting and shareable URL state.",
  },
  {
    icon: ShieldCheck,
    title: "Protected by design",
    description: "Authenticated pages and API boundaries keep internal data private.",
  },
  {
    icon: Clock3,
    title: "Track every update",
    description: "Request history makes ownership and progress easy to understand.",
  },
] as const;

const previewRequests = [
  {
    id: "SR-10428",
    title: "Payroll portal access required",
    owner: "Nadia Rahman",
    status: "In progress",
    variant: "warning" as const,
  },
  {
    id: "SR-10427",
    title: "Update donor receipt template",
    owner: "Mahmud Hasan",
    status: "Resolved",
    variant: "success" as const,
  },
  {
    id: "SR-10426",
    title: "New staff email setup",
    owner: "Unassigned",
    status: "Open",
    variant: "default" as const,
  },
] as const;

export function FoundationHero() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top_left,oklch(0.93_0.06_175),transparent_45%),radial-gradient(circle_at_top_right,oklch(0.94_0.04_250),transparent_38%)]"
      />

      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <a
          href="#content"
          className="sr-only rounded-md bg-background px-3 py-2 text-sm font-semibold focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
        >
          Skip to content
        </a>
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <LayoutDashboard aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="text-sm font-bold leading-tight text-foreground">
              Service Portal
            </p>
            <p className="text-xs text-muted-foreground">As-Sunnah Foundation</p>
          </div>
        </div>
        <Badge variant="secondary" className="hidden sm:inline-flex">
          Foundation milestone
        </Badge>
      </header>

      <section
        id="content"
        className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-8 lg:pb-24 lg:pt-24"
      >
        <div className="max-w-2xl">
          <Badge className="mb-6 gap-1.5">
            <Sparkles aria-hidden="true" className="size-3.5" />
            Built for focused service operations
          </Badge>
          <h1 className="text-balance text-4xl font-bold tracking-[-0.035em] text-foreground sm:text-5xl lg:text-6xl">
            Every request, clear and accountable.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            A fast, accessible workspace for reviewing service requests,
            assigning ownership and keeping stakeholders informed from intake to
            resolution.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" disabled>
              Portal access arrives in Phase 3
              <ArrowRight aria-hidden="true" />
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#foundation">Explore the foundation</a>
            </Button>
          </div>
          <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
            <CheckCircle2
              aria-hidden="true"
              className="size-5 shrink-0 text-emerald-600"
            />
            <span>Responsive, typed and ready for protected workflows.</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl lg:mx-0">
          <div
            aria-hidden="true"
            className="absolute -inset-4 -z-10 rounded-[2rem] bg-primary/5 blur-2xl"
          />
          <Card className="overflow-hidden border-white/80 bg-card/95 shadow-2xl shadow-primary/10 backdrop-blur">
            <CardHeader className="border-b border-border p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">Request overview</CardTitle>
                  <CardDescription className="mt-1">
                    A preview of the upcoming operations dashboard
                  </CardDescription>
                </div>
                <Badge variant="success">Operational</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-3 divide-x divide-border border-b border-border bg-muted/40">
                {[
                  ["Open", "248"],
                  ["In progress", "96"],
                  ["Resolved today", "41"],
                ].map(([label, value]) => (
                  <div className="p-4 sm:p-5" key={label}>
                    <p className="text-xl font-bold tracking-tight sm:text-2xl">
                      {value}
                    </p>
                    <p className="mt-1 text-[0.68rem] font-medium leading-4 text-muted-foreground sm:text-xs">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="divide-y divide-border">
                {previewRequests.map((request) => (
                  <article
                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                    key={request.id}
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-primary">
                        {request.id}
                      </p>
                      <p className="mt-1 truncate text-sm font-semibold text-foreground">
                        {request.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {request.owner}
                      </p>
                    </div>
                    <Badge variant={request.variant}>{request.status}</Badge>
                  </article>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section
        id="foundation"
        aria-labelledby="foundation-title"
        className="border-t border-border bg-muted/35"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-primary">Foundation first</p>
            <h2
              id="foundation-title"
              className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl"
            >
              Designed for the full request lifecycle
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {capabilities.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="bg-background">
                <CardHeader>
                  <span className="mb-2 grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription className="leading-6">
                    {description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
