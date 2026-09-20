# Technical Specification

## 1. Scope

The Service Request Portal is an authenticated internal dashboard for reviewing, searching, filtering, and managing support requests. Next.js owns both rendering and HTTP APIs. SQLite provides a zero-cost local datastore through Prisma.

The delivered application includes the verified foundation, complete data model, authentication, dashboard, request details, resilient mutations, and production-quality test coverage.

## 2. Chosen stack

| Concern | Decision |
| --- | --- |
| Runtime and framework | Next.js App Router on Node.js |
| Language | TypeScript with `strict: true` |
| Package manager | Yarn Classic, pinned through `packageManager` |
| Styling | Tailwind CSS |
| UI primitives | shadcn/ui conventions with Radix primitives where needed |
| Persistence | Prisma ORM and SQLite |
| Validation | Zod at URL, form, and API boundaries |
| Authentication | Credentials-based signed session stored in an HTTP-only cookie |
| Unit/component tests | Vitest, React Testing Library, `@testing-library/jest-dom` |
| End-to-end tests | Playwright for selected critical flows |
| Icons | Lucide React |
| Dates | `date-fns` |

Exact package versions are locked in `yarn.lock`; upgrade decisions must preserve the verification gates.

## 3. Functional specification

### 3.1 Authentication

- `/login` accepts a seeded test user's email and password.
- A successful login creates a signed, expiring, HTTP-only, `sameSite=lax` session cookie.
- Credentials are stored as password hashes, never plaintext.
- The Next.js proxy performs an early redirect for clearly unauthenticated page requests.
- Server pages and Route Handlers perform authoritative session checks; the proxy is not the sole security boundary.
- Logout invalidates the session and redirects to `/login`.

### 3.2 Dashboard query contract

The dashboard reads these canonical URL parameters:

| Parameter | Meaning | Default |
| --- | --- | --- |
| `q` | Debounced subject, ID, or requester search | empty |
| `status` | Repeated/comma-normalized status values | all |
| `priority` | Repeated/comma-normalized priority values | all |
| `category` | Category identifier | all |
| `assignee` | User identifier or `unassigned` | all |
| `sort` | Whitelisted sort key | `updatedAt` |
| `order` | `asc` or `desc` | `desc` |
| `page` | One-based page number | `1` |
| `pageSize` | Whitelisted page size | `25` |

Invalid values are normalized on the server. Search/filter/sort changes reset `page` to 1. Pagination and filtering execute in SQLite via Prisma; the full dataset is never sent to the client.

### 3.3 Request details

- Route: `/requests/[requestId]`.
- The Server Component loads the request, related requester/assignee/category, and ordered activity history.
- Unknown IDs use `notFound()`.
- Interactive status and assignee controls are small Client Components with server-provided initial data.

### 3.4 Mutation API

- `PATCH /api/requests/[requestId]` accepts a discriminated, Zod-validated update for status and/or assignee.
- Authentication and authorization are checked inside the handler.
- The update and matching activity event are committed in one Prisma transaction.
- Responses use a consistent JSON success/error envelope and meaningful HTTP status codes.
- The UI disables duplicate submission, applies an optimistic state, rolls back on failure, announces the result, and refreshes server data after success.
- A client mutation identifier is used to make accidental retries safe.

## 4. Data model

Core models:

- `User`: authenticated users and assignable agents.
- `Category`: stable service categories.
- `ServiceRequest`: human-readable request number, subject, description, priority, status, requester, optional assignee, category, timestamps, and optimistic version.
- `RequestActivity`: append-only event history with type, actor, optional assignee context, timestamps, and structured metadata.
- `MutationReceipt`: bounded idempotency record for repeated mutation protection.

Enums define request priority, request status, user role, and activity type. Indexes cover dashboard sort/filter paths, requester/assignee relations, and activity chronology.

The deterministic seed creates at least 10,000 varied requests, multiple users and categories, and realistic chronological activity without requiring remote services.

## 5. Rendering and state strategy

- Server Components are the default for layouts, dashboard results, details, and activity history.
- Client Components are limited to the login form, debounced URL controls, active navigation, mutation controls, and other genuinely interactive primitives.
- Search/filter/sort/pagination state lives in the URL. There is no duplicate global client store for server query state.
- Temporary form state and optimistic mutation state remain local to their Client Components.
- Protected request data is dynamically rendered and not stored in a public shared cache.
- Prisma access is server-only and centralized in `src/lib/db` and domain query modules.

## 6. Performance budget and scale behavior

- Dashboard queries select only displayed columns and related display names.
- Pagination uses bounded page sizes and a separate count query.
- All filter and sort keys are whitelisted.
- Search input updates the URL after a short debounce and skips no-op navigations.
- Expensive client components and broad context providers are avoided.
- Tables/cards use stable keys and Server Component rendering.
- Activity summary processing is O(n) time with O(r + a) memory, where `r` is the number of distinct assignee/request timelines and `a` is the number of distinct assignees.
- Production build output and client boundaries are reviewed before final delivery.

## 7. Accessibility and responsive behavior

- A skip link and landmark structure support keyboard navigation.
- Data tables retain semantic headers on desktop; compact mobile cards preserve labels in text.
- Controls have programmatic names, visible focus states, and minimum practical touch sizes.
- Loading and mutation messages use appropriate live regions without excessive announcements.
- Color is never the only status/priority indicator.
- Layout breakpoints prioritize content rather than device-specific assumptions.

## 8. Failure handling

- Route-level `loading.tsx`, `error.tsx`, and `not-found.tsx` provide deliberate states.
- Empty results distinguish “no requests exist” from “filters matched nothing.”
- Route Handlers return safe user messages while logging useful server context.
- Optimistic mutations keep a snapshot for rollback.
- Validation runs on both client and server where user experience benefits, with the server as authority.

## 9. Verification gates

Every milestone must pass:

```text
yarn lint
yarn typecheck
yarn test
yarn build
```

Relevant milestones also run selected Playwright tests. Failures must be fixed before committing.

The final regression matrix runs Playwright in desktop, tablet, and mobile Chromium profiles and includes automated WCAG A/AA scanning.
