import { z } from "zod";

import { REQUEST_STATUSES } from "./constants";

export const requestMutationSchema = z
  .object({
    mutationId: z.string().uuid(),
    version: z.number().int().positive(),
    status: z.enum(REQUEST_STATUSES).optional(),
    assigneeId: z.string().min(1).nullable().optional(),
  })
  .refine((value) => value.status !== undefined || value.assigneeId !== undefined, {
    message: "At least one request field must be provided.",
  });

export type RequestMutationInput = z.infer<typeof requestMutationSchema>;
