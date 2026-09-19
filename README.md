# Service Request Portal

A production-minded internal service request dashboard for As-Sunnah Foundation, built with Next.js App Router, strict TypeScript, Tailwind CSS, shadcn/ui conventions, Prisma, and SQLite.

> Completed milestone: Phase 1 project foundation. Authentication, the complete domain model, the 10,000+ record seed, dashboard workflows, and request mutations are planned in the subsequent phases described in `IMPLEMENTATION_PLAN.md`.

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

Playwright is configured for selected browser journeys. After installing the Chromium runtime with `yarn playwright install chromium`, run:

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
- Dashboard query state will live in validated URL parameters, so filtered views survive refresh and direct navigation.
- Protected reads execute on the server through narrow domain queries; Prisma never enters the client bundle.
- SQLite filtering, sorting, and pagination will keep 10,000+ records out of browser memory.
- Status and assignee changes will use authenticated, validated, transactional API operations with immediate optimistic feedback and rollback.
- The interface uses semantic HTML, visible focus states, reduced-motion handling, and responsive content-first layouts.

See `TECH_SPEC.md` for contracts, `ARCHITECTURE.md` for system boundaries and decisions, `REQUIREMENTS_CHECKLIST.md` for traceability, and `IMPLEMENTATION_PLAN.md` for delivery phases.

## Test credentials

The seed prepares `admin@assunnah.org` with password `Portal@123`. The login flow becomes available in Phase 3; these credentials are strictly for local assessment use.

## Repository policy

This repository intentionally has no Git remote in the first milestone. Local environment files, databases, generated output, reports, and dependencies are ignored.
