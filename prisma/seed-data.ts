import type {
  ActivityType,
  RequestPriority,
  RequestStatus,
  UserRole,
} from "../src/features/requests/constants";

export const DEFAULT_SEEDED_REQUEST_COUNT = 10_050;
export const TEST_PASSWORD = "Portal@123";

type SeedUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
};

type SeedCategory = {
  id: string;
  name: string;
  slug: string;
  color: string;
};

export type SeedRequest = {
  id: string;
  requestNumber: string;
  subject: string;
  description: string;
  priority: RequestPriority;
  status: RequestStatus;
  requesterId: string;
  assigneeId: string | null;
  categoryId: string;
  resolvedAt: Date | null;
  version: number;
  createdAt: Date;
  updatedAt: Date;
};

export type SeedActivity = {
  id: string;
  requestId: string;
  type: ActivityType;
  actorId: string | null;
  assigneeId: string | null;
  fromValue: string | null;
  toValue: string | null;
  note: string | null;
  metadataJson: string | null;
  createdAt: Date;
};

const AGENT_NAMES = [
  "Amina Rahman",
  "Fahim Ahmed",
  "Nadia Islam",
  "Mahmud Hasan",
  "Tasnim Chowdhury",
  "Imran Hossain",
  "Sumaiya Akter",
  "Sakib Khan",
  "Farzana Karim",
  "Rafiul Alam",
  "Maliha Sultana",
  "Adnan Kabir",
] as const;

const REQUESTER_NAMES = [
  "Abdullah Al Mamun",
  "Afsana Jahan",
  "Arif Mahmud",
  "Bushra Tasnim",
  "Delwar Hossain",
  "Elma Siddiqua",
  "Fardin Islam",
  "Habiba Rahman",
  "Ibrahim Khalil",
  "Jannatul Ferdous",
  "Kamal Uddin",
  "Labiba Noor",
  "Masud Rana",
  "Nabila Ahmed",
  "Omar Faruk",
  "Papia Sultana",
  "Qazi Mahmud",
  "Raisa Karim",
  "Saiful Islam",
  "Tania Akter",
  "Umar Hasan",
  "Warda Jahan",
  "Yasir Arafat",
  "Zarin Tasnim",
  "Ashraf Ali",
  "Meher Nigar",
  "Nayeem Hossain",
  "Rumana Islam",
  "Shakil Ahmed",
  "Tahmina Rahman",
] as const;

export const SEED_USERS: readonly SeedUser[] = [
  {
    id: "usr_admin_001",
    name: "Portal Administrator",
    email: "admin@assunnah.org",
    role: "ADMIN",
    isActive: true,
  },
  ...AGENT_NAMES.map((name, index) => ({
    id: `usr_agent_${String(index + 1).padStart(3, "0")}`,
    name,
    email: `${name.toLowerCase().replaceAll(" ", ".")}@assunnah.org`,
    role: "AGENT" as const,
    isActive: true,
  })),
  ...REQUESTER_NAMES.map((name, index) => ({
    id: `usr_requester_${String(index + 1).padStart(3, "0")}`,
    name,
    email: `requester${String(index + 1).padStart(2, "0")}@example.org`,
    role: "REQUESTER" as const,
    isActive: false,
  })),
];

export const SEED_CATEGORIES: readonly SeedCategory[] = [
  { id: "cat_it", name: "IT Support", slug: "it-support", color: "blue" },
  { id: "cat_hr", name: "Human Resources", slug: "human-resources", color: "violet" },
  { id: "cat_finance", name: "Finance", slug: "finance", color: "emerald" },
  { id: "cat_facilities", name: "Facilities", slug: "facilities", color: "amber" },
  { id: "cat_programs", name: "Programs", slug: "programs", color: "cyan" },
  { id: "cat_procurement", name: "Procurement", slug: "procurement", color: "orange" },
  { id: "cat_comms", name: "Communications", slug: "communications", color: "rose" },
  { id: "cat_general", name: "General Support", slug: "general-support", color: "slate" },
];

