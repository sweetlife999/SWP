# Customer Review Summary — Sprint 4

> **Status: template — to be completed during/after the Sprint 4 review & UAT
> session.** The session combines the Sprint Review (Part 11) and customer-executed
> UAT (Part 10) in one recording. Fill the bracketed fields from the meeting; do not
> put private recording links or credentials here — those go to Moodle only.
> Preparation checklist: `internal/customer-meeting-prep.md` (not committed).

**Date:** _[YYYY-MM-DD]_
**Participants:** _[team members present]_; _[customer / role, redacted as needed]_
**Format:** Video call (recording permission asked before recording started: _[yes/no]_)

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
| [UAT-01 Publish an event](../../docs/user-acceptance-tests.md#uat-01--publish-an-event) | _[pass/fail]_ | _[…]_ |
| [UAT-02 Add a member with a photo](../../docs/user-acceptance-tests.md#uat-02--add-a-team-member-with-a-photo) | _[pass/fail]_ | _[…]_ |
| [UAT-03 Create, publish & fill a questionnaire](../../docs/user-acceptance-tests.md#uat-03--create-publish-and-fill-a-questionnaire) | _[pass/fail]_ | _[…]_ |

## Quality evidence discussed

_[Which quality requirements and automated test/CI evidence were shown; customer
reaction.]_

## Customer feedback

- _[key feedback point 1]_
- _[key feedback point 2]_

## Approvals / requested changes

_[Approved as-is? Requested changes? Reprioritisations?]_

## Risks and action points

| Action | Owner | When |
|--------|-------|------|
| _[…]_ | _[…]_ | _[…]_ |

## Resulting Product Backlog changes

_[New/updated PBIs created from this review — link issues. Mirror into the feedback
table in `README.md`.]_
