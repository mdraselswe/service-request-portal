# Service Request Portal - Requirements Checklist

Source: `Senior_Frontend_Developer_Assessment.pdf` supplied by the project owner, plus the owner's confirmed implementation decisions. The assessment is treated as product requirements, not as instructions that override the owner's request.

## Product and platform

- [x] Build a compact, production-minded service request management portal.
- [x] Use Next.js App Router for the frontend and backend/API; do not create a separate backend service.
- [x] Use TypeScript with strict compiler settings.
- [x] Use Tailwind CSS and shadcn/ui for a modern professional SaaS dashboard.
- [x] Use Yarn as the package manager.
- [x] Run locally without a paid external service.
- [x] Provide complete runnable source code.

## Authentication and authorization

- [x] Provide a simple login flow with documented test credentials.
- [x] Provide logout.
- [x] Protect all application pages from unauthenticated access.
- [x] Protect relevant API operations independently of page protection.
- [x] Avoid exposing protected request data through cached/public responses.

## Request dashboard

- [x] Display request ID, subject, requester, category, priority, status, assignee, and last-updated time.
- [x] Support a debounced free-text search.
- [x] Support multiple simultaneous filters.
- [x] Support sorting.
- [x] Support server-side pagination.
- [x] Preserve meaningful search, filter, sort, and pagination state in the URL.
- [x] Keep URL state shareable and functional after refresh/direct navigation.
- [x] Provide a responsive table on larger screens and a usable compact presentation on small screens.

## Request details and updates

- [x] Provide a dynamic request details route using Next.js routing.
- [x] Display complete request information and activity/history.
- [x] Make direct URL access and browser refresh work.
- [x] Allow status updates through authenticated API operations.
- [x] Allow assignee updates through authenticated API operations.
- [x] Give immediate feedback for mutations.
- [x] Prevent duplicate/repeated mutation submissions.
- [x] Handle slow responses and failures gracefully.
- [x] Use optimistic updates with rollback where appropriate.

## Application states and resilience

- [x] Provide intentional loading states.
- [x] Provide empty states.
- [x] Provide client and server validation feedback.
- [x] Provide success feedback.
- [x] Provide recoverable error states.
- [x] Provide a designed not-found experience.
- [x] Use consistent error handling rather than default browser behavior.

## Data, performance, and scale

- [x] Use Prisma with SQLite.
- [x] Seed at least 10,000 realistic service requests with requesters, assignees, and activity history.
- [x] Perform filtering, sorting, and pagination in the database rather than loading the full dataset into the browser.
- [x] Add indexes aligned with common query paths.
- [x] Use Server Components by default.
- [x] Limit Client Components to interactive boundaries.
- [x] Avoid unnecessary rendering, client JavaScript, and network requests.
- [x] Define suitable request-level caching/revalidation behavior for protected, mutable data.

## Advanced JavaScript utility

- [x] Summarize a large activity dataset per assignee.
- [x] Return total assigned, total resolved, and average resolution time.
- [x] Handle incomplete and invalid records without throwing.
- [x] Use an efficient single-pass or otherwise scale-appropriate algorithm.
- [x] Cover valid, invalid, incomplete, and large-input behavior with unit tests.

## Responsive design and accessibility

- [x] Support mobile, tablet, and desktop layouts.
- [x] Provide visible keyboard focus and complete keyboard access for interactive controls.
- [x] Use semantic HTML and appropriate accessible names.
- [x] Associate validation errors and labels with inputs.
- [x] Use accessible status announcements for asynchronous feedback.
- [x] Maintain reasonable color contrast and touch target sizing.
- [x] Respect reduced-motion preferences.

## Architecture and quality

- [x] Use a clear, maintainable project structure.
- [x] Use reusable UI and domain components.
- [x] Separate presentation, domain logic, data access, validation, and authentication concerns.
- [x] Use consistent naming and typed boundaries.
- [x] Add appropriate error handling and structured API responses.
- [x] Add ESLint and formatting conventions.
- [x] Use Vitest and React Testing Library for unit/component coverage.
- [x] Add selected Playwright tests for critical user journeys.
- [x] Run lint, typecheck, tests, and production build before each milestone is considered complete.

## Documentation and delivery

- [x] Provide a complete README with prerequisites, setup, seed, run, test, build, and test credentials.
- [x] Document Server vs Client Component decisions.
- [x] Document state and data-fetching decisions.
- [x] Document performance considerations.
- [x] Document application structure.
- [x] Keep `TECH_SPEC.md`, `ARCHITECTURE.md`, and `IMPLEMENTATION_PLAN.md` current.
- [x] Initialize a local Git repository only after the first milestone passes all verification gates.
- [x] Do not add a GitHub remote during the first milestone.
- [x] Create the first commit with message `chore: initialize service request portal foundation`.

## Definition of done

The final product is done only when every applicable item above is checked, the documented credentials work, the database can be recreated from commands in the README, and lint, typecheck, automated tests, and production build all pass from a clean local checkout.
