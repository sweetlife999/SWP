# Customer Review Summary — Sprint 5 (MVP v2)

**Date:** 2026-07-04
**Participants:** Iaroslav M. (Team Lead), Dmitrii M. (Fullstack), Zakhar G. (DevOps), Olga F. (Frontend), Alisa K. (Frontend); Valerii (Customer), Anya (Customer)
**Format:** Video call (recording permission asked before recording started: yes)

---

## Artifacts demonstrated

- Live deployment: [https://su.fblrkus.ru](https://su.fblrkus.ru)
- Sprint 5 milestone: Sprint 5 — MVP v2
- Product / Sprint board: [SU SWP Project](https://github.com/users/sweetlife999/projects/2)
- `docs/architecture/README.md`, ADRs, `docs/development-process.md`
- Hosted documentation site: [GitHub Pages](https://sweetlife999.github.io/SWP/)

---

## Sprint Goal reviewed

Deliver MVP v2 with architectural documentation, development process formalisation, ADRs, hosted docs, and selected customer feedback from Sprint 4.

---

## Delivered increment discussed

**Product fixes & improvements:**
- Fixed redirect to `/admin/login` when token expires or nav doesn't change
- Fixed navlink to admin member page
- Fixed lint issues across the codebase

**Customer feedback implemented (from Sprint 4):**
- Replaced delete button with edit on Members page
- Added banner and description on main page
- Last 4 events now appear in updates section on main page
- Removed age, format, location fields from events
- Renamed and merged admin tabs (Forms + Responses → Manage Questionnaires)
- Enlarged and centered QR code on Donations page

**Architecture & Documentation (new for MVP v2):**
- `docs/architecture/README.md` with Static (Component Diagram), Dynamic (Sequence Diagram), and Deployment views
- 3 ADRs (React, FastAPI, PostgreSQL)
- `docs/development-process.md` with Mermaid gitGraph diagram
- Hosted documentation site on GitHub Pages

**Quality & Testing:**
- All Assignment 4 quality gates maintained (QR-SEC, QR-REL, QR-PERF)
- 2 new UAT scenarios added for MVP v2
- Updated `docs/user-acceptance-tests.md` with Sprint 5 results

---

## UAT results (customer-executed)

| UAT scenario | Result | Notes |
|---|---|---|
| [UAT-01 Publish an event](../../docs/user-acceptance-tests.md#uat-01--publish-an-event) | Passed | Still working; event appears on public page |
| [UAT-02 Add a member with a photo](../../docs/user-acceptance-tests.md#uat-02--add-a-team-member-with-a-photo) | Passed | Edit functionality works; status/role field added |
| [UAT-03 Create, publish & fill a questionnaire](../../docs/user-acceptance-tests.md#uat-03--create-publish-and-fill-a-questionnaire) | Passed | Still working; CSV/Excel export works |
| [UAT-04 Main page banner and last 4 events](../../docs/user-acceptance-tests.md#uat-04--main-page-banner-and-last-4-events) | Passed | Banner appears; last 4 events show correctly |
| [UAT-05 Admin tabs merged (Manage Questionnaires)](../../docs/user-acceptance-tests.md#uat-05--admin-tabs-merged-manage-questionnaires) | Passed | Forms and Responses merged into one tab |

---

## Quality evidence discussed

- Architecture documentation: diagrams explain system structure and deployment
- ADRs trace to quality requirements from Assignment 4
- Development process documented with gitGraph
- Hosted documentation site is browsable and linked from README

**Customer reaction:** Positive. Valerii and Anya confirmed the product improvements.

---

## Customer feedback (new from this session)

| Feedback | Response |
|---|---|
| Two identical "Manage Events" buttons on mobile version | Need to investigate — likely a responsive display bug |
| Add separate tab for CEO and his assistant (they don't belong to any department) | Will add a new department or special role for non-department members |
| Remove percentages of completed surveys from questionnaires | Will remove; customers find it confusing |
| Submitted responses are not visible on the site (only via export) | Need to add a responses viewer directly on the site |
| Photo upload only works for certain sizes and JPG — sometimes photos rotate | Need to improve photo handling: support more formats, fix rotation |
| Add member form: submit button is positioned too low | Need to fix button positioning in the form |

---

## Bugs discovered (by team)

| Bug | Status |
|---|---|
| Photo upload: only certain sizes and JPG supported; photos sometimes rotate | To be fixed |
| Add member form: submit button positioned too low | To be fixed |

---

## Approvals / requested changes

MVP v2 increment accepted by the customer.

**New requested changes (from this session):**
- Fix duplicate "Manage Events" buttons on mobile
- Add separate department/role for CEO and assistant
- Remove percentages from questionnaires
- Add responses viewer on the site
- Fix photo upload (sizes, formats, rotation)
- Fix add member form button positioning

---

## Risks and action points

**Risks:**

| Risk | Mitigation |
|---|---|
| Photo upload bugs may affect user experience | Prioritise fix in Sprint 6; test with various image formats |
| Mobile UI bugs (duplicate buttons) might confuse mobile users | Fix early in Sprint 6 |
| Responses viewer requires new UI component | Estimate properly; don't rush |
| Adding new department/role requires DB change | Write migration; test carefully |

**Action points:**

| Action | Owner | When |
|---|---|---|
| Fix duplicate "Manage Events" buttons on mobile | Frontend team | Sprint 6 |
| Add separate tab/role for SEO and assistant | Backend + Frontend | Sprint 6 |
| Remove percentages from questionnaires | Frontend team | Sprint 6 |
| Add responses viewer on the site | Frontend team | Sprint 6 |
| Fix photo upload (formats, sizes, rotation) | Backend team | Sprint 6 |
| Fix add member form button positioning | Frontend team | Sprint 6 |

---

## Resulting Product Backlog changes

- New PBI created: "Fix duplicate Manage Events buttons on mobile" — added to Sprint 6 backlog
- New PBI created: "Add separate department/role for CEO and assistant" — added to Sprint 6 backlog
- New PBI created: "Remove percentages from questionnaires" — added to Sprint 6 backlog
- New PBI created: "Add responses viewer on the site" — added to Sprint 6 backlog
- New PBI created: "Fix photo upload (formats, sizes, rotation)" — added to Sprint 6 backlog
- New PBI created: "Fix add member form button positioning" — added to Sprint 6 backlog