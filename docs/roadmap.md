# Product Roadmap

## Sprint 1 — Foundation

**Dates:** 2026-06-01 – 2026-06-07
**Goal:** Set up repository, CI/CD, design system, and deploy a static shell of the portal.
**Milestone:** Sprint 1 *(milestone TBD)*

- Repository structure, branch protection, PR/issue workflow
- Docker + GitHub Actions deploy pipeline (#34)
- Frontend scaffold (React + Vite + TypeScript)
- Design system: layout, typography, colour tokens

---

## Sprint 2 — Core Content

**Dates:** 2026-06-08 – 2026-06-14
**Goal:** Deliver the public-facing informational pages — Events, Members, Departments, Donations — with realistic content.
**Milestone:** [Sprint2](https://github.com/sweetlife999/SWP/milestone/2)

- Events page (US-01, #15)
- Member directory (US-05, #19)
- Department overview (US-08, #21)
- Donations info page (US-04, #16)
- CI: ESLint + TypeScript type-check (#31)

---

## Sprint 3 — MVP v1

**Dates:** 2026-06-15 – 2026-06-21
**Goal:** Ship a usable MVP v1 and lay the backend foundation: students can browse events, fill out questionnaires; admin can publish events and manage surveys; DB schema designed and backend project scaffolded.
**Milestone:** [Sprint 3 — MVP v1](https://github.com/sweetlife999/SWP/milestone/1)

- Admin login and authentication (#30)
- Admin inline content editing (#32)
- Publish and manage events — admin (US-11, #35)
- Questionnaire viewer for students (US-12, #25)
- Form builder + results viewer for admin (US-13, #24)
- SU:Core Kanban board (US-10, #23)
- API stub layer (#29)
- Database schema and migrations (#43)
- Backend setup: stack, project structure, dev environment (#41)
- Sprint Review with customer

---

## Sprint 4 — Integration, Quality & Automation

**Dates:** 2026-06-22 – 2026-06-28
**Milestone:** [Sprint 4 - Refining product](https://github.com/sweetlife999/SWP/milestone/3)
**Goal:** Make the increment *reliable and verifiable*: connect the frontend to the
live FastAPI backend, respond to customer feedback, and put measurable quality
gates (automated tests, quality requirement tests, coverage, dependency audit) in
CI so quality is enforced, not assumed.

**Product integration**
- Events page → live API with loading/error/empty states (US-01, #40)
- Members directory → live API with department filter and photos via Thumbor (US-05, #39)
- Kanban board → persisted moves/edits with optimistic update + rollback (US-10, #46)
- Admin panel: events & members management, fixed admin endpoints (US-11, #44)
- Questionnaires: build → publish → fill → view results / export (US-13, US-14, #26)
- Editable event detail (schedule, organizers, location, format, age)

**Reliability / ops**
- Fix backend startup under Python 3.12 and restore `/api` in production
- Automatic database migrations on every deploy (migration runner)

**Quality & automation (maintained gates)**
- Quality requirements: [`docs/quality-requirements.md`](quality-requirements.md) — QR-SEC, QR-REL, QR-PERF
- Automated QRTs: [`docs/quality-requirement-tests.md`](quality-requirement-tests.md)
- Backend unit + integration tests, critical-module coverage ≥ 30% ([`docs/testing.md`](testing.md))
- CI: `backend-tests.yml` (pytest + coverage + Postgres) and `pip-audit` dependency scan
- Updated [Definition of Done](definition-of-done.md) requiring tests, QRTs, coverage, and test evidence

> These quality gates are **maintained assets**: every later Sprint must keep them
> passing or replace them with documented equivalent-or-stronger coverage.

---

## Sprint 5 — Enhancements

**Dates:** TBD
**Goal:** Deliver Should Have stories and close remaining customer feedback.

- Photo gallery / media links (US-03)
- Questionnaire result export to XLSX (US-14)
- Feedback form (US-06)
- Anonymous survey enforcement (US-07)

---

## Sprint 6 — Integrations (if time permits)

**Dates:** TBD
**Goal:** Could Have integrations if the team has velocity.

- Telegram channel sync (US-15)
