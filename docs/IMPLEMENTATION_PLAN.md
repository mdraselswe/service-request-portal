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

Verification record: a nonexistent SQLite database was created automatically and both checked-in migrations deployed successfully; the deterministic seed created 43 users, 8 categories, 10,050 requests, and 37,132 coherent activity records. Seed integrity, workflow consistency, repository, and large-input analytics tests passed.

## Phase 3 - Authentication and protected shell

Status: completed and verified on 2026-09-20

- Implement seeded credentials, password hashing, signed sessions, login/logout, and safe return paths.
- Add Next.js proxy early redirects plus authoritative server/API checks.
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

Verification record: direct request URLs, coherent activity history, status transitions, assignee changes, transactional activity creation, optimistic feedback, rollback, stale-version conflicts, idempotent replay, protected mutation APIs, and designed not-found behavior passed unit, component, and desktop/tablet/mobile browser tests.

## Phase 6 - Hardening and final delivery

Status: completed and verified on 2026-09-20

- Complete responsive and accessibility review at mobile, tablet, and desktop widths.
- Review performance, indexes, client bundles, caching, and query projections.
- Complete selected Playwright journeys and regression coverage.
- Finalize README, technical notes, credentials, troubleshooting, and requirement traceability.
- Run full clean verification and mark the requirements checklist.

Exit criteria: complete runnable implementation, all applicable checklist items complete, and every verification gate green.

Verification record: response security headers, cache behavior, responsive layouts, horizontal overflow, semantic structure, focus handling, live announcements, and reduced-motion styling were reviewed. Automated WCAG A/AA scans passed on login, overview, request list, and request details in desktop, tablet, and mobile Chromium profiles. The complete database, lint, strict typecheck, unit/component test, production build, and Playwright gates passed before final delivery.

## Phase 7 - Maintainability and contributor workflow

Status: completed and verified on 2026-09-20

- Centralize request URL navigation behavior in a focused UI hook shared by filters and sorting.
- Move overview persistence access behind the request feature repository boundary.
- Share the request mutation response contract between the Route Handler and interactive client.
- Establish `AGENTS.md` as the single tool-neutral coding-agent policy without per-tool instruction files.
- Add a human-readable contribution guide covering ownership, dependency direction, reuse, extraction, scale thresholds, and definition of done.
- Add a GitHub Actions quality gate for Prisma validation, lint, strict typecheck, tests, and production build.

Exit criteria: the refactor preserves all user behavior, contributor instructions have one source of truth, and all local quality and browser regression gates pass.

Verification record: diff validation and the English-only source scan passed; ESLint, strict TypeScript, all 23 unit/component tests, the Next.js production build, and all 36 desktop/tablet/mobile Playwright tests passed.

## Phase 8 - Loading experience and responsive polish

Status: completed and verified on 2026-09-20

- Add a reusable, reduced-motion-aware shimmer skeleton primitive.
- Match loading structures to the login, overview, request list, and request detail layouts.
- Add a compact custom brand mark and an App Router favicon using the same visual language.
- Keep request cards through tablet widths and reserve the dense table for desktop viewports.
- Add browser assertions for breakpoint-specific result presentation, favicon discovery, and page overflow.

Exit criteria: loading states preserve the final page hierarchy, branding is consistent, and desktop, tablet, and mobile layouts remain accessible without page-level horizontal overflow.

Verification record: the English-only scan, diff validation, ESLint, strict TypeScript, all 23 unit/component tests, the production build including the static `/icon.svg` route, and all 39 desktop/tablet/mobile Playwright tests passed.

## Phase 9 - Dashboard control consistency

Status: completed and verified on 2026-09-20

- Align overview and request-list content to the same desktop container width.
- Give every request-related native select a consistent custom chevron and protected right-side spacing.
- Add accessible first, previous, nearby-page, next, and last navigation with ellipses for large page counts.
- Preserve URL-owned filters, sorting, and bounded server-side pagination without loading additional records into the browser.
- Verify direct first/last navigation and responsive overflow at desktop, tablet, and mobile widths.

Exit criteria: dashboard pages align consistently, select text cannot collide with its chevron, and any results page is reachable without increasing query or client-state complexity.

Verification record: diff validation, ESLint, strict TypeScript, all 23 unit/component tests, the production build, and all 39 desktop/tablet/mobile Playwright tests passed. Browser tests navigated directly to page 1,005 and back to page 1 while preserving the URL query contract.
