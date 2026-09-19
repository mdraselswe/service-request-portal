"use client";

import { useActionState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/features/auth/actions";
import { INITIAL_LOGIN_STATE } from "@/features/auth/login-schema";

export function LoginForm({ returnTo }: { returnTo: string }) {
  const [state, formAction, pending] = useActionState(
    loginAction,
    INITIAL_LOGIN_STATE,
  );

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <input name="returnTo" type="hidden" value={returnTo} />

      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="name@assunnah.org"
          aria-describedby={state.fields?.email ? "email-error" : undefined}
          aria-invalid={Boolean(state.fields?.email)}
          required
        />
        {state.fields?.email ? (
          <p id="email-error" className="text-sm text-destructive">
            {state.fields.email[0]}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="password">Password</Label>
          <span className="text-xs text-muted-foreground">Local assessment access</span>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          aria-describedby={state.fields?.password ? "password-error" : undefined}
          aria-invalid={Boolean(state.fields?.password)}
          required
        />
        {state.fields?.password ? (
          <p id="password-error" className="text-sm text-destructive">
            {state.fields.password[0]}
          </p>
        ) : null}
      </div>

      {state.status === "error" && state.message ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-sm text-destructive"
        >
          {state.message}
        </div>
      ) : null}

      <Button className="w-full" size="lg" disabled={pending} type="submit">
        {pending ? (
          <>
            <LoaderCircle aria-hidden="true" className="animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            Sign in to the portal
            <ArrowRight aria-hidden="true" />
          </>
        )}
      </Button>
    </form>
  );
}
