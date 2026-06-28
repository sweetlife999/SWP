# Customer Review Summary — Sprint 4

**Date:** 2026-06-27
**Participants:** Iaroslav M. (Team Lead), Dmitrii M. (Fullstack), Zakhar G. (DevOps), Olga F. (Frontend), Alisa K. (Frontend); Valerii (Customer), Anya (Customer)
**Format:** Video call (recording permission asked before recording started: yes)

---

## Artifacts demonstrated

- Live deployment: [https://su.fblrkus.ru](https://su.fblrkus.ru)
- Sprint 4 milestone: [Sprint 4 - Refining product](https://github.com/sweetlife999/SWP/milestone/3)
- Product / Sprint board: [SU SWP Project](https://github.com/users/sweetlife999/projects/2)
- `CHANGELOG.md`, quality docs, and CI runs

## Sprint Goal reviewed

Make the increment reliable and verifiable: connect the frontend to the live
FastAPI backend, respond to customer feedback, and enforce measurable quality gates
(automated tests, QRTs, coverage, dependency audit) in CI.

## Delivered increment discussed

- Frontend now works against the live backend: events (create/publish/edit details),
  members (with photo upload via Thumbor), questionnaires (build → publish → fill →
  results), kanban board (create/move/edit).
- Production restored (Python 3.12 startup fix) and automatic migrations on deploy.
- Quality automation: QR-SEC / QR-REL / QR-PERF with automated QRTs, backend
  unit + integration tests, critical-module coverage ≥ 30%, CI test job + `pip-audit`.

## UAT results (customer-executed)

| UAT scenario | Result | Notes |
|---|---|---|
| [UAT-01 Publish an event](../../docs/user-acceptance-tests.md#uat-01--publish-an-event) | Passed | Admin created and published an event; it appeared on the public page. Customer confirmed events work. |
| [UAT-02 Add a member with a photo](../../docs/user-acceptance-tests.md#uat-02--add-a-team-member-with-a-photo) | Passed | Admin can add members. Customer requested: replace delete button with edit, add status/role field. |
| [UAT-03 Create, publish & fill a questionnaire](../../docs/user-acceptance-tests.md#uat-03--create-publish-and-fill-a-questionnaire) | Passed | Admin created and published a questionnaire; student can fill it; CSV/Excel export works. |

## Quality evidence discussed

- Performance: pages load quickly with skeleton loaders; customer saw no delays
- Confidentiality: admin panel is visible only for debugging — will be hidden in production
- Usability: customers navigated the site without assistance; found it intuitive
- CI/CD: automated tests, QRTs, and dependency audit are running in CI

**Customer reaction:** Positive. Both Valerii and Anya confirmed the product works as expected.

## Customer feedback

| Feedback | Response |
|----------|----------|
| Remove age, format, location fields from events | Agreed — will be removed (age defaults to 0+) |
| Replace delete with edit on Members page | Agreed — will add edit functionality and status/role field |
| QR code should be large and centered on Donations page | Agreed — will be fixed |
| Last 4 events should appear in updates section on main page | Agreed — will implement |
| Rename/merge admin tabs (Forms + Responses → Manage Questionnaires) | Agreed — will rename and merge |
| Add banner/description on main page | Agreed — will add a short, impactful SU description |
| Keep only one Kanban board (SU Core) | Confirmed — no change needed |
| Don't track completed questionnaires (stay anonymous) | Confirmed — no change needed |

## Approvals / requested changes

Product increment accepted by the customer.

**Requested changes (non-blocking):**
- Replace delete button with edit on Members page
- Rename/merge admin tabs
- Add banner on main page
- Show last 4 events on main page
- Remove age/format/location fields from events
- Center QR code on Donations page

## Risks and action points

**Risks:**

| Risk | Mitigation |
|------|------------|
| Customer content (member profiles, event details, SU history) still not provided | Chase customer; use placeholders; don't block development |
| Scope creep — too many small UI changes requested in one session | Prioritise by impact; defer non-critical to Sprint 5+ |
| CI/CD may fail after merging new changes | Run tests locally before merge; monitor CI logs |
| Removing age/format/location fields may break existing events | Write migration; test on staging before prod |
| Admin panel hiding might break if not tested properly | Test with and without admin login; ensure no accidental exposure |

**Action points:**

| Action | Owner | When |
|--------|-------|------|
| Add banner and description to main page | Frontend team | Sprint 5 |
| Show last 4 events in updates section | Frontend team | Sprint 5 |
| Replace delete button with edit on Members page | Frontend team | Sprint 5 |
| Remove age/format/location fields from events | Backend team | Sprint 5 |
| Rename/merge admin tabs | Frontend team | Sprint 5 |
| Enlarge and center QR code on Donations page | Frontend team | Sprint 5 |

## Resulting Product Backlog changes

- New PBI created: "Replace delete with edit on Members page" — added to Sprint 5 backlog
- New PBI created: "Add banner/description on main page" — added to Sprint 5 backlog
- New PBI created: "Show last 4 events in updates section" — added to Sprint 5 backlog
- New PBI created: "Remove age/format/location fields from events" — added to Sprint 5 backlog
- New PBI created: "Rename/merge admin tabs (Forms + Responses)" — added to Sprint 5 backlog
- New PBI created: "Enlarge and center QR code on Donations page" — added to Sprint 5 backlog
- Existing PBI updated: "Members page: replace delete with edit" — clarified scope