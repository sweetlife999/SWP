# Quality Requirement Tests

Each quality requirement in [`quality-requirements.md`](quality-requirements.md)
has at least one **automated** quality requirement test (QRT). All QRTs live in
the normal backend test location (`backend/tests/`), run in CI on every push and
pull request via [`backend-tests.yml`](https://github.com/sweetlife999/SWP/blob/main/.github/workflows/backend-tests.yml),
and fail the build if the measured property regresses.

| QRT | Verifies | Type | Location | Runs in CI |
|-----|----------|------|----------|-----------|
| [QRT-SEC](#qrt-sec) | [QR-SEC](quality-requirements.md#qr-sec--admin-write-endpoints-are-authenticated) | Unit + integration | `tests/test_auth.py`, `tests/test_integration_api.py` | `backend-tests.yml` |
| [QRT-REL](#qrt-rel) | [QR-REL](quality-requirements.md#qr-rel--invalid-input-is-rejected-not-stored-or-crashed-on) | Unit | `tests/test_schemas.py` | `backend-tests.yml` |
| [QRT-PERF](#qrt-perf) | [QR-PERF](quality-requirements.md#qr-perf--public-event-listing-is-fast) | Integration | `tests/test_integration_api.py` | `backend-tests.yml` |

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