const SUBJECTS: Record<string, readonly string[]> = {
  cat_it: [
    "Unable to access the payroll portal",
    "New staff email account setup",
    "Laptop performance has degraded",
    "Printer connection is unavailable",
    "Multi-factor authentication reset",
    "Shared drive permission request",
    "Video meeting audio issue",
    "Software installation approval",
  ],
  cat_hr: [
    "Update employee emergency contact",
    "Request for employment certificate",
    "Leave balance requires review",
    "New joiner onboarding support",
    "Benefits enrollment clarification",
    "Training access request",
  ],
  cat_finance: [
    "Expense reimbursement is pending",
    "Vendor payment status inquiry",
    "Update donor receipt template",
    "Budget code clarification",
    "Invoice approval assistance",
    "Monthly report correction",
  ],
  cat_facilities: [
    "Meeting room lighting repair",
    "Air conditioning maintenance request",
    "Office access card replacement",
    "Workspace furniture adjustment",
    "Water dispenser maintenance",
    "Conference room booking conflict",
  ],
  cat_programs: [
    "Volunteer roster update",
    "Program attendance data correction",
    "Participant registration support",
    "Event logistics assistance",
    "Training material request",
    "Field visit schedule update",
  ],
  cat_procurement: [
    "Purchase request review",
    "Supplier quotation follow-up",
    "Asset delivery confirmation",
    "Procurement policy clarification",
    "Office supply replenishment",
    "Vendor registration assistance",
  ],
  cat_comms: [
    "Website content correction",
    "Social media asset request",
    "Newsletter review needed",
    "Event photography request",
    "Brand guideline clarification",
    "Campaign copy approval",
  ],
  cat_general: [
    "General information request",
    "Internal process clarification",
    "Document review assistance",
    "Stakeholder follow-up required",
    "Service feedback submission",
    "Administrative support request",
  ],
};

const DESCRIPTIONS = [
  "The requester needs assistance to continue their scheduled work. Please review the details and provide the next steps.",
  "This request affects a routine operational task and should be reviewed by the appropriate service owner.",
  "The issue was reported after the usual self-service steps were attempted without success.",
  "Please confirm ownership, assess the impact, and update the requester when a resolution path is available.",
  "The requester has provided the available context and is ready to supply additional information if needed.",
] as const;

const COMMENT_NOTES = [
  "The request details were reviewed and the next action was confirmed.",
  "Additional context was received from the requester.",
  "The assigned team is investigating the reported issue.",
  "A follow-up was scheduled with the relevant stakeholder.",
  "The proposed resolution is being validated before closure.",
] as const;

class SeededRandom {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  next() {
    this.state = (this.state * 1_664_525 + 1_013_904_223) >>> 0;
    return this.state / 4_294_967_296;
  }

  integer(min: number, max: number) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  pick<T>(values: readonly T[]): T {
    return values[this.integer(0, values.length - 1)] as T;
  }
}

function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 3_600_000);
}

function choosePriority(random: SeededRandom): RequestPriority {
  const value = random.next();
  if (value < 0.08) return "URGENT";
  if (value < 0.3) return "HIGH";
  if (value < 0.75) return "MEDIUM";
  return "LOW";
}

function chooseStatus(random: SeededRandom): RequestStatus {
  const value = random.next();
  if (value < 0.24) return "OPEN";
  if (value < 0.52) return "IN_PROGRESS";
  if (value < 0.64) return "WAITING";
  if (value < 0.91) return "RESOLVED";
  return "CLOSED";
}

