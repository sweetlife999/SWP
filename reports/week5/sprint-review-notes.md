# Sprint Review Notes — Sprint 5 (MVP v2)

**Date:** 2026-07-04
**Participants:** Zakhar G. (DevOps), Olga F. (Frontend), Alisa K. (Frontend); Valerii (Customer), Anya (Customer)
**Format:** Video call

---


## Delivered Increment Shown

- Product fixes: admin redirect, navlink to members, lint issues
- Customer feedback implemented: edit on Members page, main page banner, last 4 events, removed age/format/location from events, merged admin tabs, enlarged QR code

---

## UAT Results

| Scenario | Result |
|---|---|
| UAT-01: Publish an event | Passed |
| UAT-02: Add a member with a photo | Passed |
| UAT-03: Create, publish & fill a questionnaire | Passed |
| UAT-04: Main page banner and last 4 events | Passed |
| UAT-05: Admin tabs merged | Passed |

---

## Customer Feedback

### 1. Duplicate "Manage Events" buttons on mobile

On mobile view, two identical "Manage Events" buttons are displayed. One should be removed.

### 2. No dedicated department for CEO and assistant

SEO specialist and their assistant are not part of any existing SU department (Core, Active, Media). A separate department or role should be added so they appear on the Members page.

### 3. Percentages on questionnaires are unclear

The "38%" statistic shown on the Questionnaires page is confusing. It should be removed.

### 4. Submitted responses not visible on the site

Admins can export responses to CSV/XLSX, but cannot view submitted answers directly on the site. A responses viewer should be added.

---

## Action Points

| Action | Owner | When |
|---|---|---|
| Fix duplicate "Manage Events" buttons on mobile | Frontend | Sprint 6 |
| Add separate department/role for SEO and assistant | Backend + Frontend | Sprint 6 |
| Remove percentages from Questionnaires page | Frontend | Sprint 6 |
| Add responses viewer on the site | Frontend | Sprint 6 |

---

## Resulting Product Backlog Changes

- New PBI: "Fix duplicate Manage Events buttons on mobile" — Sprint 6
- New PBI: "Add separate department/role for SEO and assistant" — Sprint 6
- New PBI: "Remove percentages from Questionnaires page" — Sprint 6
- New PBI: "Add responses viewer on the site" — Sprint 6
