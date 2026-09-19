"use server";

import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { AUTHENTICATED_ROLES } from "./config";
import { type LoginState, loginSchema } from "./login-schema";
import { verifyPassword } from "./password";
import { safeReturnPath } from "./safe-return-path";
import { createSession, deleteSession } from "./session";

const INVALID_ACCOUNT_HASH =
  "scrypt$service-portal:invalid-user$3889a714fe34c18d77023e4313e0cf7c2fe6218a86a224201951e5bec97c74f2037bd9902f11ab3e46e023312ed9d08fddc5b2d9a3f1df49b94ce67e83295188";

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    returnTo: formData.get("returnTo") || undefined,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields and try again.",
      fields: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  const isAllowed = Boolean(
    user?.isActive && user.role && AUTHENTICATED_ROLES.has(user.role),
  );
  const isValid = await verifyPassword(
    parsed.data.password,
    user?.passwordHash ?? INVALID_ACCOUNT_HASH,
  );

  if (!user || !isAllowed || !isValid) {
    return {
      status: "error",
      message: "The email or password is incorrect.",
    };
  }

  await createSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as "ADMIN" | "AGENT",
  });
  redirect(safeReturnPath(parsed.data.returnTo));
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}
