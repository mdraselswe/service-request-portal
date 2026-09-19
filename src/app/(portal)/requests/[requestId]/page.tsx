import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, CalendarDays, Folder, Mail, UserRound } from "lucide-react";

import { RequestActivityTimeline } from "@/components/requests/request-activity-timeline";
import { RequestStatusBadge } from "@/components/requests/request-status-badge";
import { RequestUpdatePanel } from "@/components/requests/request-update-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RequestStatus } from "@/features/requests/constants";
import {
  getAssignableUsers,
  getRequestDetail,
} from "@/features/requests/request-detail-repository";
import { isRequestStatus } from "@/features/requests/request-transitions";

export const metadata: Metadata = { title: "Request details" };

type RequestDetailsPageProps = {
  params: Promise<{ requestId: string }>;
};

export default async function RequestDetailsPage({ params }: RequestDetailsPageProps) {
  const { requestId } = await params;
  const [request, assignees] = await Promise.all([
    getRequestDetail(requestId),
    getAssignableUsers(),
  ]);
  if (!request || !isRequestStatus(request.status)) notFound();

  const priorityVariant =
    request.priority === "URGENT" || request.priority === "HIGH"
      ? "warning"
      : "secondary";

  return (
    <div className="mx-auto max-w-7xl">
      <Link className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground" href="/requests">
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to requests
      </Link>

      <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-primary">{request.requestNumber}</p>
            <RequestStatusBadge status={request.status} />
            <Badge variant={priorityVariant}>{request.priority.toLowerCase()} priority</Badge>
          </div>
          <h1 className="mt-3 text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            {request.subject}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Created {format(request.createdAt, "MMMM d, yyyy 'at' h:mm a")} · Last updated{" "}
            {format(request.updatedAt, "MMMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <Card className="bg-background">
            <CardHeader className="border-b border-border">
              <CardTitle>Request information</CardTitle>
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
              <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
                {request.description}
              </p>
              <dl className="mt-6 grid gap-5 border-t border-border pt-6 sm:grid-cols-2">
                <div className="flex gap-3">
                  <UserRound aria-hidden="true" className="mt-0.5 size-4.5 text-muted-foreground" />
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Requester</dt>
                    <dd className="mt-1 text-sm font-semibold">{request.requester.name}</dd>
                    <dd className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><Mail aria-hidden="true" className="size-3" />{request.requester.email}</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Folder aria-hidden="true" className="mt-0.5 size-4.5 text-muted-foreground" />
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</dt>
                    <dd className="mt-1 text-sm font-semibold">{request.category.name}</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <UserRound aria-hidden="true" className="mt-0.5 size-4.5 text-muted-foreground" />
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current assignee</dt>
                    <dd className="mt-1 text-sm font-semibold">{request.assignee?.name ?? "Unassigned"}</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CalendarDays aria-hidden="true" className="mt-0.5 size-4.5 text-muted-foreground" />
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resolution</dt>
                    <dd className="mt-1 text-sm font-semibold">
                      {request.resolvedAt ? format(request.resolvedAt, "MMMM d, yyyy") : "Not resolved"}
                    </dd>
                  </div>
                </div>
              </dl>
            </CardContent>
          </Card>

          <RequestActivityTimeline activity={request.activity} />
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <RequestUpdatePanel
            assignees={assignees}
            initial={{
              status: request.status as RequestStatus,
              version: request.version,
              assignee: request.assignee
                ? { id: request.assignee.id, name: request.assignee.name }
                : null,
            }}
            key={`${request.id}:${request.version}`}
            requestNumber={request.requestNumber}
          />
        </div>
      </div>
    </div>
  );
}
