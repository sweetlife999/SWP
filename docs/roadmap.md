# Product Roadmap

## Sprint 1 — Foundation

**Dates:** 2026-06-01 – 2026-06-07
**Goal:** Set up repository, CI/CD, design system, and deploy a static shell of the portal.

- Repository structure, branch protection, PR/issue workflow
- Docker + GitHub Actions deploy pipeline
- Frontend scaffold (React + Vite + TypeScript)
- Design system: layout, typography, colour tokens

---

## Sprint 2 — Core Content

**Dates:** 2026-06-08 – 2026-06-14
**Goal:** Deliver the public-facing informational pages — Events, Members, Departments, Donations — with realistic content.

- Events page (US-01)
- Member directory (US-05)
- Department overview (US-08)
- Donations info page (US-04)
- CI: ESLint + TypeScript type-check

---

## Sprint 3 — MVP v1

**Dates:** 2026-06-15 – 2026-06-21
**Goal:** Ship a usable MVP v1 and lay the backend foundation: students can browse events, fill out questionnaires; admin can publish events and manage surveys; DB schema designed and backend project scaffolded.

- Admin login and authentication
- Admin inline content editing
- Publish and manage events — admin (US-11)
- Questionnaire viewer for students (US-12)
- Form builder + results viewer for admin (US-13)
- SU:Core Kanban board (US-10)
- API stub layer
- Database schema and migrations
- Backend setup: stack, project structure, dev environment
- Sprint Review with customer

---

## Sprint 4 — Integration, Quality & Automation

**Dates:** 2026-06-22 – 2026-06-28
**Goal:** Make the increment *reliable and verifiable*: connect the frontend to the live FastAPI backend, respond to customer feedback, and put measurable quality gates (automated tests, quality requirement tests, coverage, dependency audit) in CI.

**Product integration:**
- Events → live API with loading/error/empty states
- Members → live API with department filter and photos via Thumbor
- Kanban → persisted moves/edits with optimistic update + rollback
- Admin panel: events & members management
- Questionnaires: build → publish → fill → view results / export
- Editable event detail (schedule, organizers, location, format, age)
- Export to XLSX
- Error skeletons everywhere

**Reliability / ops:**
- Fix backend startup under Python 3.12 and restore `/api` in production
- Automatic database migrations on every deploy (migration runner)

**Quality & automation (maintained gates):**
- Quality requirements: QR-SEC, QR-REL, QR-PERF
- Automated QRTs
- Backend unit + integration tests, critical-module coverage ≥ 30%
- CI: `backend-tests.yml` (pytest + coverage + Postgres) and `pip-audit`
- Updated Definition of Done

---

## Sprint 5 — MVP v2 (Architecture, Feedback & Enhancements)

**Dates:** 2026-06-29 – 2026-07-05
**Goal:** Deliver MVP v2 with architectural documentation, development process formalisation, ADRs, hosted docs, and selected customer feedback from Sprint 4.

**Product fixes & improvements:**
- Fix redirect to `/admin/login` when not changing nav and token expiration (#79)
- Fix navlink to admin member page (#77)
- Fix lint issues across the codebase

**Customer feedback (from Sprint 4 review):**
- Replace delete with edit on Members page — add status/role field
- Add banner/description on main page
- Show last 4 events in updates section
- Remove age/format/location fields from events
- Rename/merge admin tabs (Forms + Responses → Manage Questionnaires)
- Enlarge and center QR code on Donations page

**Architecture & Documentation:**
- `docs/architecture/README.md` with Static, Dynamic, Deployment views
- 3 ADRs (React, FastAPI, PostgreSQL)
- `docs/development-process.md` with Mermaid gitGraph
- Hosted documentation site (GitHub Pages)

**Quality & Testing:**
- Maintain all Assignment 4 quality gates
- 2 new UAT scenarios for MVP v2
- Update `docs/user-acceptance-tests.md` with Sprint 5 results

**Release:**
- MVP v2 release (v0.3.0)
- Public sanitized demo video (< 2 min)
- Sprint Review with customer

---

## Sprint 6 — MVP v2.2.0 (Week 6 Trial Release & Transition Readiness)

**Dates:** 2026-07-06 – 2026-07-12
**Goal:** Deliver a stable trial release, fix bugs identified by the customer, remove the remaining mock authentication, and prepare the product for handover.

**Delivered:**
- Removed the last mock authentication; admin endpoints run on the real JWT flow (ADR-0001) end-to-end
- Fixed member card bugs: photo size, orientation, and add-member button positioning
- Added photo upload support for multiple formats, sizes, and GIFs
- Added a separate SU:Support department for the CEO and assistant
- Added a draft system for events (create and save before publishing)
- Removed duplicate "Manage Events" button on mobile
- Removed the confusing statistics table on the Questionnaires page; added a pie-graph results view
- Enforced Pydantic request validation ahead of database writes (XSS/input-validation fixes)
- Stabilized the CI/CD deploy pipeline
- Swagger API documentation made available
- Release: `v2.2.0` (Week 6 trial / handover-candidate release)
- Customer trial and transition-readiness meeting held; increment accepted by the customer

---

## Sprint 7 — MVP v3 (Final Transition & Delivery)

**Dates:** 2026-07-13 – 2026-07-19
**Goal:** Respond to Week 6 customer trial feedback, complete follow-up maintenance, finish the customer handover, and deliver the final course version, `MVP v3`.

- Clean up accumulated SQL migrations before final handover
- Complete or remove the "live" event-status logic on the events page
- Rename the "Support" department to the name agreed with the customer
- Full UI consistency audit across home, events, members, questionnaires, and admin pages
- Bring the mobile version to a usable, consistent state
- Finalize handover documentation (Swagger reference, run instructions, codebase overview) in `docs/customer-handover.md`
- Complete the final repository/product transfer to the customer
- Final transition confirmation with the customer and stated handover level
- Release: `MVP v3`, mapped to a final SemVer tag with higher precedence than `v2.2.0`
- Public sanitized demo video for `MVP v3`

---

This is the final sprint of the course. `MVP v3` is the last delivered version; no further versions are planned beyond it.