export function buildSeedDataset(count: number, seed = 20_260_920) {
  if (!Number.isInteger(count) || count < 1) {
    throw new RangeError("Seed request count must be a positive integer.");
  }

  const random = new SeededRandom(seed);
  const requests: SeedRequest[] = [];
  const activities: SeedActivity[] = [];
  const agents = SEED_USERS.filter((user) => user.role === "AGENT");
  const requesters = SEED_USERS.filter((user) => user.role === "REQUESTER");
  const referenceTime = new Date("2026-09-15T12:00:00.000Z");
  let activitySequence = 1;

  const addActivity = (activity: Omit<SeedActivity, "id">) => {
    activities.push({
      id: `act_${String(activitySequence).padStart(7, "0")}`,
      ...activity,
    });
    activitySequence += 1;
  };

  for (let index = 0; index < count; index += 1) {
    const requestId = `req_${String(index + 1).padStart(6, "0")}`;
    const category = random.pick(SEED_CATEGORIES);
    const requester = random.pick(requesters);
    const status = chooseStatus(random);
    const priority = choosePriority(random);
    const createdAt = addHours(
      referenceTime,
      -(random.integer(0, 180) * 24 + random.integer(0, 23)),
    );
    const shouldAssign = status !== "OPEN" || random.next() > 0.42;
    const assignee = shouldAssign ? random.pick(agents) : null;
    const assignedAt = assignee
      ? addHours(createdAt, random.integer(1, 36))
      : null;
    const progressedAt = assignedAt
      ? addHours(assignedAt, random.integer(1, 48))
      : addHours(createdAt, random.integer(1, 48));
    const resolvedAt =
      status === "RESOLVED" || status === "CLOSED"
        ? addHours(progressedAt, random.integer(4, 144))
        : null;
    const closedAt =
      status === "CLOSED" && resolvedAt
        ? addHours(resolvedAt, random.integer(2, 72))
        : null;
    const commentAt = addHours(
      assignedAt ?? createdAt,
      random.integer(1, Math.max(2, resolvedAt ? 24 : 96)),
    );
    const latestActivity = closedAt ?? resolvedAt ?? progressedAt;
    const updatedAt = latestActivity > referenceTime ? referenceTime : latestActivity;

    requests.push({
      id: requestId,
      requestNumber: `SR-${String(10_001 + index).padStart(5, "0")}`,
      subject: random.pick(SUBJECTS[category.id] ?? SUBJECTS.cat_general!),
      description: random.pick(DESCRIPTIONS),
      priority,
      status,
      requesterId: requester.id,
      assigneeId: assignee?.id ?? null,
      categoryId: category.id,
      resolvedAt,
      version: status === "OPEN" ? 1 : random.integer(2, 5),
      createdAt,
      updatedAt,
    });

    addActivity({
      requestId,
      type: "CREATED",
      actorId: requester.id,
      assigneeId: null,
      fromValue: null,
      toValue: "OPEN",
      note: "Request submitted through the service portal.",
      metadataJson: null,
      createdAt,
    });

    if (assignee && assignedAt) {
      addActivity({
        requestId,
        type: "ASSIGNED",
        actorId: "usr_admin_001",
        assigneeId: assignee.id,
        fromValue: null,
        toValue: assignee.id,
        note: `Assigned to ${assignee.name}.`,
        metadataJson: JSON.stringify({ source: "seed", assigneeName: assignee.name }),
        createdAt: assignedAt,
      });
    }

    if (status !== "OPEN") {
      const initialStatus = status === "WAITING" ? "IN_PROGRESS" : status;
      addActivity({
        requestId,
        type: "STATUS_CHANGED",
        actorId: assignee?.id ?? "usr_admin_001",
        assigneeId: assignee?.id ?? null,
        fromValue: "OPEN",
        toValue: initialStatus,
        note: `Status changed from Open to ${initialStatus.toLowerCase().replaceAll("_", " ")}.`,
        metadataJson: null,
        createdAt: progressedAt,
      });
    }

    if (random.next() < 0.46 && commentAt < (resolvedAt ?? referenceTime)) {
      addActivity({
        requestId,
        type: "COMMENT_ADDED",
        actorId: assignee?.id ?? requester.id,
        assigneeId: assignee?.id ?? null,
        fromValue: null,
        toValue: null,
        note: random.pick(COMMENT_NOTES),
        metadataJson: null,
        createdAt: commentAt,
      });
    }

    if (resolvedAt && assignee) {
      addActivity({
        requestId,
        type: "RESOLVED",
        actorId: assignee.id,
        assigneeId: assignee.id,
        fromValue: "IN_PROGRESS",
        toValue: "RESOLVED",
        note: "The requested work was completed and marked as resolved.",
        metadataJson: null,
        createdAt: resolvedAt,
      });
    }

    if (closedAt && assignee) {
      addActivity({
        requestId,
        type: "STATUS_CHANGED",
        actorId: assignee.id,
        assigneeId: assignee.id,
        fromValue: "RESOLVED",
        toValue: "CLOSED",
        note: "The resolved request was reviewed and closed.",
        metadataJson: null,
        createdAt: closedAt,
      });
    }
  }

  return { requests, activities };
}
