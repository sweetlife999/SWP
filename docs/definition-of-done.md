# Definition of Done

This document defines the team's shared minimum completion standard. A PBI may be marked **Done** only when **all** of the following conditions are satisfied.

## Checklist

- [ ] All issue-level acceptance criteria are satisfied and verified
- [ ] The work is reviewed and approved by at least one other team member
- [ ] The issue-linked PR is merged into the protected default branch (`main`)
- [ ] All required CI checks pass (lint, type-check, link-check, deploy)
- [ ] `CHANGELOG.md` is updated if the change is user-visible
- [ ] No secrets, credentials, or personal data are committed
- [ ] The delivered feature is manually tested against the acceptance criteria in the linked PR
- [ ] The issue Work Status is set to `Done` after merge

## Notes

- PBIs that do not touch user-facing functionality (e.g. docs, CI config) are exempt from the CHANGELOG requirement.
- A PR may not be merged without at least one approving review.
- Self-review does not substitute for peer review.
