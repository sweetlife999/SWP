# Sprint Review Summary — Week 7

**Date:** 2026-07-18

**Participants:** Yaroslav M., Anna (Customer), Zakhar G., Alice K., Olga F.

**Format:** Video call (recording permitted)

---

## Sprint Goal Reviewed

Deliver MVP v3, fix the bugs found, remove all mock data, and prepare the product for the final handover to the customer (Sprint 7 goal per [`reports/week7/README.md`](README.md)). This review was the last meeting within the SWP framework and focused on tech-stack context, functionality walkthrough, and the handover plan.

---

## Delivered Increment Discussed

### Fixes Delivered in MVP v3 (v2.3.0)
- Donation page rendering fixed
- All remaining mock data eliminated
- Questionnaires rendering fixed after a user fills and sends them
- Typing fixed in Kanban, events, and members admin pages
- Pie charts rendering fixed
- Survey drafts no longer shown in the questionnaire-answers menu
- Archived events no longer visible to default users

### Functionality Confirmed with Customer
- **Pages:** events, members, forms, donation page, Kanban
- **Member management:** create/edit/delete members, archived instead of deleted (`is_active` flag)
- **Event management:** create, edit, publish, archive, delete drafts
- **Questionnaires:** build, publish, fill out, view responses
- **Kanban board:** persisted cards, now with List and Timeline view options (added in v2.3.0)

### Technical Stack Context Shared
- Backend: **Python + FastAPI** (other Student Council teams used Java + Spring)
- Database: **PostgreSQL**
- Config: **YAML** files
- Deployment: **Docker Compose** — `compose.yml` (production, pulls images from GitHub Packages) and `compose.local.yml` (local, builds from source)
- Photos: stored via **Backlog** (per original stack spec)
- Tests: **PyTest** (backend) and **Playwright** (frontend)
- Design: fully graphical, gradient-based — no conventional SVG, so the site loads faster; modest SVG can still be added later without significant slowdown
- CI/CD: full pipeline via GitHub Pages / GitHub Actions

---

## UAT Results

The customer confirmed the product is ready for use; no UAT defects were raised in this final review.

| Scenario | Result | Notes |
|---|---|---|
| Functionality walkthrough (events, members, forms, donations, Kanban) | Accepted | Customer reviewed the live scope |
| Mock data removal | Passed | All mock data eliminated in v2.3.0 |
| Bug fixes (donation, questionnaires, typing, pie charts) | Passed | Shipped in v2.3.0 |
| Handover readiness | Accepted | Product accepted by the customer |

---

## Customer Feedback

| Feedback | Response |
|---|---|
| Prefers the old page design over the locally-changed one | Team kept the existing (old) design; no redesign merged |
| Clarification on build location (VMs or packages) | Images are pulled from GitHub Packages, not built on VMs at deploy time |
| General tech-stack / release questions | Answered live; no further technical concerns raised |

---

## Handover Discussion

- Customer will **fork** the ready-made repository to work with it independently.
- Team will **remove all migrations** and consolidate everything into the initial schema, so the customer receives clean, working code.
- Migrations cleanup to be done either the same day or the next; customer is not forking this week, so timing is not critical.
- Customer can tag Yaroslav or Valeriy in chat when ready to fork.
- Product is already accepted and ready for use.

---

## Approvals / Requested Changes

Product increment accepted by the customer. No new feature changes requested.

**Action points from this meeting:**

| Action | Owner | When |
|---|---|---|
| Remove all DB migrations and consolidate into initial schema before fork | Backend team | By 2026-07-19 (or next day) |
| Keep existing (old) design — do not merge the local redesign | Frontend team | Done |
| Final repository transfer / fork to customer | Team + Customer | After migrations cleanup |

---

## Resulting Product Backlog Changes

- No new PBIs created — Sprint 7 scope is complete and the product is handed over.
- Outstanding internal task carried into handover: consolidate SQL migrations into initial schema (tracked in [`docs/customer-handover.md`](../../docs/customer-handover.md)).

---

## Product Status & Next Steps

- **Current status:** MVP v3 (v2.3.0) deployed and functional at `https://su.fblrkus.ru`; all bugs fixed; mock data removed; product accepted by the customer and ready for independent use.
- **Next steps:** Clean up migrations, then the customer forks the repository. Development within the SWP framework is concluded.
