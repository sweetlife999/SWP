# Sprint 4 Retrospective

## What went well

1. **The backend is actually live.** The frontend now talks to the real FastAPI
   backend for events, members, kanban, and questionnaires — the API-stub data from
   Sprint 3 is gone. The full create → publish → view flow works end to end on the
   deployed site.
2. **Quality became automated and measurable.** We defined three quality
   requirements with distinct ISO/IEC 25010 sub-characteristics and backed each with
   an automated quality requirement test. A new CI job runs the unit + integration
   suite with coverage against a Postgres service, plus a `pip-audit` dependency
   scan — so the gates run on every push, not just before submission.
3. **We fixed the production outage at the root, not the symptom.** The backend
   failed to start under Python 3.12 and `/api` was down; beyond the hotfix we added
   an automatic migration runner so the production schema can no longer drift behind
   the code on deploy.

## What did not go well

1. **Coverage is uneven.** Critical modules are at 89–100% (auth, schemas, computed,
   config) and the events router at 67%, but secondary routers are only ~24–36%, so
   global coverage is ~56%. We prioritised the highest-impact modules, but the long
   tail remains thin.
2. **Quality automation is backend-only.** The frontend still has no automated
   tests beyond linting and type-checking; we ran out of Sprint to add a component
   or e2e layer.
3. **Production broke before we hardened it.** The outage and the manual schema
   patch needed to recover it ate time that the migration runner now prevents — but
   only after the fact. We were reactive, not proactive, on deploy reliability.

## What we changed compared to the previous Sprint

- We acted on the Sprint 3 retrospective action *"start backend integration in week
  1, not the final days"* — integration was the first thing this Sprint, which is
  why the increment is live rather than stubbed.
- We acted on *"verify env vars / run `docker compose up` locally before opening a
  backend PR"* — and went further by adding a Postgres-backed CI test job so the
  same checks run automatically, not just on someone's laptop.

## Action points for the next Sprint

1. Add an integration-test pass for the members and kanban routers to lift
   secondary-router coverage while keeping critical modules ≥ 30%.
2. Introduce a second automated QA check on the frontend side (`npm audit`) and
   evaluate a SAST tool (bandit / CodeQL) so quality automation is not
   backend-only.
