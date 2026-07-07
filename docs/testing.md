# Testing Strategy

This document describes how the Student Union Portal is tested, which modules are
treated as critical, their coverage status, and the additional QA check the team
runs in CI. Tests are **maintained product assets**: later work must keep them
passing or replace them with documented equivalent-or-stronger coverage.

## Table of contents

- [Testing Strategy](#testing-strategy)
  - [Table of contents](#table-of-contents)
  - [Stack and tooling](#stack-and-tooling)
  - [Test types](#test-types)
    - [Unit tests](#unit-tests)
    - [Integration tests](#integration-tests)
    - [Frontend smoke tests](#frontend-smoke-tests)
  - [Critical modules and coverage](#critical-modules-and-coverage)
  - [Additional QA check: dependency vulnerability scan](#additional-qa-check-dependency-vulnerability-scan)
  - [Maintenance policy](#maintenance-policy)

## Stack and tooling

- **Backend:** Python / FastAPI, tested with [pytest](https://docs.pytest.org/),
  `pytest-asyncio` (async test support), `pytest-cov` (coverage), and FastAPI's
  `TestClient`.
- **Linting / formatting:** [Ruff](https://docs.astral.sh/ruff/) (`ruff check`,
  `ruff format --check`) in [`backend-lint.yml`](https://github.com/sweetlife999/SWP/blob/main/.github/workflows/backend-lint.yml).
- **Frontend:** ESLint + `tsc --noEmit` in
  [`frontend-lint.yml`](../.github/workflows/frontend-lint.yml).
- **Frontend smoke tests:** Playwright runs the public-route smoke suite in
  [`frontend/src/tests/smoke/`](../frontend/src/tests/smoke/) with mocked API
  responses and a Vite `webServer`.
- **Additional QA check:** [`pip-audit`](https://pypi.org/project/pip-audit/)
  dependency vulnerability scan (see [below](#additional-qa-check-dependency-vulnerability-scan)).

Test dependencies are pinned in
[`backend/requirements-dev.txt`](https://github.com/sweetlife999/SWP/blob/main/backend/requirements-dev.txt); pytest is
configured in [`backend/pyproject.toml`](https://github.com/sweetlife999/SWP/blob/main/backend/pyproject.toml)
(`asyncio_mode = "auto"`, an `integration` marker, and coverage source).

## Test types

### Unit tests

Pure logic, no database, fast and deterministic:

- [`tests/test_auth.py`](https://github.com/sweetlife999/SWP/blob/main/backend/tests/test_auth.py) — JWT issue/verify, expiry,
  forgery rejection (`none` algorithm), rate limiting. *(security-critical)*
- [`tests/test_schemas.py`](https://github.com/sweetlife999/SWP/blob/main/backend/tests/test_schemas.py) — request-model
  validation: bad input rejected, defaults applied, types parsed.
- [`tests/test_computed.py`](https://github.com/sweetlife999/SWP/blob/main/backend/tests/test_computed.py) — display helpers
  (department tags, date/time formatting, "is past", survey countdown).
- [`tests/test_config.py`](https://github.com/sweetlife999/SWP/blob/main/backend/tests/test_config.py) — settings load env
  overrides and sane defaults.

### Integration tests

Cross-component behaviour against the real app + a PostgreSQL database, via
`TestClient` (which runs the app lifespan and opens the DB pool):

- [`tests/test_integration_api.py`](https://github.com/sweetlife999/SWP/blob/main/backend/tests/test_integration_api.py) —
  events list returns 200; **admin write requires auth** (401); **`GET /events`
  latency** under budget; full **create → draft-hidden → publish → public →
  cleanup** flow. Marked `@pytest.mark.integration`; **skips** automatically when
  no database is reachable so the unit suite still runs offline.

Run them:

```bash
cd backend
pip install -r requirements-dev.txt
pytest -m "not integration"              # unit only, no DB needed
pytest --cov=app --cov-report=term-missing   # full suite (needs a DB for integration)
```

### Frontend smoke tests

Browser-level checks validate the core public and admin entry points from the
real frontend build, while stubbing API responses so the suite stays stable even
when the backend is offline.

- [`frontend/src/tests/smoke/home.test.ts`](../frontend/src/tests/smoke/home.test.ts) — home page loads, the `Student Union` heading is visible, and a department card opens the modal.
- [`frontend/src/tests/smoke/events.test.ts`](../frontend/src/tests/smoke/events.test.ts) — `/events` loads with at least one event card visible.
- [`frontend/src/tests/smoke/members.test.ts`](../frontend/src/tests/smoke/members.test.ts) — `/members` loads with at least one member card visible.
- [`frontend/src/tests/smoke/questionnaires.test.ts`](../frontend/src/tests/smoke/questionnaires.test.ts) — `/questionnaires` loads.
- [`frontend/src/tests/smoke/admin-login.test.ts`](../frontend/src/tests/smoke/admin-login.test.ts) — `/admin/login` shows the login form.

Run them:

```bash
cd frontend
npm run test:smoke
```

Notes:

- The suite uses HashRouter routes, so Playwright navigates with `/#/...`.
- [`frontend/playwright.config.ts`](../frontend/playwright.config.ts) starts Vite via `webServer`, so no manual frontend startup is needed.
- API fixtures live in [`frontend/src/tests/smoke/fixtures.ts`](../frontend/src/tests/smoke/fixtures.ts) and intercept `/api/*` calls.
- The smoke job runs in [`frontend-lint.yml`](../.github/workflows/frontend-lint.yml) and again in [`deploy.yml`](../.github/workflows/deploy.yml) before build and deploy.

## Critical modules and coverage

A module is **critical** when a defect in it has the highest impact: a security
breach, corrupted data, or the most-used read path failing. Each critical module
must keep **≥ 30%** automated line coverage (the Assignment 4 minimum).

| Critical module | Why critical | Line coverage | Status |
|---|---|---:|:---:|
| `app/auth.py` | Authentication / JWT — the security boundary | **98%** | ✅ |
| `app/models/schemas.py` | Input validation — every write passes through it | **100%** | ✅ |
| `app/computed.py` | Display/derivation logic shown on every page | **89%** | ✅ |
| `app/config.py` | App configuration and secrets loading | **100%** | ✅ |
| `app/routers/events.py` | Primary public read path + event admin writes | **67%** | ✅ |

All critical modules are above the 30% threshold. Global repository coverage is
**~56%**, which is lower than the per-critical-module figures because several
secondary routers (members, kanban, questionnaires admin) are exercised only
indirectly so far. Global coverage is intentionally allowed to be lower than the
critical-module bar; raising secondary-router coverage is tracked for the next
Sprint. Coverage is measured by `pytest-cov` and printed in the CI test job log.

## Additional QA check: dependency vulnerability scan

The required CI checks already cover linting, formatting, type-checking, build,
unit tests, integration tests, coverage, the automated QRTs, and link-checking.
The Assignment 4 **additional** QA check must be distinct from all of those.

- **Options considered:** `pip-audit` (Python dependency CVE scan), `bandit`
  (Python SAST), `npm audit` (frontend dependency scan), CodeQL (multi-language
  SAST), `hadolint` (Dockerfile linting).
- **Selected:** **`pip-audit`** on the backend dependencies.
- **QA objective / risk addressed:** known-vulnerable third-party packages
  (supply-chain risk). The backend handles authentication and stores
  questionnaire responses; a CVE in a dependency such as the JWT, web-framework,
  or database driver could expose data or allow bypass.
- **Why it matters here:** the team adds dependencies as the backend grows, and
  CVEs are disclosed continuously — a one-time manual check goes stale. Running
  `pip-audit` in CI turns "are our dependencies safe today?" into an automated
  gate instead of an assumption.
- **Where it runs:** the `audit` job in
  [`backend-tests.yml`](https://github.com/sweetlife999/SWP/blob/main/.github/workflows/backend-tests.yml), on every push and
  PR touching `backend/**`.
- **Limitations / deferred work:** `pip-audit` only covers Python dependencies
  and only *known* (published) CVEs — not the frontend `npm` tree and not
  zero-days or first-party logic flaws. Frontend `npm audit` and a SAST tool
  (bandit / CodeQL) are deferred to a later Sprint.

## Maintenance policy

- New product logic ships with the smallest test that fails if the logic breaks.
- The QRTs in [`quality-requirement-tests.md`](quality-requirement-tests.md) must
  keep passing; a change that invalidates one must update the QR and its QRT, not
  delete the test.
- If the product stack or critical modules change, update this document and the
  [Definition of Done](definition-of-done.md) accordingly.
