import { Badge } from "@/components/ui/badge";

const statusLabels: Record<string, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  WAITING: "Waiting",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export function RequestStatusBadge({ status }: { status: string }) {
  const variant =
    status === "RESOLVED" || status === "CLOSED"
      ? "success"
      : status === "WAITING"
        ? "warning"
        : "default";
  return <Badge variant={variant}>{statusLabels[status] ?? status}</Badge>;
}
