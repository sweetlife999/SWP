# Architecture — Student Union Portal

This document is the maintained architecture artifact for the project. It
describes the system's static structure, a key runtime flow, and its
deployment topology, and links the Architecture Decision Records (ADRs)
that shaped these choices.

Diagrams are maintained as PlantUML source under this directory and
rendered from source (diagrams-as-code), not pasted as static images:

- [`static-view/component-diagram.puml`](static-view/component.puml)
- [`dynamic-view/admin-publish-event-sequence.puml`](dynamic-view/sequence.puml)
- [`deployment-view/deployment-diagram.puml`](deployment-view/deployment.puml)

Related decisions: [ADR-0001](adr/ADR-0001-single-admin-jwt-authentication.md),
[ADR-0002](adr/ADR-0002-pydantic-request-validation.md),
[ADR-0003](adr/ADR-0003-docker-compose-deployment-on-vps.md).

---

## Static View

![Component diagram](static-view/component.puml)

**What the diagram shows.** The Student Union Portal is a React/TypeScript
SPA talking to a FastAPI backend over REST/JSON. The backend is split into
an auth module and four resource routers (Events, Members, Kanban,
Questionnaires), each of which persists to a shared PostgreSQL database.
The Members router additionally calls out to Thumbor for member-photo
resizing. GitHub Actions builds and pushes container images to GHCR, which
the production host later pulls (detailed further in the Deployment View).
Students and admins both enter through the same SPA; only admin actions
route through the Auth Module.

**Coupling and cohesion.** Each resource router is cohesive — it owns one
domain's request handling and talks to the database directly, with no
router calling another router. Coupling between routers and the database
is deliberately loose: all routers depend on the same Pydantic schema
layer (`app/models/schemas.py`) and a shared DB access pattern, rather than
on each other. The Auth Module is a shared cross-cutting dependency used
by all admin routes, which is appropriate coupling for an authentication
concern. The one external coupling worth calling out is Members → Thumbor;
if Thumbor is unavailable, only photo upload/processing degrades, not the
rest of the Members feature.

**Maintainability implications.** Because routers don't depend on each
other, a change to Kanban logic cannot break Questionnaires — new features
can generally be added as new routers without touching existing ones. The
main maintainability risk is schema drift between the Pydantic validation
layer and the Alembic-managed database schema (see ADR-0002), since
nothing currently enforces that they change together.

**Quality requirements this structure supports/constrains.** The
router-per-domain + shared Auth Module structure directly supports
**QR-SEC** (a single enforcement point for admin authentication rather
than per-router auth logic) and **QR-REL** (a single shared validation
layer per resource, see ADR-0002). It constrains extensibility toward
multiple admin roles, since the Auth Module currently has no concept of
roles or scopes (see ADR-0001).

---

## Dynamic View

![Admin publishes an event — sequence diagram](dynamic-view/sequence.puml)

**Scenario represented.** An admin publishes a new event: the SPA sends a
`POST /api/admin/events` request with a bearer JWT and event data; the
backend verifies the token, validates the request body, and only then
writes to the database.

**Why this scenario matters.** Publishing events is the SU:Core team's
core administrative action and the primary way public-facing content
enters the system. It is also the scenario most directly exercised by two
of the project's quality requirements at once, making it a good
representative flow rather than a trivial CRUD example.

**What it helps the reader reason about.** The flow makes explicit the
two independent guard rails the architecture relies on before any write
reaches PostgreSQL: authentication (ADR-0001, QR-SEC) and request
validation (ADR-0002, QR-REL). It also shows the integration boundary
between the SPA and the backend (a stateless REST call carrying a bearer
token, no server-side session) and the boundary between the API layer and
the database (writes only happen after both guard rails pass).

**What the diagram shows.** Two independent decision points in sequence —
token verification, then schema validation — each with its own failure
path back to the frontend (`401` vs `422`) before the happy path reaches
the Events Router and PostgreSQL and returns `201 Created`.

---

## Deployment View

![Deployment diagram](deployment-view/deployment.puml)

**Why this deployment model was chosen.** See
[ADR-0003](adr/ADR-0003-docker-compose-deployment-on-vps.md) for the full
rationale: a single VPS running Docker Compose, with images built and
published by GitHub Actions to GHCR, matches the team's size and
operational capacity while still giving reproducible, versioned deploys
and automatic database migrations.

**How the current deployment supports/constrains the product.** nginx
terminates TLS and fronts both the static frontend build and the FastAPI
backend, giving one HTTPS entry point for students and admins alike
(supporting **QR-FE**, reachability of all public routes). Because the
backend, database, and Thumbor all sit on the same Compose network on one
host, the API can serve `GET /api/events` with low latency and no
cross-network hops (supporting **QR-PERF**). The constraint is that the
whole stack lives on one host: there is no redundancy, and a deploy causes
a brief window of unavailability rather than a zero-downtime rollout.

**What must be considered when deploying or operating it.** Deploys pull
pre-built images rather than building on the server, so a deploy is only
as reliable as the most recent CI build; Alembic migrations run
automatically on deploy, so schema changes must be backward-compatible
enough not to break a running container during the pull/restart window;
and TLS certificate renewal (Let's Encrypt) is a dependency the ops
process must keep working, since QR-FE assumes HTTPS reachability.

**What the diagram shows.** The path from a GitHub push through CI/CD to
GHCR, and from GHCR to the two application containers on the VPS; and
separately, the customer-facing request path from a browser through
nginx/TLS to either the static frontend or the backend API, with the
backend's internal-only connections to PostgreSQL and Thumbor.

---

## Architecture Decisions

| ADR | Decision | Related Quality Requirement(s) |
|-----|----------|-------------------------------|
| [ADR-0001](adr/ADR-0001-single-admin-jwt-authentication.md) | Single-admin JWT authentication for admin write endpoints | QR-SEC |
| [ADR-0002](adr/ADR-0002-pydantic-request-validation.md) | Validate all write requests with Pydantic schemas at the API boundary | QR-REL |
| [ADR-0003](adr/ADR-0003-docker-compose-deployment-on-vps.md) | Docker Compose deployment on a single VPS with GHCR-built images | QR-FE, QR-PERF |

These decisions are directly reflected in the Static View (Auth Module and
per-resource validation), the Dynamic View (the two guard-rail checks in
the publish-event flow), and the Deployment View (the VPS/Compose/GHCR
topology).
