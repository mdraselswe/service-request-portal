# Project Agent Instructions

These rules apply to the entire `service-request-portal` repository.

## Required context before changing code

1. Read this file completely.
2. Read `docs/ARCHITECTURE.md` and `CONTRIBUTING.md`.
3. Read the relevant feature, its tests, and nearby components before proposing a new module.
4. Inspect the working tree and preserve unrelated changes.
5. Search for an existing component, contract, schema, constant, hook, or utility before creating one.

`AGENTS.md` is the single, tool-neutral instruction source for coding agents.
Do not create tool-branded instruction files or duplicate these rules elsewhere.
When an agent does not discover this file automatically, explicitly instruct it
to read `AGENTS.md` before starting the task.

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

- Follow `docs/ARCHITECTURE.md` boundaries and update it when an architectural decision changes.
- Keep route components thin; place domain queries, commands, schemas, and pure utilities in feature modules.
- Keep feature-specific code close to its feature. Promote code to a shared location only after it has multiple genuine consumers.
- Reuse existing contracts, schemas, constants, components, and helpers. Do not create a second representation of the same concept.
- Keep business rules framework-independent. Hooks and components may orchestrate UI behavior but must not own server-side policy.
- Prefer clear, direct code over speculative abstractions. Do not add repositories, services, hooks, global state, or factories without a current responsibility they simplify.
- Preserve the import direction documented in `docs/ARCHITECTURE.md`; do not import route modules from features or server-only modules from Client Components.
- Validate every external boundary and return typed, consistent errors.
- Build accessible semantic interfaces with keyboard operation and visible focus.
- Add or update tests with behavioral changes.
- Do not weaken lint, TypeScript, or test rules to make a failure disappear.

## Task workflow

- Restate the acceptance criteria and identify the owning feature before editing.
- Make the smallest cohesive change that satisfies the task.
- Extend an existing module when it has the same responsibility; create a new module when the responsibility is distinct.
- Keep UI, validation, domain rules, persistence, and transport concerns at their documented boundaries.
- Update documentation only when behavior, setup, contracts, or architectural decisions change.
- Review the final diff for duplicate logic, accidental client boundaries, unsafe casts, dead code, and unrelated edits.

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

- Keep `docs/REQUIREMENTS_CHECKLIST.md` traceable to delivered behavior.
- Keep `docs/IMPLEMENTATION_PLAN.md` phase status current.
- Keep README setup commands executable from a fresh checkout.
- Document test credentials without documenting production secrets.
- Keep `CONTRIBUTING.md` accurate for both human and automated contributors.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
