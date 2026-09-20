import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, Inbox } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RequestListItem } from "@/features/requests/request-repository";

import { RequestStatusBadge } from "./request-status-badge";

function formatUpdatedAt(value: Date) {
  return format(value, "MMM d, yyyy · h:mm a");
}

function priorityVariant(priority: string) {
  if (priority === "URGENT" || priority === "HIGH") return "warning" as const;
  return "secondary" as const;
}

export function RequestResults({
  items,
  filtered,
}: {
  items: RequestListItem[];
  filtered: boolean;
}) {
  if (!items.length) {
    return (
      <div className="ui-enter grid min-h-80 place-items-center overflow-hidden rounded-2xl border border-dashed border-border bg-background/95 px-5 text-center">
        <div className="max-w-md py-12">
          <span className="relative mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary before:absolute before:-inset-3 before:rounded-[1.25rem] before:border before:border-primary/10">
            <Inbox aria-hidden="true" className="size-7" />
          </span>
          <h2 className="mt-4 text-lg font-bold">
            {filtered ? "No requests match these filters" : "No requests yet"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {filtered
              ? "Try removing a filter or using a broader search term."
              : "New service requests will appear here when they are submitted."}
          </p>
          {filtered ? (
            <Button asChild className="mt-5" variant="outline">
              <Link href="/requests">Clear all filters</Link>
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-clip rounded-2xl border border-border bg-background/95 shadow-sm">
      <div className="divide-y divide-border lg:hidden">
        {items.map((request) => (
          <article className="group p-4 transition-colors duration-200 hover:bg-muted/35" data-priority={request.priority} key={request.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  className="text-xs font-bold text-primary hover:underline"
                  href={`/requests/${request.requestNumber}`}
                >
                  {request.requestNumber}
                </Link>
                <h2 className="mt-1 line-clamp-2 text-sm font-semibold leading-5">
                  {request.subject}
                </h2>
              </div>
              <RequestStatusBadge status={request.status} />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
              <div>
                <dt className="text-muted-foreground">Requester</dt>
                <dd className="mt-0.5 truncate font-medium">{request.requester.name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Assignee</dt>
                <dd className="mt-0.5 truncate font-medium">
                  {request.assignee?.name ?? "Unassigned"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Category</dt>
                <dd className="mt-0.5 font-medium">{request.category.name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Priority</dt>
                <dd className="mt-0.5">
                  <Badge variant={priorityVariant(request.priority)}>
                    {request.priority.toLowerCase()}
                  </Badge>
                </dd>
              </div>
            </dl>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <p className="text-xs text-muted-foreground">
                Updated {formatUpdatedAt(request.updatedAt)}
              </p>
              <Link
                aria-label={`Open ${request.requestNumber}`}
                className="grid size-8 place-items-center rounded-full bg-primary/10 text-primary transition-[background-color,transform] duration-200 group-hover:translate-x-0.5 group-hover:bg-primary group-hover:text-primary-foreground"
                href={`/requests/${request.requestNumber}`}
              >
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto lg:block xl:overflow-visible">
        <table className="w-full min-w-[68rem] border-collapse text-left text-sm">
          <caption className="sr-only">Service requests matching the current query</caption>
          <thead className="border-b border-border bg-muted/95 text-xs uppercase tracking-wider text-muted-foreground backdrop-blur-xl xl:sticky xl:top-18 xl:z-10 xl:shadow-[0_8px_18px_-16px_rgba(15,23,42,0.55)]">
            <tr>
              <th className="px-5 py-3.5 font-semibold" scope="col">Request</th>
              <th className="px-4 py-3.5 font-semibold" scope="col">Requester</th>
              <th className="px-4 py-3.5 font-semibold" scope="col">Category</th>
              <th className="px-4 py-3.5 font-semibold" scope="col">Priority</th>
              <th className="px-4 py-3.5 font-semibold" scope="col">Status</th>
              <th className="px-4 py-3.5 font-semibold" scope="col">Assignee</th>
              <th className="px-5 py-3.5 text-right font-semibold" scope="col">Last updated</th>
              <th className="px-5 py-3.5 text-right font-semibold" scope="col">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((request) => (
              <tr
                className="transition-[background-color,box-shadow] duration-200 hover:bg-muted/35 hover:shadow-[inset_3px_0_0_var(--primary)]"
                data-priority={request.priority}
                key={request.id}
              >
                <td className="max-w-sm px-5 py-4 align-top">
                  <Link className="font-bold text-primary hover:underline" href={`/requests/${request.requestNumber}`}>
                    {request.requestNumber}
                  </Link>
                  <p className="mt-1 truncate font-semibold text-foreground">{request.subject}</p>
                </td>
                <td className="px-4 py-4 align-top">
                  <p className="font-medium">{request.requester.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{request.requester.email}</p>
                </td>
                <td className="px-4 py-4 align-top text-muted-foreground">{request.category.name}</td>
                <td className="px-4 py-4 align-top">
                  <Badge variant={priorityVariant(request.priority)}>{request.priority.toLowerCase()}</Badge>
                </td>
                <td className="px-4 py-4 align-top"><RequestStatusBadge status={request.status} /></td>
                <td className="px-4 py-4 align-top text-muted-foreground">{request.assignee?.name ?? "Unassigned"}</td>
                <td className="whitespace-nowrap px-5 py-4 text-right align-top text-xs text-muted-foreground">
                  {formatUpdatedAt(request.updatedAt)}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-right align-top">
                  <Button asChild size="sm" variant="outline">
                    <Link
                      aria-label={`View details for ${request.requestNumber}`}
                      href={`/requests/${request.requestNumber}`}
                    >
                      View details
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
