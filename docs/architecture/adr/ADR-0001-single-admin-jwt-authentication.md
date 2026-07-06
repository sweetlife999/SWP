# ADR-0001: Single-Admin JWT Authentication for Admin Write Endpoints

- **Status:** Accepted
- **Date:** 2026-07-04
- **Related Quality Requirements:** [QR-SEC](../../quality-requirements.md#qr-sec--admin-write-endpoints-are-authenticated)

## Context

The Student Union Portal has exactly one privileged role: the SU:Core admin,
who publishes events, manages members, edits kanban cards, and manages
questionnaires. Every state-changing admin endpoint (`/api/admin/**`) must
reject any caller that isn't that admin. There is currently no requirement
for multiple admin roles or per-department permissions — the customer has
not asked for this, and Assignment 4 feedback explicitly deferred
role-based access.

We needed an authentication mechanism that:
- Works cleanly with a React SPA calling a separate FastAPI backend
- Is simple enough for a small student team to implement and verify
- Can be tested to the 100%-rejection bar required by QR-SEC (no token,
  malformed token, expired token, or a token forged with `alg: none`
  must all return 401), plus login-brute-force protection (429 after 5
  failed attempts/IP)

## Decision

Implement a single-admin JWT scheme in `app/auth.py`:
- Admin logs in with credentials, backend issues a signed JWT
  (fixed algorithm, no algorithm negotiation, so `none`-alg forgeries are
  rejected outright)
- Every `/api/admin/**` write endpoint validates the JWT signature and
  expiry via a shared dependency before any handler logic runs
- Missing, malformed, expired, or forged tokens return `401` before any
  read/write touches the database
- The login endpoint rate-limits by IP: the 6th failed attempt within the
  window returns `429`

There is only one admin identity; the token does not encode roles or
scopes.

## Consequences

**Positive**
- Small, auditable surface area — one code path to test against QR-SEC
- No session storage needed on the backend; stateless and simple to scale
  behind nginx
- Meets the QR-SEC response measure directly and is straightforward to
  cover with unit + integration tests (see `test_auth.py`,
  `test_integration_api.py`)

**Negative / trade-offs**
- Not extensible to multiple admins or roles without a redesign (adding a
  `role`/`scope` claim, per-endpoint authorization checks, and a user
  table instead of a single hardcoded/seeded admin)
- No token revocation mechanism before expiry (acceptable at current
  scale; would need a blocklist or short-lived tokens + refresh if this
  becomes a concern)

## Alternatives Considered

- **OAuth2 / third-party identity provider** — rejected as disproportionate
  overhead for a single internal admin account.
- **Server-side session cookies** — rejected due to added CORS/CSRF
  complexity for a separately-hosted SPA, with no real benefit over JWT
  at this scale.
- **Role-based access control (RBAC) now** — rejected as premature; no
  current requirement for multiple roles. Revisit if the customer requests
  it (already logged as a deferred item).
