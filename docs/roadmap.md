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

## Sprint 4 — Backend Integration

**Dates:** 2026-06-22 – 2026-06-28
**Goal:** Connect FastAPI to the frontend — replace API stubs with live endpoints, implement auth middleware and admin JWT.

- FastAPI base: auth middleware, admin JWT
- Responsive layout: mobile and tablet breakpoints (#38)

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
