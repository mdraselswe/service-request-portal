# Contributing Guide

This guide explains how to extend the portal without eroding its architecture. It
is intended for human contributors and coding agents. Start with `README.md` for
setup and `docs/ARCHITECTURE.md` for system boundaries. Human contributors must
follow this guide; coding agents must read and follow `AGENTS.md` before starting
work.

## Before implementation

1. Translate the task into observable acceptance criteria.
2. Identify the owning feature under `src/features` and inspect its current code and tests.
3. Search the repository before adding a component, type, schema, constant, hook, or helper.
4. Check the relevant Next.js guide in `node_modules/next/dist/docs` before using framework APIs.
5. Keep the planned change narrow. Do not combine feature work with unrelated cleanup.

## Where code belongs

| Responsibility | Location | Examples |
| --- | --- | --- |
| Routes and HTTP boundaries | `src/app` | pages, layouts, loading/error states, Route Handlers |
| Reusable visual primitives | `src/components/ui` | buttons, badges, cards, inputs |
| Feature-specific UI | `src/components/<feature>` | request filters, request update controls |
| Business rules and validation | `src/features/<feature>` | transitions, Zod schemas, typed contracts |
| Database reads and writes | `src/features/<feature>` | repositories and commands marked server-only |
| Truly cross-cutting helpers | `src/lib` | Prisma client, class-name composition |
| Shared test infrastructure | `src/test` | global setup and broadly reused factories |

Keep a type, constant, or helper beside its only consumer. Move it to a feature
module when it expresses a feature concept or gains multiple consumers. Move it
to `src/lib` only when it is genuinely feature-independent. Avoid global
`types`, `constants`, and `utils` dumping grounds.

## Dependency direction

```text
app routes and UI
        |
        v
feature contracts, queries, commands, and domain rules
        |
        v
cross-cutting infrastructure and Prisma
```

- Route modules may depend on components, features, and libraries.
- Components may depend on browser-safe feature contracts and domain helpers.
- Client Components must not import repositories, commands, Prisma, or other server-only modules.
- Feature modules must not depend on route modules.
- Domain rules should remain usable without React or Next.js.

## Adding a feature

Use the smallest subset of this sequence that the feature needs:

1. Define or extend the domain vocabulary and typed contract.
2. Add Zod validation at every untrusted boundary.
3. Add a server-only repository for reads or a command for transactional writes.
4. Expose the behavior through a thin Server Component, Server Action, or Route Handler.
5. Add the smallest interactive Client Component necessary.
6. Cover domain rules with unit tests and critical user behavior with component or Playwright tests.
7. Update architecture, technical specification, requirements, and setup documentation only where the delivered behavior changes them.

Do not create every possible layer up front. A read-only feature may need only a
query and a Server Component. Add an interface or abstraction when there is a
real alternate implementation, testing seam, or repeated orchestration to hide.

## Reuse and extraction rules

- Search before creating. Prefer one authoritative schema, contract, label map, and query-state implementation.
- Extract repeated stateful UI behavior into a custom hook when at least two consumers need the same lifecycle and navigation semantics.
- Extract repeated pure logic into a named function or domain module.
- Do not hide authorization, workflow transitions, or persistence rules in hooks or generic utilities.
- Do not split a cohesive component only to reduce its line count. Split when parts have distinct responsibilities, independent reuse, or independent test value.
- Do not introduce a global client store for URL state or server-owned data.
- Prefer explicit imports over broad barrel files that can hide dependency cycles.

## Database and scale evolution

SQLite, bounded offset pagination, and relational `contains` search are deliberate
for the assessment dataset. Preserve repository boundaries so these choices can
evolve without rewriting pages.

Consider PostgreSQL before multi-instance or high-write production deployment.
Consider keyset pagination for very deep or high-churn result sets, and full-text
search when measured query latency or dataset size justifies it. Add queues,
caches, or separate services only for measured operational needs.

## Definition of done

- Acceptance criteria are met without unrelated behavior changes.
- External input is validated and protected operations authorize independently.
- New code follows the dependency direction and does not duplicate an existing concept.
- Tests cover changed behavior and failure paths appropriate to the risk.
- Accessibility and responsive behavior are preserved for UI changes.
- Documentation reflects any changed setup, contract, or architectural decision.
- The final diff contains no secrets, generated output, debug code, or unrelated files.
- `yarn lint`, `yarn typecheck`, `yarn test`, and `yarn build` pass.
- Relevant Playwright projects pass for critical browser-flow changes.

## Change review checklist

Before handing off work, review the diff and ask:

- Did I reuse the existing domain language and source of truth?
- Did I accidentally duplicate a type between the server and client?
- Could this remain a Server Component?
- Is database access contained in a server-only feature module?
- Are error, empty, loading, and permission states handled?
- Is the code easier for the next contributor to understand than the code it replaced?
