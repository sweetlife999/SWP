# Reflection — Week 4

## Learning points

- **Quality is cheaper to enforce than to assume.** Writing the three quality
  requirements (QR-SEC, QR-REL, QR-PERF) forced us to state quality in measurable
  terms — "100% of admin writes without a valid token return 401", "median
  `GET /events` < 500 ms" — instead of vague "it should be secure / fast". Once a
  requirement is a number, an automated test can guard it.
- **Authentication is the highest-leverage thing to test.** The portal has a single
  privileged role that can change everything students see. Testing token expiry,
  the `none`-algorithm forgery, and login rate limiting found the edge cases that a
  happy-path manual demo never exercises.
- **Integration tests need a database, and CI can provide one.** We learned to run a
  Postgres service container in GitHub Actions and apply our migration SQL before
  the test step, so the integration QRTs (auth-required, latency, create→publish
  flow) actually execute in CI rather than skipping.
- **Tests reveal design smells.** The create→publish integration test failed on a
  second run because it left data behind; making it idempotent (unique title +
  cleanup) was a small but real lesson in writing tests that don't depend on a
  clean database.
- **Responding to customer feedback is a backlog activity, not an afterthought.**
  Mapping each feedback point to a PBI and a status made it obvious what was done,
  what was deferred, and why.

## Validated assumptions

- **Confirmed:** the JSON/JSONB approach for questionnaire answers (approved by the
  customer in Sprint 3) holds up — validation at the Pydantic boundary
  (`SurveyResponseBody` capped at 200 answers) keeps malformed payloads out of the
  database, verified by QRT-REL.
- **Confirmed:** automatic migrations on deploy fixed the recurring production
  drift — the prod schema no longer lags behind the code after a merge.
- **Rejected:** "the backend is fine, it just isn't wired up" — in fact the backend
  did not start under Python 3.12 (shadowed `date`/`time` fields) and `/api` was
  effectively down in production. Bringing the frontend online surfaced this.
- **Confirmed:** critical-module coverage is achievable quickly by testing the pure
  modules first (`auth`, `schemas`, `computed`, `config` reached 89–100%) before the
  DB-backed routers.

## Friction and gaps

- **Coverage is uneven.** Critical modules are well above the 30% bar, but secondary
  routers (members, kanban, questionnaires-admin) are only exercised indirectly, so
  global coverage sits around 56%. Raising secondary-router coverage is deferred.
- **Frontend has no automated tests yet.** Quality automation this Sprint is
  backend-focused; the frontend relies on ESLint + type-check. A component/e2e layer
  is future work (and E2E is owned by other team members).
- **Some product polish is deferred** (tracked in the team's internal follow-ups):
  member photo aspect-ratio distortion in the modal, optional BlockNote editor, a
  full legacy kanban port, and curated "related events".
- **The additional QA check is narrow.** `pip-audit` covers Python dependencies and
  only known CVEs — not the frontend `npm` tree and not first-party logic flaws.

## Planned response

- Add a `members` / `kanban` router integration test pass next Sprint to lift
  secondary-router coverage; keep critical modules ≥ 30% as a hard gate.
- Extend the additional QA check toward the frontend (`npm audit`) and a SAST tool
  (bandit / CodeQL) in a later Sprint — see [`docs/testing.md`](../../docs/testing.md).
- Feed UAT and Sprint Review findings back into the Product Backlog and the
  [customer feedback table](README.md#customer-feedback-response) and
  [roadmap](../../docs/roadmap.md).
- Keep the Assignment 4 gates (tests, QRTs, coverage, audit) enforced via the
  updated [Definition of Done](../../docs/definition-of-done.md).
