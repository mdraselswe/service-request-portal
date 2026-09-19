import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must contain at least 8 characters.")
    .max(128, "Password is too long."),
  returnTo: z.string().optional(),
});

export type LoginState = {
  status: "idle" | "error";
  message?: string;
  fields?: {
    email?: string[];
    password?: string[];
  };
};

export const INITIAL_LOGIN_STATE: LoginState = { status: "idle" };
