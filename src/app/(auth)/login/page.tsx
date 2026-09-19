import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckCircle2, LayoutDashboard, ShieldCheck } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/features/auth/session";
import { safeReturnPath } from "@/features/auth/safe-return-path";

export const metadata: Metadata = {
  title: "Sign in",
};

type LoginPageProps = {
  searchParams: Promise<{ returnTo?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();
  if (user) redirect("/");

  const params = await searchParams;
  const requestedPath = Array.isArray(params.returnTo)
    ? params.returnTo[0]
    : params.returnTo;
  const returnTo = safeReturnPath(requestedPath);

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-foreground p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,oklch(0.52_0.12_175/.65),transparent_38%),radial-gradient(circle_at_85%_85%,oklch(0.38_0.08_240/.6),transparent_42%)]"
        />
        <div className="relative flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15">
            <LayoutDashboard aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="font-bold">Service Request Portal</p>
            <p className="text-sm text-white/65">As-Sunnah Foundation</p>
          </div>
        </div>

        <div className="relative max-w-xl">
          <Badge className="mb-6 border-white/15 bg-white/10 text-white">
            Internal operations workspace
          </Badge>
          <h1 className="text-balance text-4xl font-bold tracking-[-0.035em] text-white xl:text-5xl">
            Resolve service needs with clarity and ownership.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-white/70">
            Review incoming requests, coordinate the right people, and keep a
            complete history of every operational decision.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-white/75">
            {[
              "Protected access to internal request data",
              "A responsive workspace for every device",
              "Clear ownership and activity history",
            ].map((item) => (
              <li className="flex items-center gap-3" key={item}>
                <CheckCircle2 aria-hidden="true" className="size-5 text-emerald-300" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/45">
          Authorized personnel only. Activity may be recorded for operational security.
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <LayoutDashboard aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="text-sm font-bold">Service Request Portal</p>
              <p className="text-xs text-muted-foreground">As-Sunnah Foundation</p>
            </div>
          </div>

          <span className="mb-5 grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck aria-hidden="true" className="size-5" />
          </span>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
          <p className="mt-2 text-muted-foreground">
            Enter your authorized account details to continue.
          </p>
          <div className="mt-8">
            <LoginForm returnTo={returnTo} />
          </div>

          <div className="mt-6 rounded-xl border border-border bg-muted/45 p-4 text-sm">
            <p className="font-semibold text-foreground">Assessment credentials</p>
            <p className="mt-1 text-muted-foreground">
              admin@assunnah.org / Portal@123
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
