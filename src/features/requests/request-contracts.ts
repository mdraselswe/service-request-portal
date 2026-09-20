import type { RequestStatus } from "./constants";

export type RequestMutationResult = {
  request: {
    requestNumber: string;
    status: RequestStatus;
    version: number;
    updatedAt: string;
    resolvedAt: string | null;
    assignee: { id: string; name: string } | null;
  };
  replayed: boolean;
};

export type RequestMutationResponse =
  | { ok: true; data: RequestMutationResult }
  | {
      ok: false;
      error: {
        code: string;
        message: string;
        fields?: Record<string, string[] | undefined>;
      };
    };
