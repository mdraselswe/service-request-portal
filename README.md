# Service Request Portal

A production-minded internal service request dashboard for As-Sunnah Foundation, built with Next.js App Router, strict TypeScript, Tailwind CSS, shadcn/ui conventions, Prisma, and SQLite.

The implementation is complete: authentication, protected APIs, a responsive database-backed dashboard, request details, activity history, resilient optimistic mutations, accessibility checks, and automated regression coverage are included.

## Prerequisites

- Node.js 20.19+ (Node.js 22 or 24 LTS-compatible releases are recommended)
- Yarn Classic 1.22.22

## Local setup

```bash
yarn install --frozen-lockfile
copy .env.example .env
yarn db:generate
yarn db:deploy
yarn db:seed
yarn db:verify
yarn dev
```

On macOS/Linux, use `cp .env.example .env` instead of `copy`.

Open [http://localhost:3000](http://localhost:3000).

The deterministic seed creates 43 users, 8 categories, 10,050 service requests, and more than 35,000 chronological activity records. Re-running `yarn db:seed` safely replaces the local demo dataset.

## Verification

```bash
yarn lint
yarn typecheck
yarn test
yarn build
```

Playwright covers selected journeys in desktop, tablet, and mobile Chromium profiles. After installing the runtime with `yarn playwright install chromium`, run:

```bash
yarn test:e2e
```

## Useful scripts

| Command | Purpose |
| --- | --- |
| `yarn dev` | Start the local Next.js development server |
| `yarn build` | Create a production build |
| `yarn start` | Serve the production build |
| `yarn lint` | Run ESLint with warnings treated as failures |
| `yarn typecheck` | Run strict TypeScript checking without emitting files |
| `yarn test` | Run Vitest unit and component tests once |
| `yarn test:watch` | Run Vitest in watch mode |
| `yarn test:e2e` | Run selected Playwright tests |
| `yarn db:generate` | Generate Prisma Client |
| `yarn db:validate` | Validate the Prisma schema and environment |
| `yarn db:deploy` | Apply checked-in database migrations |
| `yarn db:seed` | Recreate the deterministic local demo dataset |
| `yarn db:verify` | Verify record counts and workflow variety |
| `yarn db:studio` | Open Prisma Studio for local data inspection |

## Architecture summary

- Server Components are the default. Client Components are reserved for narrow interactive boundaries such as URL controls and optimistic mutations.
- Dashboard query state lives in validated URL parameters, so filtered views survive refresh and direct navigation.
- Protected reads execute on the server through narrow domain queries; Prisma never enters the client bundle.
- SQLite filtering, sorting, and pagination keep 10,000+ records out of browser memory.
- Status and assignee changes use authenticated, validated, transactional API operations with immediate optimistic feedback and rollback.
- The interface uses semantic HTML, visible focus states, reduced-motion handling, and responsive content-first layouts.

See `TECH_SPEC.md` for contracts, `ARCHITECTURE.md` for system boundaries and decisions, `REQUIREMENTS_CHECKLIST.md` for traceability, and `IMPLEMENTATION_PLAN.md` for delivery phases.

## Feature overview

- Signed, expiring HTTP-only sessions with authoritative server-side user checks.
- Searchable request dashboard with combined filters, sorting, bounded server pagination, and shareable URL state.
- Responsive desktop table and compact mobile presentation.
- Request details with chronological activity and direct-link support.
- Optimistic status and assignee updates with rollback, version conflict handling, and idempotent retries.
- Deterministic realistic data: 43 users, 8 categories, 10,050 requests, and 35,871 activity records.
- Intentional loading, empty, validation, error, not-found, and success states.

## URL query parameters

The `/requests` route accepts `q`, repeated `status` and `priority` values, `category`, `assignee`, `sort`, `order`, `page`, and `pageSize`. Invalid or unsupported values are safely normalized. Search and filter changes reset pagination to the first page.

## Security and consistency

- Protected pages use the Next.js proxy for early redirects and repeat authorization at server rendering and API boundaries.
- Inputs are validated with Zod. Prisma is server-only and queries return narrow projections.
- Mutations write request changes, activity, and idempotency receipts transactionally.
- Security response headers deny framing, disable MIME sniffing, restrict browser permissions, and apply a same-origin referrer policy.
- Protected mutable reads are dynamic and use `no-store`; they are never placed in a shared public cache.

## Testing strategy

Vitest covers domain logic, validation, authentication, database queries, the large-data summary utility, and interactive React behavior. Playwright covers authentication, URL state, responsive dashboard behavior, request updates and rollback, repeat-action safety, horizontal overflow, and automated WCAG A/AA scans at desktop, tablet, and mobile sizes.

## Troubleshooting

- If Prisma reports a missing database, run `yarn db:deploy`, `yarn db:seed`, and `yarn db:verify`.
- If Prisma Client is stale after a schema change, run `yarn db:generate`.
- If Playwright cannot find Chromium, run `yarn playwright install chromium`.
- If port 3000 is already in use, stop the existing local server before running the end-to-end suite.
- Delete only the ignored local SQLite database and rerun deploy/seed when a completely fresh demo dataset is required.

## Production notes

SQLite is intentional for this self-contained assessment. Before a multi-instance deployment, move persistence and session revocation needs to production-grade shared infrastructure, rotate `SESSION_SECRET`, replace seeded credentials, enable TLS, and review organization-specific authorization and retention policies.

## Test credentials

Use `admin@assunnah.org` with password `Portal@123`. These credentials are strictly for local assessment use. Change `SESSION_SECRET` and replace seeded credentials before any non-assessment deployment.

## Repository policy

This repository intentionally has no Git remote in the first milestone. Local environment files, databases, generated output, reports, and dependencies are ignored.
