# Sprint Review Summary — Week 6

**Date:** 2026-07-11

**Participants:** Iaroslav M., Zakhar G., Anna (Customer), Alisa K., Olga F. 

**Format:** Video call (recording permitted)

---

## Sprint Goal Reviewed

Deliver a stable trial release, fix bugs identified in previous meetings, and prepare for final project handover.

---

## Delivered Increment Discussed

### Bug Fixes
- Member cards no longer stretch; photos load correctly with department-specific backgrounds
- Duplicate buttons on mobile version removed
- "38%" statistics table removed from Questionnaires page
- XSS vulnerabilities fixed — input validation now enforced before database writes
- Draft system for events: events can be created and saved before publishing

### New Features
- Support department added (CEO and assistant moved to separate section)
- Photo upload now supports multiple formats, sizes, and GIFs
- Event management: create, delete, and publish events; drafts can be saved and edited later
- Past and active events displayed separately

### Technical Improvements
- Pydantic validation ensures invalid requests are rejected before reaching the database
- SQL migrations accumulated; team agreed to clean them up before final handover
- Swagger documentation available for API endpoints

---

## UAT Results

| Scenario | Result | Notes |
|---|---|---|
| Member card display | Passed | No stretching, correct backgrounds |
| Photo upload | Passed | Supports multiple formats, sizes, GIFs |
| Events — create and publish | Passed | Draft system works |
| Mobile version — duplicate buttons | Passed | Fixed |
| Questionnaires — statistics removed | Passed | "38%" table removed |
| XSS protection | Passed | Requests validated before DB write |

---

## Customer Feedback

| Feedback | Response |
|---|---|
| "What does 'live' mean on the events page?" | Team will either complete the logic or remove it. |
| "Support department — why are they called Support?" | Team will rename to appropriate department name. |
| No additional handover documentation needed at this stage | Team will provide Swagger and basic run instructions. |

---

## Handover Discussion

- Customer confirmed they will take a snapshot of the repository when they begin working
- Customer requested:
  - Swagger documentation for API endpoints
  - Basic run instructions
  - General understanding of the codebase structure
- Team will prepare frontend/backend documentation and clean up migrations before final handover

---

## Approvals / Requested Changes

Product increment accepted by the customer.

**Action points from this meeting:**

| Action | Owner | When |
|---|---|---|
| Clean up SQL migrations before handover | Backend team | Week 7 |
| Complete or remove "live" logic on events | Frontend team | Week 7 |
| Rename "Support" department to appropriate name | Frontend + Backend | Week 7 |
| Prepare Swagger + run instructions for customer | Team | Week 7 |
| Final repository transfer to customer | Team | Week 7 |

---

## Resulting Product Backlog Changes

- New PBI: "Clean up SQL migrations before final handover" — Sprint 7
- New PBI: "Complete or remove 'live' logic on events page" — Sprint 7
- New PBI: "Rename Support department to correct name" — Sprint 7
- New PBI: "Prepare handover documentation (Swagger, run instructions)" — Sprint 7

---

## Product Status & Next Steps

- **Current status:** Trial release stable; most bugs fixed; product ready for handover
- **Next steps:** Clean up migrations, finalize documentation, transfer repository to customer in Week 7