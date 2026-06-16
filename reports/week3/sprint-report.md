# Sprint 3 Report

## Sprint Goal

Ship a usable MVP v1: students can browse events, members, and departments; fill out active questionnaires; and the admin can publish events and manage surveys through the portal.

## Changes since Assignment 2

### Added stories / PBIs

| Change | ID | Reason |
|--------|----|--------|
| Added tech PBI: API stub layer | — | Required to decouple frontend from missing backend |
| Added tech PBI: Admin inline editing | — | Customer feedback from Assignment 2: admins must be able to edit content from the browser |
| Added tech PBI: Kanban board UI | US-10 | Moved from backlog to Sprint 3 |

### Split stories

None in Sprint 3.

### Removed / marked Won't Have

| ID | Reason |
|----|--------|
| US-16 | Customer explicitly said "too much" in Week 1 interview; no scope change |

## Customer feedback addressed (from Assignment 2)

| Feedback | Addressed? | How |
|----------|------------|-----|
| Remove student registration/login UI | ✅ | Header/Sidebar login button removed; admin login via direct URL only |
| Remove IU Connect mentions | ✅ | All mentions removed in Assignment 2 / PR #14 |
| Donation page: static info + QR only | ✅ | Page redesigned in Sprint 2 |
| Admin should edit content from browser | ✅ | contentEditable inline editing on all content pages |

## Links

- Historical user stories: [`reports/week2/user-stories.md`](../week2/user-stories.md)
- Current user stories index: [`docs/user-stories.md`](../../docs/user-stories.md)
- Product Backlog board: <!-- link -->
- Sprint Backlog board: <!-- link -->
- Sprint 3 milestone: <!-- link -->
- MVP v1 filtered view: <!-- link -->

## Backlog size

| Metric | Value |
|--------|-------|
| Total Product Backlog (Story Points) | TBD |
| Sprint 3 total (Story Points) | TBD |
| Sprint 3 completed (Story Points) | TBD |

## MVP v1 scope

PBIs marked `mvp-v1`:

| ID | Title | SP | Status |
|----|-------|----|--------|
| US-01 | View upcoming events | TBD | Done |
| US-05 | View SU member directory | TBD | Done |
| US-08 | View SU departments info | TBD | Done |
| US-11 | Publish and manage events | TBD | Done |
| US-12 | Fill out an active questionnaire | TBD | Done |
| US-13 | Create and manage questionnaires | TBD | Done |
| — | API stub layer | TBD | Done |
| — | Admin inline editing | TBD | Done |
| — | Admin login | TBD | Done |
| — | CI: lint + type-check | TBD | Done |
| — | Docker deploy pipeline | TBD | Done |

## PBI types, statuses, and task decomposition

- **User Stories** (US-XX): end-user facing requirements, tracked as GitHub Issues with the `user-story` label.
- **Technical PBIs**: infrastructure, CI, and implementation tasks needed to support user stories; tracked with the `pbi` label.
- **Work Status**: `To Do` → `Ready` → `In Progress` → `Review` → `Done`.
- **MVP v1** items are labelled `mvp-v1`. Sprint items are assigned to the Sprint 3 milestone.
- User stories are decomposed into one or more PR-linked implementation tasks when a single PR is too broad.

## Verification evidence

<!-- Links to PRs with AC verification tables -->

- PR #TBD — ...

## Current product status

The frontend MVP v1 is live at [https://su.fblrkus.ru](https://su.fblrkus.ru). All six MVP v1 user stories are implemented in the frontend with API stubs. The FastAPI backend is not yet deployed; the site shows loading/empty states for dynamic content until the backend is live.

## Next steps

- Implement FastAPI + PostgreSQL backend (Sprint 4)
- Replace all API stubs with real endpoints
- Add photo gallery (US-03)
- Add questionnaire result XLSX export (US-14)

## Contribution traceability

| Team member | GitHub | Issues | PRs | Reviews |
|-------------|--------|--------|-----|---------|
| | | | | |
| | | | | |
| | | | | |
| | | | | |
| | | | | |

<!-- Fill in after issues and PRs are created -->
