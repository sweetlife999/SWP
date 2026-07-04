# ADR-0003: Deploy via Docker Compose on a Single VPS with GHCR-Built Images

- **Status:** Accepted
- **Date:** 2026-07-04
- **Related Quality Requirements:**
  [QR-FE](../../quality-requirements.md#qr-fe--core-public-entry-points-stay-reachable),
  [QR-PERF](../../quality-requirements.md#qr-perf--public-event-listing-is-fast)

## Context

The portal is used by Innopolis University students and SU:Core admins —
a moderate, predictable traffic pattern, not internet-scale. The team is
small, has no dedicated ops engineer, and needs the site to stay reachable
(QR-FE: home page, events, members, questionnaires, admin login all render)
and fast (QR-PERF: median `GET /api/events` < 500ms). A production
incident already occurred once (backend failed to start under Python
3.12), so deploy reliability and fast recovery matter more than horizontal
scalability right now.

## Decision

- Build frontend and backend Docker images in GitHub Actions on every push
  to `main` that touches `frontend/`, `backend/`, or `compose.yml`, and
  push them to GitHub Container Registry (GHCR)
- A single VPS runs the stack via `docker compose`: nginx (reverse proxy +
  TLS via Let's Encrypt) in front of the frontend static build and the
  FastAPI backend container, with PostgreSQL and Thumbor as sibling
  containers on the same Compose network
- Deploy is a pull-based update: the VPS runs
  `docker compose pull && docker compose up -d`, and database migrations
  (Alembic) run automatically on deploy so schema drift can't strand a
  release

## Consequences

**Positive**
- Minimal operational surface for a student team; one host to reason
  about, one `compose.yml` describing the whole runtime topology
- GHCR + CI build gives reproducible, versioned images instead of
  building on the server
- Automatic migrations removed a whole class of "forgot to migrate"
  production incidents
- Straightforward to verify against QR-FE (smoke suite hits the live
  routes) and QR-PERF (latency measured against the deployed stack)

**Negative / trade-offs**
- Single VPS is a single point of failure: no redundancy, and
  `docker compose up -d` causes brief downtime during deploy rather than
  a zero-downtime rolling update
- Vertical-only scaling — if traffic grows meaningfully, the current setup
  would need to move to a multi-node or managed platform
- Acceptable at current scale and consistent with the team's operational
  capacity; should be revisited if the customer's usage or availability
  expectations grow

## Alternatives Considered

- **Kubernetes cluster** — rejected: operational overhead is disproportionate
  to team size and current traffic; would slow delivery without a
  corresponding reliability need today.
- **Managed PaaS (e.g., Render, Railway, Fly.io)** — rejected for now:
  less control over the VPS's existing nginx/TLS setup and networking, and
  would mean re-plumbing an already-working deploy pipeline mid-project.
- **Serverless functions for the backend** — rejected: FastAPI backend is
  stateful in practice (persistent DB connections, Alembic migrations,
  Thumbor integration) and doesn't map cleanly onto a serverless execution
  model without significant rework.
