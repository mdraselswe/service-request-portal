# Implementation Plan

Each phase ends with lint, typecheck, tests, and a production build. A phase is not complete while its gate is red.

## Phase 1 - Project foundation

Status: completed and verified on 2026-09-20

- Scaffold Next.js App Router with strict TypeScript and Yarn.
- Configure Tailwind CSS and shadcn/ui-compatible design tokens.
- Establish aliases, source layout, linting, and formatting-safe conventions.
- Add a responsive professional foundation page and reusable baseline UI primitives.
- Configure Vitest, React Testing Library, and Playwright.
- Add a focused foundation unit/component test.
- Add Prisma/SQLite dependencies, environment contract, and initial client configuration without claiming feature data is complete.
- Write the requirements and architecture documents.
- Write a README for the foundation milestone.
- Verify lint, typecheck, unit tests, and production build.
- Initialize Git only after verification and create the required first local commit.

Exit criteria: all verification commands pass; the local repository has one foundation commit and no remote.

Verification record: Prisma schema validation/client generation, ESLint, strict TypeScript, 3 Vitest tests, Next.js production build, and 2 Playwright projects (desktop Chromium and Pixel 7 emulation) passed. Desktop and mobile production screenshots were also reviewed for layout defects.

## Phase 2 - Data model and realistic seed

Status: completed and verified on 2026-09-20

- Implement the complete Prisma schema, constraints, relations, and indexes.
- Add migrations and a deterministic 10,000+ request seed with coherent history.
- Add database utilities and focused repository tests.
- Implement and test the large activity-summary utility.

Exit criteria: a fresh database can be migrated and seeded from README commands; dataset and summary tests pass.

Verification record: the initial migration deployed successfully; the deterministic seed created 43 users, 8 categories, 10,050 requests, and 35,871 activity records. Seed integrity checks, repository tests, and large-input analytics tests passed.

## Phase 3 - Authentication and protected shell

Status: completed and verified on 2026-09-20

- Implement seeded credentials, password hashing, signed sessions, login/logout, and safe return paths.
- Add middleware early redirects plus authoritative server/API checks.
- Build the responsive portal shell, navigation, account menu, and authentication states.
- Add auth integration tests and protected-route Playwright coverage.

Exit criteria: protected pages and APIs reject anonymous access; documented credentials work.

Verification record: signed HTTP-only sessions, authoritative database-backed user checks, the Next.js 16 proxy redirect, login validation, API rejection, logout, and safe return paths passed unit, component, desktop Chromium, and mobile Chromium tests.

## Phase 4 - Dashboard and URL state

Status: completed and verified on 2026-09-20

- Implement validated URL parsing and database-backed search/filter/sort/pagination.
- Build debounced search, multi-filter controls, active-filter summaries, sorting, pagination, and responsive table/cards.
- Add loading, empty, error, and accessible status experiences.
- Test URL restoration, invalid parameters, query behavior, and keyboard access.

Exit criteria: dashboard behavior remains correct with the 10,000+ seed and direct URL navigation.

Verification record: direct filtered URLs, debounced search, repeated status and priority filters, assignee/category filters, sorting, bounded page sizes, pagination, desktop tables, and mobile cards passed unit tests and eight desktop/mobile Playwright journeys against the 10,050-request dataset.

## Phase 5 - Request details and resilient updates

Status: completed and verified on 2026-09-20

- Build dynamic request details and history with direct access and not-found handling.
- Implement authenticated transactional status/assignee API updates.
- Add idempotency, duplicate-action prevention, optimistic feedback, rollback, and success/error announcements.
- Test latency, failure, repeated actions, stale updates, and direct refresh.

Exit criteria: mutation state stays consistent across success and failure and every change has one activity record.

Verification record: direct request URLs, activity history, status transitions, assignee changes, transactional activity creation, optimistic feedback, rollback, version conflicts, idempotent replay, protected mutation APIs, and designed not-found behavior passed unit, component, and desktop/mobile browser tests.

## Phase 6 - Hardening and final delivery

Status: planned

- Complete responsive and accessibility review at mobile, tablet, and desktop widths.
- Review performance, indexes, client bundles, caching, and query projections.
- Complete selected Playwright journeys and regression coverage.
- Finalize README, technical notes, credentials, troubleshooting, and requirement traceability.
- Run full clean verification and mark the requirements checklist.

Exit criteria: complete runnable implementation, all applicable checklist items complete, and every verification gate green.
