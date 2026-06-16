# Product Roadmap

## Sprint 1 — Foundation

**Dates:** 2026-05-26 – 2026-06-01
**Goal:** Set up repository, CI/CD, design system, and deploy a static shell of the portal.
**Milestone:** Sprint 1 *(milestone TBD)*

- Repository structure, branch protection, PR/issue workflow
- Docker + GitHub Actions deploy pipeline
- Frontend scaffold (React + Vite + TypeScript)
- Design system: layout, typography, colour tokens

---

## Sprint 2 — Core Content

**Dates:** 2026-06-02 – 2026-06-08
**Goal:** Deliver the public-facing informational pages — Events, Members, Departments, Donations — with realistic content.
**Milestone:** Sprint 2 *(milestone TBD)*

- Events page (US-01)
- Member directory (US-05)
- Department overview (US-08)
- Donations info page (US-04)
- Admin login (supporting infrastructure for US-11/13)

---

## Sprint 3 — MVP v1 *(current)*

**Dates:** 2026-06-09 – 2026-06-21
**Goal:** Ship a usable MVP v1: students can browse events, members, and departments; fill out active questionnaires; and the admin can publish events and manage surveys through the portal.
**Milestone:** [Sprint 3 — MVP v1](https://github.com/sweetlife999/SWP/milestone/1)

- Admin inline editing for all content pages (US-11)
- Questionnaire viewer for students (US-12)
- Form builder + results viewer for admin (US-13)
- SU:Core Kanban board (US-10)
- API stub layer → FastAPI integration groundwork
- Sprint Review with customer

---

## Sprint 4 — Backend Integration

**Dates:** TBD
**Goal:** Replace frontend stubs with a live FastAPI backend; persist all content to a database.

- FastAPI + PostgreSQL backend
- Auth middleware (admin JWT)
- CRUD endpoints for events, members, surveys, content blocks
- End-to-end tests

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
