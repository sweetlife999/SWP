# ADR-0002: Validate All Write Requests with Pydantic Schemas at the API Boundary

- **Status:** Accepted
- **Date:** 2026-07-04
- **Related Quality Requirements:** [QR-REL](../../quality-requirements.md#qr-rel--invalid-input-is-rejected-not-stored-or-crashed-on)

## Context

Earlier in the project, malformed input reached the database or crashed
request handling: an edge-case survey response blanked an entire page, and
invalid event times silently failed to persist instead of being rejected.
QR-REL requires that 100% of requests violating a documented constraint
(unknown department tag, non-`HH:MM` time, a questionnaire response with
more than 200 answers, etc.) are rejected with `422`, and that 0% of them
mutate stored data or raise an unhandled `500`.

We needed a validation strategy enforced consistently across all write
endpoints (events, members, kanban, questionnaires) rather than ad hoc,
per-handler checks.

## Decision

Define the validation contract as Pydantic models in
`app/models/schemas.py` (`EventCreate`, `MemberCreate`,
`SurveyResponseBody`, etc.) and validate every write request against them
**before** any router logic touches the database. FastAPI's built-in
request parsing surfaces schema violations automatically as `422`
responses with structured error detail, so no handler can accidentally
skip validation and reach the database with bad data.

Field-level constraints are declared on the schema itself — enums for
department tags, a regex/pattern for `HH:MM` time fields, a max-length
constraint (200) on questionnaire answers — rather than checked manually
inside each endpoint function.

## Consequences

**Positive**
- Single, centralized place to reason about "what is a valid request" per
  resource, instead of scattered manual checks
- Consistent `422` error contract the frontend can rely on for form
  validation feedback
- Directly testable: `test_schemas.py` covers the schemas at 100% line
  coverage, and `test_integration_api.py` verifies end-to-end rejection
  behavior

**Negative / trade-offs**
- Schemas must be kept in sync with the database models (Alembic
  migrations) by hand; a schema/DB drift could let something pass
  validation but still fail at the DB layer
- Only guards shape/format-level correctness — it does not prevent
  business-logic errors that are schema-valid but semantically wrong
  (e.g., an event end time before its start time would need an explicit
  cross-field validator, tracked separately from this ADR)

## Alternatives Considered

- **Database constraints as the only guard** — rejected: a bad request
  could still reach the DB layer and surface as an unhandled `500` instead
  of a clean `422`, which is exactly the failure mode QR-REL exists to
  prevent.
- **Manual per-endpoint validation code** — rejected: inconsistent
  coverage in the past is what caused the original regressions; hard to
  guarantee 100% enforcement across every write path.
- **Client-side validation only** — rejected: does not protect the API
  from direct/hostile requests bypassing the frontend.
