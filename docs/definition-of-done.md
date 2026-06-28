# Definition of Done

This document defines the team's shared minimum completion standard. A PBI may be marked **Done** only when **all** of the following conditions are satisfied.

## Checklist

- [ ] All issue-level acceptance criteria are satisfied and verified
- [ ] The work is reviewed and approved by at least one other team member
- [ ] The issue-linked PR is merged into the protected default branch (`main`)
- [ ] All required CI checks pass for the product stack (lint, format, type-check, backend tests + coverage, dependency audit, link-check, deploy)
- [ ] Relevant automated tests are added or updated and pass (unit and, for cross-component behaviour, integration)
- [ ] Relevant automated quality requirement tests (QRTs) for any affected [quality requirement](quality-requirements.md) pass
- [ ] Critical modules keep **≥ 30%** automated line coverage (see [`docs/testing.md`](testing.md))
- [ ] Testing evidence is preserved in the PR, CI run, or linked documentation
- [ ] `CHANGELOG.md` is updated if the change is user-visible
- [ ] No secrets, credentials, or personal data are committed
- [ ] The delivered feature is manually tested against the acceptance criteria in the linked PR
- [ ] The issue Work Status is set to `Done` after merge

## Notes

- PBIs that do not touch user-facing functionality (e.g. docs, CI config) are exempt from the CHANGELOG requirement.
- A PR may not be merged without at least one approving review.
- Self-review does not substitute for peer review.
- Tests, QRTs, CI checks, and coverage gates introduced in Assignment 4 are **maintained project assets**. Later work must keep them passing or replace them with documented equivalent-or-stronger coverage — it may not disable, skip, or delete them to land a change.
- If later work changes the product stack, quality requirements, critical modules, or CI configuration, update this Definition of Done, [`docs/quality-requirements.md`](quality-requirements.md), [`docs/quality-requirement-tests.md`](quality-requirement-tests.md), and [`docs/testing.md`](testing.md) instead of leaving the gates stale.
