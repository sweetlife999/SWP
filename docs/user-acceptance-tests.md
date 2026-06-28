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
| [UAT-01](#uat-01--publish-an-event) | Publish an event and see it appear publicly | Admin → student | Active |
| [UAT-02](#uat-02--add-a-team-member-with-a-photo) | Add a team member with a photo | Admin → student | Active |
| [UAT-03](#uat-03--create-publish-and-fill-a-questionnaire) | Create, publish, and fill a questionnaire | Admin → student | Active |

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
| _TBD_ | Sprint 4 | _Pending — to be executed by the customer in the Sprint 4 review/UAT session_ | |

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
| _TBD_ | Sprint 4 | _Pending — to be executed by the customer in the Sprint 4 review/UAT session_ | |

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
| _TBD_ | Sprint 4 | _Pending — to be executed by the customer in the Sprint 4 review/UAT session_ | |

---

## Recording and privacy

- Ask the customer for permission **before recording** every session.
- The private UAT recording link goes to Moodle only — **never** committed to this
  public repository.
- The public Week 4 report summarises results (pass/fail, key feedback, resulting
  PBIs) without exposing private customer information.
