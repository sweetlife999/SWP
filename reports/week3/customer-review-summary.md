# Customer Review Summary — Sprint 3

**Date:** 2026-06-20
**Participants:** Iaroslav Moskvin (Team Lead), Dmitrii Malofeev, Zakhar Gurtovoi, Alisa Kondakova (team); Valerii [redacted] (customer)
**Format:** Video call

---

## Artifacts demonstrated

- Live deployment: [https://su.fblrkus.ru](https://su.fblrkus.ru)
- Product Backlog board: [SU SWP Project](https://github.com/users/sweetlife999/projects/2)
- Sprint 3 milestone: [Sprint 3 — MVP v1](https://github.com/sweetlife999/SWP/milestone/1)

---

## Scope reviewed

The team walked through the Sprint 3 deliverables:

**Done:**
- Events browsing (US-01)
- Member directory with department filter (US-05)
- Departments overview (US-08)
- Questionnaire management and results viewer for admin (US-13, US-14)
- Admin authentication via `/admin/login`
- Database schema and migrations (PostgreSQL)
- Backend API endpoints implemented (not yet connected to frontend)

**In progress / in review at time of meeting:**
- Questionnaire filling for students (US-12) — in progress
- Admin inline content editing — in progress
- Event publishing via admin UI (US-11) — in review (open PR)
- Kanban board frontend integration — not started; customer confirmed this is optional ("план максимум")

---

## Implemented progress discussed

The team explained that the backend API and database are fully implemented but not yet connected to the frontend — the site currently serves mock data. All endpoints are ready; the remaining work is merging open PRs and wiring the frontend to the live API in Sprint 4.

The customer requested a live demo of the site and confirmed it matched expectations.

**Database schema:** The team asked for approval of the decision to store survey answers as JSON in PostgreSQL. Customer approved: *"Отлично, отлично. По-другому у вас же не реляционная база данных — это самый эффективный вариант."*

**Admin panel access:** Confirmed — no visible login button on the public site; admin accesses the panel by navigating directly to `/admin`, which redirects to `/admin/login`. Customer confirmed this is the correct approach.

**JWT tokens:** Single-admin token, not role-based. Customer acknowledged and accepted; noted it will be relevant to review during Sprint 4 integration.

**Previous feedback (from Assignment 2 / prior meeting):** Customer confirmed all previously requested changes were implemented. *"Если вы исправили все, что сказала Аня — если вы все исправили, то отлично, молодцы."*

---

## Customer feedback

- Kanban board is a "plan maximum" — acceptable if not fully implemented
- Backlog tasks are well-chosen: *"Задачки хорошо выбраны, их нужно делать"*
- Customer will be more actively involved in Sprint 4 integration work
- Content for the site (member profiles, SU history, events) will be provided by Alyona [redacted] within approximately one week; team to send a content request list in chat

---

## Approvals / requested changes

**MVP v1 progress: APPROVED**

Customer gave explicit verbal approval of the current MVP v1 progress:
- Frontend: approved
- User stories completed to date: approved
- Database schema (JSON for survey answers): approved
- Admin login flow (URL-based, no public button): approved

No scope changes requested. No items removed or reprioritised.

---

## Risks and action points

| Action | Owner | When |
|--------|-------|------|
| Send content request list (members, history, events, donate link) to customer in chat | Team | Today |
| Provide site content (member data, SU history, descriptions) | Alyona [redacted] / customer | ~next week |
| Merge open PRs (US-11, US-12, inline editing) | Team | Sprint 4 start |
| Connect backend API to frontend (replace mock data) | Team | Sprint 4 |
| Review JWT implementation with customer during Sprint 4 | Team + customer | Sprint 4 |
