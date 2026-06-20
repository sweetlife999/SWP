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
- Product Backlog board: [SU SWP Project](https://github.com/users/sweetlife999/projects/2)
- Sprint Backlog board: [SU SWP Project — Sprint view](https://github.com/users/sweetlife999/projects/2)
- Sprint 3 milestone: [Sprint 3 — MVP v1](https://github.com/sweetlife999/SWP/milestone/1)
- MVP v1 filtered view: [Issues labelled mvp-v1](https://github.com/sweetlife999/SWP/issues?q=label%3Amvp-v1)

## Backlog size

| Metric | Value |
|--------|-------|
| Total Product Backlog (Story Points) | 596+ (TBD: #17, #18, #20, #27, #39, #40, #42, #47, #56) |
| Sprint 3 total (Story Points) | 284 SP (#56 excluded — backlog, not started) |
| Sprint 3 completed (Story Points) | 218 SP |

## MVP v1 scope

PBIs marked `mvp-v1`:

| ID | Title | Issue | SP | Status |
|----|-------|-------|----|--------|
| US-01 | View upcoming events | [#15](https://github.com/sweetlife999/SWP/issues/15) | 20 | Done |
| US-04 | Donate to SU | [#16](https://github.com/sweetlife999/SWP/issues/16) | 8 | Done |
| US-05 | View SU member directory | [#19](https://github.com/sweetlife999/SWP/issues/19) | 13 | Done |
| US-08 | View SU departments info | [#21](https://github.com/sweetlife999/SWP/issues/21) | 13 | Done |
| US-10 | Manage tasks on kanban board | [#23](https://github.com/sweetlife999/SWP/issues/23) | 40 | Done |
| US-11 | Publish and manage events | [#35](https://github.com/sweetlife999/SWP/issues/35) | 13 | Review |
| US-12 | Fill out an active questionnaire | [#25](https://github.com/sweetlife999/SWP/issues/25) | 13 | In Progress |
| US-13 | Create and manage questionnaires | [#24](https://github.com/sweetlife999/SWP/issues/24) | 20 | Done |
| US-14 | View and export questionnaire results | [#26](https://github.com/sweetlife999/SWP/issues/26) | 13 | Done |
| — | API stub layer | [#29](https://github.com/sweetlife999/SWP/issues/29) | 40 | Done |
| — | Admin inline editing | [#32](https://github.com/sweetlife999/SWP/issues/32) | 20 | In Progress |
| — | Admin login | [#30](https://github.com/sweetlife999/SWP/issues/30) | 5 | Done |
| — | CI: lint + type-check | [#31](https://github.com/sweetlife999/SWP/issues/31) | 8 | Done |
| — | Docker deploy pipeline | [#34](https://github.com/sweetlife999/SWP/issues/34) | 13 | Done |
| — | Database schema and migrations | [#43](https://github.com/sweetlife999/SWP/issues/43) | 100 | Done |
| — | Backend setup: stack, project, dev env | [#41](https://github.com/sweetlife999/SWP/issues/41) | 20 | Ready |

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

- Design database schema and write migrations (Sprint 3, #43)
- Backend setup: stack, project structure, dev environment (Sprint 3, #41)
- Connect FastAPI endpoints and replace API stubs (Sprint 4)
- Add photo gallery (US-03)
- Add questionnaire result XLSX export (US-14)

## Contribution traceability

| Team member | GitHub | Issues | PRs | Reviews |
|-------------|--------|--------|-----|---------|
| Iaroslav Moskvin | [@sweetlife999](https://github.com/sweetlife999) | [#32](https://github.com/sweetlife999/SWP/issues/32), [#42](https://github.com/sweetlife999/SWP/issues/42), [#44](https://github.com/sweetlife999/SWP/issues/44), [#46](https://github.com/sweetlife999/SWP/issues/46) | [PR#51](https://github.com/sweetlife999/SWP/pull/51), [PR#55](https://github.com/sweetlife999/SWP/pull/55) | [PR#14](https://github.com/sweetlife999/SWP/pull/14), [PR#50](https://github.com/sweetlife999/SWP/pull/50), [PR#52](https://github.com/sweetlife999/SWP/pull/52), [PR#53](https://github.com/sweetlife999/SWP/pull/53), [PR#54](https://github.com/sweetlife999/SWP/pull/54), [PR#58](https://github.com/sweetlife999/SWP/pull/58), [PR#59](https://github.com/sweetlife999/SWP/pull/59), [PR#61](https://github.com/sweetlife999/SWP/pull/61) |
| Dmitrii Malofeev | [@FblRKUS](https://github.com/FblRKUS) | [#40](https://github.com/sweetlife999/SWP/issues/40), [#42](https://github.com/sweetlife999/SWP/issues/42), [#44](https://github.com/sweetlife999/SWP/issues/44), [#45](https://github.com/sweetlife999/SWP/issues/45), [#56](https://github.com/sweetlife999/SWP/issues/56) | [PR#13](https://github.com/sweetlife999/SWP/pull/13), [PR#14](https://github.com/sweetlife999/SWP/pull/14), [PR#50](https://github.com/sweetlife999/SWP/pull/50), [PR#53](https://github.com/sweetlife999/SWP/pull/53), [PR#54](https://github.com/sweetlife999/SWP/pull/54), [PR#58](https://github.com/sweetlife999/SWP/pull/58), [PR#61](https://github.com/sweetlife999/SWP/pull/61) | [PR#51](https://github.com/sweetlife999/SWP/pull/51), [PR#55](https://github.com/sweetlife999/SWP/pull/55), [PR#59](https://github.com/sweetlife999/SWP/pull/59), [PR#60](https://github.com/sweetlife999/SWP/pull/60) |
| Zakhar Gurtovoi | [@Meduzium](https://github.com/Meduzium) | [#35](https://github.com/sweetlife999/SWP/issues/35), [#37](https://github.com/sweetlife999/SWP/issues/37), [#41](https://github.com/sweetlife999/SWP/issues/41), [#43](https://github.com/sweetlife999/SWP/issues/43), [#48](https://github.com/sweetlife999/SWP/issues/48) | [PR#52](https://github.com/sweetlife999/SWP/pull/52) | [PR#14](https://github.com/sweetlife999/SWP/pull/14), [PR#55](https://github.com/sweetlife999/SWP/pull/55) |
| Olga Frolovskaia | [@Kkoi33](https://github.com/Kkoi33) | [#38](https://github.com/sweetlife999/SWP/issues/38), [#49](https://github.com/sweetlife999/SWP/issues/49) | [PR#59](https://github.com/sweetlife999/SWP/pull/59) | [PR#13](https://github.com/sweetlife999/SWP/pull/13), [PR#52](https://github.com/sweetlife999/SWP/pull/52), [PR#55](https://github.com/sweetlife999/SWP/pull/55) |
| Alisa Kondakova | [@AlisaKondakova](https://github.com/AlisaKondakova) | [#25](https://github.com/sweetlife999/SWP/issues/25), [#38](https://github.com/sweetlife999/SWP/issues/38), [#49](https://github.com/sweetlife999/SWP/issues/49) | [PR#60](https://github.com/sweetlife999/SWP/pull/60) | [PR#55](https://github.com/sweetlife999/SWP/pull/55) |
