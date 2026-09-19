# Architecture

## 1. System context

```text
Browser
  -> Next.js middleware (early authentication redirect)
  -> App Router Server Components / Route Handlers (authoritative auth)
  -> Domain queries, commands, and validation
  -> Prisma Client
  -> local SQLite database
```

The system is a single deployable Next.js application. No paid service or separate backend is required.

## 2. Project boundaries

```text
src/
  app/                    Routes, layouts, route states, and Route Handlers
    (auth)/               Public authentication routes
    (portal)/             Protected portal routes
    api/                  Authenticated HTTP mutation/query boundaries
  components/
    ui/                   Reusable shadcn-style primitives
    layout/               App shell, navigation, and responsive structure
    requests/             Request-specific presentation and interaction
  features/
    auth/                 Auth contracts, session helpers, and actions
    requests/             Query parsing, repository functions, and commands
    analytics/            Large-dataset activity summary utility
  lib/                    Cross-cutting server/client-safe utilities
  test/                   Shared test setup and factories
prisma/                   Schema, migrations, and deterministic seed
e2e/                      Selected Playwright journeys
public/                   Static assets
```

Imports flow inward: route/UI code may call feature and library modules; domain/data modules must not import route components. Prisma modules are marked server-only and never imported into the client graph.

## 3. Rendering ownership

| Area | Default owner | Reason |
| --- | --- | --- |
| Root and portal layouts | Server Component | Minimal client JavaScript and authoritative session access |
| Dashboard result list | Server Component | Database-backed URL queries and shareable refresh behavior |
| Request details/history | Server Component | Direct navigation, not-found behavior, protected reads |
| Search/filter controls | Client Component | Debouncing and URL interaction |
| Status/assignee controls | Client Component | Optimistic feedback and rollback |
| UI primitives | Server-compatible where possible | Prevent accidental client-boundary expansion |

`"use client"` is placed at the narrowest interactive leaf, not at page or layout level without a documented need.

## 4. Request and data flows

### Dashboard read

```text
URL searchParams
  -> Zod normalization/whitelisting
  -> Prisma where/orderBy/skip/take
  -> small typed projection
  -> Server Component table/cards
  -> narrow Client Components update only canonical URL parameters
```

### Request mutation

```text
User selection
  -> optimistic local value + disabled control
  -> authenticated PATCH with mutation ID
  -> validation + transaction(request update, activity, receipt)
  -> success: announce + router.refresh()
  -> failure: restore snapshot + actionable error
```

### Authentication

```text
Credentials
  -> server validation
  -> constant-time password hash verification
  -> signed, expiring HTTP-only session cookie
  -> Next.js proxy performs an optimistic signature check
  -> protected layout/API reloads the active user from SQLite
  -> redirect to validated internal return path
```

## 5. Security model

- Treat every Route Handler and Server Action as independently reachable.
- Validate all untrusted input with shared schemas.
- Keep session secrets and database paths in environment variables.
- Never expose Prisma models wholesale when a narrow DTO is sufficient.
- Allow only internal relative return URLs to prevent open redirects.
- Use secure cookies in production and explicit expiry.
- Use generic login errors to avoid account enumeration.
- Escape output through React and do not render unsanitized HTML.

The role model supports `ADMIN`, `AGENT`, and non-login `REQUESTER` records. Active administrators and agents can access the portal; requesters represent stakeholders attached to service requests. Mutation permissions remain centralized so policy can evolve without rewriting UI code.

## 6. Data integrity and concurrency

- Status/assignee changes and their activity entries share one transaction.
- `updatedAt` and a numeric version make stale writes detectable.
- A unique client mutation ID prevents duplicate activity when requests are retried.
- Activity is append-only from the application path.
- Foreign keys and enum-like Prisma fields keep relationships valid.

## 7. Test architecture

- Pure unit tests cover query normalization and the activity summary algorithm.
- React Testing Library covers accessible interactive components and rollback behavior.
- Route/domain tests cover authentication, validation, filtering, and transactional commands with an isolated database where appropriate.
- Playwright covers login, protected redirect, dashboard URL state, details direct access, and a successful/failed update path.
- Test helpers generate explicit data and avoid dependence on the large development seed.

## 8. Operational model

- `.env.example` documents required local values; `.env` and SQLite runtime files are ignored.
- `yarn prisma:migrate` creates the schema.
- `yarn db:seed` creates deterministic demo data and credentials.
- `yarn dev` starts local development.
- `yarn build` is the production compilation gate.

## 9. Architectural decision record

### ADR-001: URL-owned dashboard state

Accepted. It enables direct navigation, refresh, back/forward behavior, and shareable filtered views without a global client store.

### ADR-002: Server Components by default

Accepted. Protected database reads stay on the server and the browser receives less JavaScript.

### ADR-003: Prisma with SQLite

Accepted for a self-contained assessment and reproducible local setup. Repository/query boundaries allow a future database change without rewriting page components.

### ADR-004: Custom signed-cookie credential session

Accepted for a simple local assessment flow with a small dependency surface. Authorization remains server-side and the design can be replaced behind the session API if an external identity provider is later required.

### ADR-005: Offset pagination

Accepted because explicit page navigation is a requirement and 10,000 records are modest with indexes and bounded page sizes. Cursor pagination is preferred only if the product later moves toward infinite scrolling or far larger/high-churn datasets.
