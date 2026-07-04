# User Acceptance Tests

End-user-facing acceptance test scenarios for the Student Union Portal. These are
**maintained product assets** — the scenarios persist across Sprints; each Sprint
records new execution results in the per-scenario execution history.

The customer executes the scenarios during a recorded Sprint Review / UAT session.
Each scenario has a stable ID, the user role, preconditions, numbered steps, an
expected result, a current status, and an execution history.

**Live deployment:** [https://su.fblrkus.ru](https://su.fblrkus.ru)

| ID | Scenario | Role | Status |
|----|----------|------|--------|
| [UAT-01](#uat-01--publish-an-event) | Publish an event and see it appear publicly | Admin → student | Passed |
| [UAT-02](#uat-02--add-a-team-member-with-a-photo) | Add a team member with a photo | Admin → student | Passed |
| [UAT-03](#uat-03--create-publish-and-fill-a-questionnaire) | Create, publish, and fill a questionnaire | Admin → student | Passed |
| [UAT-04](#uat-04--create-a-task-on-the-kanban-board) | Create a task on the kanban board | Admin → Admin | Passed |
| [UAT-05](#uat-05--see-the-roadmap) | See the Student Union roadmap | Admin → student | Passed |

---

## UAT-01 — Publish an event

- **Role:** Admin (creates), then any student (views)
- **Precondition:** Admin is logged in at `/admin/login`.

**Steps**

1. Go to the admin events panel (`/admin/events`).
2. Create a new event: title, description, date, time, department, location.
3. Save it as a draft and confirm it is **not** visible on the public `/events` page.
4. Publish the event.
5. Open the public `/events` page as a normal visitor.

**Expected result:** the published event appears in the public events list with the
correct title, date, and department tag; the draft was hidden until published.

**Execution history**

| Date | Sprint | Result | Notes |
|------|--------|--------|-------|
| 2026-06-27 | Sprint 4 | Passed | Admin created and published an event; it appeared on the public page. Customer confirmed events work. |

**Evidence from Sprint Review:**
> *"Yes."* — Valerii (Customer), confirming the events section works as expected.

---

## UAT-02 — Add a team member with a photo

- **Role:** Admin (adds), then any student (views)
- **Precondition:** Admin is logged in; a photo file is available on the admin's computer.

**Steps**

1. Open the Members page admin controls and choose "add member".
2. Fill in name, role, department, and bio.
3. Upload a photo by drag-and-drop (or click-to-select) from the computer.
4. Save the member.
5. Open the Members page as a normal visitor and locate the new member.

**Expected result:** the member appears in the correct department with the uploaded
photo (served optimised via Thumbor) and the entered details; the card is correctly
sized, not stretched.

**Execution history**

| Date | Sprint | Result | Notes |
|------|--------|--------|-------|
| 2026-06-27 | Sprint 4 | Passed | Admin can add members. Feedback: replace delete button with edit. |

**Evidence from Sprint Review:**
> *"I would replace delete with edit, so you can change a member's information if needed."* — Anya (Customer)
>
> *"Yes, yes, yes."* — Valerii (Customer)

---

## UAT-03 — Create, publish, and fill a questionnaire

- **Role:** Admin (builds & publishes), then student (fills), then admin (views results)
- **Precondition:** Admin is logged in.

**Steps**

1. Open the Forms Builder and start a new questionnaire ("Новый опрос").
2. Add at least one single-choice and one multiple-choice question (with options).
3. Publish the questionnaire.
4. As a student, open the public Questionnaires page, find the published survey, fill it in, and submit.
5. As admin, open the Forms Viewer / results for that questionnaire.

**Expected result:** the published questionnaire is fillable by a student; the
submitted response is stored anonymously and appears in the results viewer; a
completed survey is no longer offered to the same student.

**Execution history**

| Date | Sprint | Result | Notes |
|------|--------|--------|-------|
| 2026-06-27 | Sprint 4 | Passed | Admin created and published a questionnaire; student can fill it; CSV and Excel export work. Customer confirmed. |

**Evidence from Sprint Review:**
> *"For the forms there are different question types. There is CSV export. You can publish a form."* — Iaroslav (Team)
>
> *"Yes, cool."* — Valerii (Customer)

---

## UAT-04 — Create a task on the kanban board

- **Role:** Admin (creates the task, fills the details)
- **Precondition:** Admin is logged in.

**Steps**

1. Open the Kanban board and press the "New task" button.
2. Fill the title, description, column, priority, and assignee fields.
3. Press the "Create" button.

**Expected result:** the created task is movable from any column to any other column; every task could be redacted or deleted if needed;

**Execution history**

| Date | Sprint | Result | Notes |
|------|--------|--------|-------|
| 2026-06-30 | Sprint 5 | Passed | Admin created the task on the Kanban board; the task could be redacted or deleted if needed; the task could be moved to any column | Customer confirmed. |

**Evidence from Sprint Review:**
> TODO speech (Team)
>
> TODO speech (Customer)

---

## UAT-05 — See the roadmap

- **Role:** Admin (writes and changes the text if needed), then student (reads)
- **Precondition:** Admin is logged in.

**Steps**

1. Open the "Members" page and click "Roadmap 2026" button.
2. As an admin, write or change the text of roadmap.
3. Confirm the changes.
4. As a student, open the "Members" page, find the roadmap and read it.

**Expected result:** the roadmap text could be changed by an admin; the roadmap might be readed by any user;

**Execution history**

| Date | Sprint | Result | Notes |
|------|--------|--------|-------|
| 2026-06-27 | Sprint 5 | Passed | Admin wrote and changed the roadmap text; student can see the SU roadmap; | Customer confirmed. |

**Evidence from Sprint Review:**
> TODO (Team)
>
> TODO (Customer)

---

## UAT Summary — Sprint 5

| UAT ID | Scenario | Status |
|--------|----------|--------|
| UAT-01 | Publish an event | Passed |
| UAT-02 | Add a team member with a photo | Passed (with feedback — replace delete with edit) |
| UAT-03 | Create, publish, and fill a questionnaire | Passed |
| UAT-04 | Create a task on the kanban board | Passed |
| UAT-05 | See the roadmap | Passed |
---

## Key Feedback from UAT Session (Sprint 5)

| Feedback | Resulting action |
|----------|------------------|
| Remove age, format, location fields from events | Will be removed |
TODO

---

## Recording and privacy

- Ask the customer for permission **before recording** every session.
- The private UAT recording link goes to Moodle only — **never** committed to this
  public repository.
- The public Week 5 report summarises results (pass/fail, key feedback, resulting
  PBIs) without exposing private customer information.
