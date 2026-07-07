# Sprint Review Notes — Sprint 5 (MVP v2)

**Date:** 2026-07-04
**Participants:** Zakhar G. (DevOps), Olga F. (Frontend), Alisa K. (Frontend); Valerii (Customer), Anya (Customer)
**Format:** Video call

---

## Sprint Goal Reviewed

Deliver MVP v2 with architectural documentation, development process formalisation, ADRs, hosted docs, and selected customer feedback from Sprint 4.

---

## Delivered Increment Shown

- **Product fixes:** redirect to `/admin/login` on token expiration (#79), navlink to admin member page (#77), lint fixes
- **Customer feedback implemented (Sprint 4):** edit on Members page (with status/role field), main page banner, last 4 events in updates section, removed age/format/location from events, merged admin tabs (Forms + Responses → Manage Questionnaires), enlarged and centered QR code on Donations page
- **Architecture documentation:** Static View (Component Diagram), Dynamic View (Sequence Diagram), Deployment View
- **3 ADRs:** Single-Admin JWT Authentication, Pydantic Request Validation, Docker Compose Deployment on VPS
- **Development Process:** `docs/development-process.md` with Mermaid gitGraph
- **Hosted Documentation:** GitHub Pages site with all `docs/` files

---

## UAT Results

| Scenario | Result |
|---|---|
| UAT-01: Publish an event | Passed |
| UAT-02: Add a member with a photo | Passed |
| UAT-03: Create, publish & fill a questionnaire | Passed |
| UAT-04: Create a task on the kanban board | Passed |
| UAT-05: See the roadmap | Passed |

---

## Customer Feedback

### 1. Duplicate "Manage Events" buttons on mobile

On mobile view, two identical "Manage Events" buttons are displayed. One should be removed.

**Response:** Will be fixed in Sprint 6.

---

### 2. No dedicated department for CEO and assistant

CEO specialist and their assistant are not part of any existing SU department (Core, Active, Media). A separate department or role should be added so they appear on the Members page.

**Response:** Will be added in Sprint 6.

---

### 3. Percentages on questionnaires are unclear

The "38%" statistic shown on the Questionnaires page is confusing. It should be removed.

**Response:** Will be removed in Sprint 6.

---

### 4. Submitted responses not visible on the site

Admins can export responses to CSV/XLSX, but cannot view submitted answers directly on the site. A responses viewer should be added.

**Response:** Will be added in Sprint 6.

---

### 5. Photo upload: only JPG and specific sizes; photos rotate

Only certain image sizes and JPG format work; photos sometimes rotate incorrectly.

**Response:** Will be fixed in Sprint 6 (support more formats, fix EXIF orientation).

---

### 6. Add member form: submit button positioned too low

The "Сохранить" button in the add member form is positioned too low, requiring unnecessary scrolling.

**Response:** Will be fixed in Sprint 6.

---

## Action Points

| Action | Owner | When |
|---|---|---|
| Fix duplicate "Manage Events" buttons on mobile | Frontend | Sprint 6 |
| Add separate department/role for CEO and assistant | Backend + Frontend | Sprint 6 |
| Remove percentages from Questionnaires page | Frontend | Sprint 6 |
| Add responses viewer on the site | Frontend | Sprint 6 |
| Fix photo upload (formats, sizes, rotation) | Backend | Sprint 6 |
| Fix add member form button positioning | Frontend | Sprint 6 |

---

## Resulting Product Backlog Changes

- New PBI: "Fix duplicate Manage Events buttons on mobile" — Sprint 6
- New PBI: "Add separate department/role for CEO and assistant" — Sprint 6
- New PBI: "Remove percentages from Questionnaires page" — Sprint 6
- New PBI: "Add responses viewer on the site" — Sprint 6
- New PBI: "Fix photo upload (formats, sizes, rotation)" — Sprint 6
- New PBI: "Fix add member form button positioning" — Sprint 6