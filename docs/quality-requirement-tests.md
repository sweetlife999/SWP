# Quality Requirement Tests

Each quality requirement in [`quality-requirements.md`](quality-requirements.md)
has at least one **automated** quality requirement test (QRT). Most QRTs live in
the normal backend test location (`backend/tests/`), while the frontend smoke
QRT lives in `frontend/src/tests/smoke/`. They run in CI on every push and pull
request via the relevant workflow and fail the build if the measured property
regresses.

## Table of contents

- [QRT-SEC](#qrt-sec)
- [QRT-REL](#qrt-rel)
- [QRT-SMOKE](#qrt-smoke)
- [QRT-PERF](#qrt-perf)

| QRT | Verifies | Type | Location | Runs in CI |
|-----|----------|------|----------|-----------|
| [QRT-SEC](#qrt-sec) | [QR-SEC](quality-requirements.md#qr-sec--admin-write-endpoints-are-authenticated) | Unit + integration | `tests/test_auth.py`, `tests/test_integration_api.py` | `backend-tests.yml` |
| [QRT-REL](#qrt-rel) | [QR-REL](quality-requirements.md#qr-rel--invalid-input-is-rejected-not-stored-or-crashed-on) | Unit | `tests/test_schemas.py` | `backend-tests.yml` |
| [QRT-SMOKE](#qrt-smoke) | [QR-FE](quality-requirements.md#qr-fe--core-public-entry-points-stay-reachable) | Frontend smoke / Playwright | `frontend/src/tests/smoke/*.test.ts` | `frontend-lint.yml`, `deploy.yml` |
| [QRT-PERF](#qrt-perf) | [QR-PERF](quality-requirements.md#qr-perf--public-event-listing-is-fast) | Integration | `tests/test_integration_api.py` | `backend-tests.yml` |

> **Note on location.** Most QRTs live under `backend/tests/`, but the smoke QRT
> for the frontend public routes lives in `frontend/src/tests/smoke/` and runs
> via Playwright.

---

## QRT-SEC

- **Verifies:** [QR-SEC](quality-requirements.md#qr-sec--admin-write-endpoints-are-authenticated) — Security / Authenticity
- **Tests:**
  - [`tests/test_auth.py`](https://github.com/sweetlife999/SWP/blob/main/backend/tests/test_auth.py) — token round-trip, **expired** token rejected, garbage token rejected, **`none`-algorithm forgery rejected**, `require_admin(None)` → 401, login **rate limit** (5 allowed, 6th → 429), password check.
  - [`tests/test_integration_api.py::test_admin_write_requires_auth`](https://github.com/sweetlife999/SWP/blob/main/backend/tests/test_integration_api.py) — `POST /api/admin/events` **without a token** returns **401** against the running app + database.
- **Pass criteria:** every listed assertion holds. Any path that would accept an
  unauthenticated, expired, or forged token fails the build.

## QRT-REL

- **Verifies:** [QR-REL](quality-requirements.md#qr-rel--invalid-input-is-rejected-not-stored-or-crashed-on) — Reliability / Fault tolerance
- **Test:** [`tests/test_schemas.py`](https://github.com/sweetlife999/SWP/blob/main/backend/tests/test_schemas.py) — an unknown
  department tag raises `ValidationError`; a `>200`-answer questionnaire response
  is rejected; valid `HH:MM` times and dates parse to the correct typed values;
  documented defaults are applied. Because validation runs *before* the database
  layer, a rejected request can never persist a malformed row.
- **Pass criteria:** each malformed input raises a validation error; each
  well-formed input parses to the expected typed value.

## QRT-SMOKE

- **Verifies:** [QR-FE](quality-requirements.md#qr-fe--core-public-entry-points-stay-reachable) — Functional suitability / Functional completeness
- **Tests:**
  - [`frontend/src/tests/smoke/home.test.ts`](../frontend/src/tests/smoke/home.test.ts) — home page loads, the `Student Union` heading is visible, and a department card opens the modal.
  - [`frontend/src/tests/smoke/events.test.ts`](../frontend/src/tests/smoke/events.test.ts) — `/events` loads with at least one event card visible.
  - [`frontend/src/tests/smoke/members.test.ts`](../frontend/src/tests/smoke/members.test.ts) — `/members` loads with at least one member card visible.
  - [`frontend/src/tests/smoke/questionnaires.test.ts`](../frontend/src/tests/smoke/questionnaires.test.ts) — `/questionnaires` loads.
  - [`frontend/src/tests/smoke/admin-login.test.ts`](../frontend/src/tests/smoke/admin-login.test.ts) — `/admin/login` shows the login form.
- **Pass criteria:** every smoke test passes against the Vite-served frontend with mocked API responses. If any listed public route stops loading or its key element disappears, the build fails.

The smoke suite uses HashRouter routes (`/#/...`) and the fixtures in
[`frontend/src/tests/smoke/fixtures.ts`](../frontend/src/tests/smoke/fixtures.ts)
to keep the checks deterministic without a live backend. CI runs the suite in
[`frontend-lint.yml`](../.github/workflows/frontend-lint.yml) and again in
[`deploy.yml`](../.github/workflows/deploy.yml).

## QRT-PERF

- **Verifies:** [QR-PERF](quality-requirements.md#qr-perf--public-event-listing-is-fast) — Performance Efficiency / Time behaviour
- **Test:** [`tests/test_integration_api.py::test_get_events_latency`](https://github.com/sweetlife999/SWP/blob/main/backend/tests/test_integration_api.py) —
  warms the path, then measures 5 consecutive `GET /api/events` calls and asserts
  the **median** is **< 500 ms** with HTTP 200.
- **Pass criteria:** median latency under budget. A regression that pushes the
  primary read path over 500 ms fails the build.

> **Note on the integration QRTs.** `test_integration_api.py` is marked
> `@pytest.mark.integration` and needs a PostgreSQL database. In CI a Postgres
> service container is provided, so QRT-SEC (integration part) and QRT-PERF run
> for real. Locally, if no database is reachable, these tests **skip** rather than
> fail, so a developer can still run the unit suite offline.
