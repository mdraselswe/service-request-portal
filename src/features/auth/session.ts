import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import {
  AUTHENTICATED_ROLES,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_SECONDS,
} from "./config";
import { createSessionToken, verifySessionToken } from "./session-token";

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "AGENT";
};

export async function createSession(user: AuthenticatedUser) {
  const token = await createSessionToken({ userId: user.id, role: user.role });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
    priority: "high",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export const getCurrentUser = cache(async (): Promise<AuthenticatedUser | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const payload = await verifySessionToken(token);
  if (!payload) return null;

  const user = await db.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });
  if (!user?.isActive || !AUTHENTICATED_ROLES.has(user.role)) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as AuthenticatedUser["role"],
  };
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
