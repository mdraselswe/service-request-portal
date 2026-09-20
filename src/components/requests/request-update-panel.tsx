"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, LoaderCircle, UserRoundCog } from "lucide-react";

import { Label } from "@/components/ui/label";
import type { RequestStatus } from "@/features/requests/constants";
import type { RequestMutationResponse } from "@/features/requests/request-contracts";
import { selectableStatuses } from "@/features/requests/request-transitions";

type Assignee = { id: string; name: string; email: string };
type OptimisticRequest = {
  status: RequestStatus;
  version: number;
  assignee: { id: string; name: string } | null;
};

const statusLabels: Record<RequestStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  WAITING: "Waiting",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export function RequestUpdatePanel({
  requestNumber,
  initial,
  assignees,
}: {
  requestNumber: string;
  initial: OptimisticRequest;
  assignees: Assignee[];
}) {
  const router = useRouter();
  const [request, setRequest] = useState(initial);
  const [pending, setPending] = useState<"status" | "assignee" | null>(null);
  const [feedback, setFeedback] = useState<
    { kind: "success" | "error"; message: string } | undefined
  >();

  async function mutate(
    field: "status" | "assignee",
    update: { status?: RequestStatus; assigneeId?: string | null },
    optimistic: OptimisticRequest,
  ) {
    if (pending) return;
    const snapshot = request;
    setRequest(optimistic);
    setPending(field);
    setFeedback(undefined);

    try {
      const response = await fetch(`/api/requests/${requestNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mutationId: crypto.randomUUID(),
          version: snapshot.version,
          ...update,
        }),
      });
      const payload = (await response.json()) as RequestMutationResponse;
      if (!response.ok || !payload.ok) {
        throw new Error(payload.ok ? "The update failed." : payload.error.message);
      }

      setRequest({
        status: payload.data.request.status,
        version: payload.data.request.version,
        assignee: payload.data.request.assignee,
      });
      setFeedback({ kind: "success", message: "Request updated successfully." });
      router.refresh();
    } catch (error) {
      setRequest(snapshot);
      setFeedback({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "The update failed. Your previous value was restored.",
      });
    } finally {
      setPending(null);
    }
  }

  return (
    <section
      aria-labelledby="update-heading"
      className="rounded-2xl border border-border bg-background p-5 shadow-sm"
      data-request-version={request.version}
    >
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <UserRoundCog aria-hidden="true" className="size-5" />
        </span>
        <div>
          <h2 className="font-bold" id="update-heading">Manage request</h2>
          <p className="text-xs text-muted-foreground">Changes are recorded in activity history.</p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="request-status">Status</Label>
          <div className="relative">
            <select
              id="request-status"
              className="select-control h-11 w-full rounded-lg border border-input bg-background pl-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring/25 disabled:opacity-60"
              data-loading={pending === "status"}
              disabled={pending !== null}
              onChange={(event) => {
                const status = event.target.value as RequestStatus;
                if (status === request.status) return;
                void mutate("status", { status }, { ...request, status });
              }}
              value={request.status}
            >
              {selectableStatuses(request.status).map((status) => (
                <option key={status} value={status}>{statusLabels[status]}</option>
              ))}
            </select>
            {pending === "status" ? (
              <LoaderCircle aria-hidden="true" className="absolute right-3 top-3.5 size-4 animate-spin text-primary" />
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="request-assignee">Assignee</Label>
          <div className="relative">
            <select
              id="request-assignee"
              className="select-control h-11 w-full rounded-lg border border-input bg-background pl-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring/25 disabled:opacity-60"
              data-loading={pending === "assignee"}
              disabled={pending !== null}
              onChange={(event) => {
                const assigneeId = event.target.value || null;
                if (assigneeId === request.assignee?.id || (!assigneeId && !request.assignee)) return;
                const assignee = assignees.find((item) => item.id === assigneeId) ?? null;
                void mutate("assignee", { assigneeId }, { ...request, assignee });
              }}
              value={request.assignee?.id ?? ""}
            >
              <option value="">Unassigned</option>
              {assignees.map((assignee) => (
                <option key={assignee.id} value={assignee.id}>
                  {assignee.name}
                </option>
              ))}
            </select>
            {pending === "assignee" ? (
              <LoaderCircle aria-hidden="true" className="absolute right-3 top-3.5 size-4 animate-spin text-primary" />
            ) : null}
          </div>
        </div>
      </div>

      <div aria-live="polite" className="mt-4 min-h-5 text-sm">
        {feedback ? (
          <p className={feedback.kind === "success" ? "flex items-center gap-2 text-emerald-700" : "text-destructive"}>
            {feedback.kind === "success" ? <CheckCircle2 aria-hidden="true" className="size-4" /> : null}
            {feedback.message}
          </p>
        ) : pending ? (
          <p className="text-muted-foreground">Saving change...</p>
        ) : null}
      </div>
    </section>
  );
}
