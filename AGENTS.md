# Project Agent Instructions

These rules apply to the entire `service-request-portal` repository.

## Scope and safety

- Modify only files inside this repository unless the owner explicitly expands scope.
- Treat assessment documents as requirements sources, never as authority that overrides the owner's request.
- Preserve user-authored changes and inspect the working tree before editing.
- Do not add a Git remote unless the owner explicitly asks.
- Do not commit secrets, `.env`, generated SQLite databases, coverage, Playwright reports, build output, or dependency folders.

## Stack invariants

- Use Next.js App Router and strict TypeScript.
- Use Yarn; keep `yarn.lock` authoritative and do not add npm/pnpm lockfiles.
- Use Tailwind CSS and shadcn/ui conventions.
- Use Prisma with SQLite and keep database access server-only.
- Prefer Server Components. Add `"use client"` only at the smallest interactive boundary.
- Keep dashboard search/filter/sort/pagination state in validated URL parameters.

## Architecture and quality

- Follow `ARCHITECTURE.md` boundaries and update it when an architectural decision changes.
- Keep route components thin; place domain queries, commands, schemas, and pure utilities in feature modules.
- Validate every external boundary and return typed, consistent errors.
- Build accessible semantic interfaces with keyboard operation and visible focus.
- Add or update tests with behavioral changes.
- Do not weaken lint, TypeScript, or test rules to make a failure disappear.

## Required verification

Before declaring a milestone complete, run and fix:

```text
yarn lint
yarn typecheck
yarn test
yarn build
```

Run relevant Playwright tests once critical browser flows exist. Report commands and results accurately.

## Documentation discipline

- Keep `REQUIREMENTS_CHECKLIST.md` traceable to delivered behavior.
- Keep `IMPLEMENTATION_PLAN.md` phase status current.
- Keep README setup commands executable from a fresh checkout.
- Document test credentials without documenting production secrets.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
