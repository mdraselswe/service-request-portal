import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Clock3, Inbox, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOverviewData } from "@/features/requests/overview-repository";

export const metadata: Metadata = {
  title: "Overview",
};

export default async function OverviewPage() {
  const { counts, recentRequests } = await getOverviewData();

  const stats = [
    { label: "Open requests", value: counts.open, detail: "Awaiting action", icon: Inbox },
    { label: "In progress", value: counts.inProgress, detail: "Currently owned", icon: Clock3 },
    { label: "Resolved", value: counts.resolved, detail: "Completed requests", icon: CheckCircle2 },
    { label: "Active agents", value: counts.activeAgents, detail: "Available team members", icon: Users },
  ] as const;

  return (
    <div className="ui-enter mx-auto max-w-[96rem]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Operations overview</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Service request workspace
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Monitor workload, ownership, and recently updated requests.
          </p>
        </div>
        <Badge variant="success" className="gap-1.5 self-start sm:self-auto">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-600" />
          Data connected
        </Badge>
      </div>

      <section aria-label="Request metrics" className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, detail, icon: Icon }) => (
          <Card key={label} className="ui-card-lift bg-background/95">
            <CardContent className="flex items-start justify-between p-5">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <p className="mt-2 text-3xl font-bold tracking-tight">{value.toLocaleString()}</p>
                <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
              </div>
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon aria-hidden="true" className="size-5" />
              </span>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="mt-6 overflow-hidden bg-background/95">
        <CardHeader className="flex-row items-center justify-between border-b border-border">
          <div>
            <CardTitle>Recently updated</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Latest activity across the portal</p>
          </div>
          <ArrowUpRight aria-hidden="true" className="size-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {recentRequests.map((request) => (
              <article className="group grid gap-3 p-4 transition-colors duration-200 hover:bg-muted/35 sm:grid-cols-[1fr_auto] sm:items-center sm:p-5" key={request.id}>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-bold text-primary">{request.requestNumber}</p>
                    <Badge variant={request.priority === "URGENT" ? "warning" : "secondary"}>
                      {request.priority.toLowerCase()}
                    </Badge>
                  </div>
                  <h2 className="mt-1 truncate text-sm font-semibold">
                    <Link
                      className="transition-colors group-hover:text-primary"
                      href={`/requests/${request.requestNumber}`}
                    >
                      {request.subject}
                    </Link>
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Requested by {request.requester.name} · {request.assignee?.name ?? "Unassigned"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={request.status === "RESOLVED" ? "success" : "default"}>
                    {request.status.toLowerCase().replaceAll("_", " ")}
                  </Badge>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                  />
                </div>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
