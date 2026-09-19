import { format } from "date-fns";
import { CheckCircle2, CircleDot, MessageSquareText, UserRoundCheck } from "lucide-react";

type Activity = {
  id: string;
  type: string;
  note: string | null;
  fromValue: string | null;
  toValue: string | null;
  createdAt: Date;
  actor: { id: string; name: string } | null;
  assignee: { id: string; name: string } | null;
};

function ActivityIcon({ type }: { type: string }) {
  const Icon =
    type === "RESOLVED"
      ? CheckCircle2
      : type === "ASSIGNED"
        ? UserRoundCheck
        : type === "COMMENT_ADDED"
          ? MessageSquareText
          : CircleDot;
  return <Icon aria-hidden="true" className="size-4" />;
}

function activityTitle(activity: Activity) {
  if (activity.type === "CREATED") return "Request created";
  if (activity.type === "ASSIGNED") return activity.assignee ? `Assigned to ${activity.assignee.name}` : "Request unassigned";
  if (activity.type === "RESOLVED") return "Request resolved";
  if (activity.type === "COMMENT_ADDED") return "Activity note added";
  if (activity.type === "STATUS_CHANGED") return "Status updated";
  return "Request updated";
}

export function RequestActivityTimeline({ activity }: { activity: Activity[] }) {
  return (
    <section aria-labelledby="activity-heading" className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="text-lg font-bold" id="activity-heading">Activity history</h2>
        <p className="mt-1 text-sm text-muted-foreground">A chronological record of ownership and workflow changes.</p>
      </div>
      <ol className="mt-6 space-y-0">
        {activity.map((item, index) => (
          <li className="relative grid grid-cols-[2.5rem_1fr] gap-3 pb-6 last:pb-0" key={item.id}>
            {index < activity.length - 1 ? (
              <span aria-hidden="true" className="absolute bottom-0 left-5 top-10 w-px bg-border" />
            ) : null}
            <span className="z-10 grid size-10 place-items-center rounded-xl border border-border bg-muted text-primary">
              <ActivityIcon type={item.type} />
            </span>
            <div className="pt-0.5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-sm font-semibold">{activityTitle(item)}</h3>
                <time className="text-xs text-muted-foreground" dateTime={item.createdAt.toISOString()}>
                  {format(item.createdAt, "MMM d, yyyy · h:mm a")}
                </time>
              </div>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {item.note ?? "Request information was updated."}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                By {item.actor?.name ?? "System"}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
