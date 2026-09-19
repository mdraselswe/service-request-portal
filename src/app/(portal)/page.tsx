import type { Metadata } from "next";
import { ArrowUpRight, CheckCircle2, Clock3, Inbox, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Overview",
};

export default async function OverviewPage() {
  const [open, inProgress, resolved, activeAgents, recentRequests] =
    await Promise.all([
      db.serviceRequest.count({ where: { status: "OPEN" } }),
      db.serviceRequest.count({ where: { status: "IN_PROGRESS" } }),
      db.serviceRequest.count({ where: { status: "RESOLVED" } }),
      db.user.count({ where: { role: "AGENT", isActive: true } }),
      db.serviceRequest.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          requestNumber: true,
          subject: true,
          status: true,
          priority: true,
          updatedAt: true,
          requester: { select: { name: true } },
          assignee: { select: { name: true } },
        },
      }),
    ]);

  const stats = [
    { label: "Open requests", value: open, detail: "Awaiting action", icon: Inbox },
    { label: "In progress", value: inProgress, detail: "Currently owned", icon: Clock3 },
    { label: "Resolved", value: resolved, detail: "Completed requests", icon: CheckCircle2 },
    { label: "Active agents", value: activeAgents, detail: "Available team members", icon: Users },
  ] as const;

  return (
    <div className="mx-auto max-w-7xl">
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
          <Card key={label} className="bg-background">
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

      <Card className="mt-6 overflow-hidden bg-background">
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
              <article className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:p-5" key={request.id}>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-bold text-primary">{request.requestNumber}</p>
                    <Badge variant={request.priority === "URGENT" ? "warning" : "secondary"}>
                      {request.priority.toLowerCase()}
                    </Badge>
                  </div>
                  <h2 className="mt-1 truncate text-sm font-semibold">{request.subject}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Requested by {request.requester.name} · {request.assignee?.name ?? "Unassigned"}
                  </p>
                </div>
                <Badge variant={request.status === "RESOLVED" ? "success" : "default"}>
                  {request.status.toLowerCase().replaceAll("_", " ")}
                </Badge>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
