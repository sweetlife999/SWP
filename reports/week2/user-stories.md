# User Stories — Student Union Portal

## Personas

| Persona | Description |
|---------|-------------|
| **Student** | Any Innopolis University student. No registration or login required to browse public content. |
| **Admin** | A single privileged SU operator (SU:Core lead or designated editor) who manages all site content via the admin panel. |
| **SU:Core Member** | Internal Student Union team member who uses the task tracker to coordinate SU activities. |

---

## Active Stories

### US-01: View upcoming events

**Requirement Status:** Active
**MoSCoW priority:** Must Have

As a student,
I want to see a list of upcoming SU events with dates and descriptions,
so that I can plan to attend events that interest me.

#### Notes and constraints

- Events are created and published by the Admin (see US-11).
- Events should display at minimum: title, date/time, brief description, and a link to a dedicated event page.
- Past events should be archived and remain accessible (not deleted).

---

### US-02: Removed — see below

---

### US-03: View past event photo gallery

**Requirement Status:** Active
**MoSCoW priority:** Should Have

As a student,
I want to browse photo links from past SU events,
so that I can quickly find and access my own photos or relive events I attended.

#### Notes and constraints

- Photos must not be stored directly in the database (confirmed in interview). The portal provides links or embeds to an external media source.
- Photo moderation (who can upload) is an open question for Assignment 3 estimation.

---

### US-04: Donate to SU

**Requirement Status:** Active
**MoSCoW priority:** Should Have

As a student,
I want to donate to the Student Union,
so that I can financially support SU activities that benefit all students.

#### Notes and constraints

- The customer currently collects donations informally. A formal payment gateway requires a registered legal entity, which the SU may not currently have.
- The most likely implementation is a redirect to an external donation link (e.g., T-Bank collection page).
- Recurring payments (subscriptions) are out of scope for the course period.
- A visual donation progress bar for specific goals is a Could Have enhancement.

---

### US-05: View SU member directory

**Requirement Status:** Active
**MoSCoW priority:** Must Have

As a student,
I want to see a directory of current Student Union members with their names and roles,
so that I know who to contact and who represents me.

#### Notes and constraints

- Member profiles should include at minimum: name, role/department, and optionally a photo.
- Content is managed by the Admin. No self-registration for SU members on the portal.

---

### US-06: Submit feedback to SU

**Requirement Status:** Active
**MoSCoW priority:** Could Have

As a student,
I want to send a direct message or feedback to the Student Union,
so that I can share concerns, ideas, or compliments without attending a meeting in person.

#### Notes and constraints

- This is a lightweight contact channel, not a full ticketing system.
- The task tracker (US-10) may receive escalated items from feedback, but auto-conversion is out of scope for MVP v1.
- Routing to the correct SU department is an open design question.

---

### US-07: Fill anonymous survey

**Requirement Status:** Active
**MoSCoW priority:** Could Have

As a student,
I want to submit a survey response anonymously,
so that I can give candid feedback without fear of being identified.

#### Notes and constraints

- Protection against duplicate submissions (ballot stuffing) needs design: options include cookies, session tokens, or rate-limiting by IP. Full server-side enforcement is complex.
- The customer confirmed anonymity is desirable but did not flag duplicate-submission abuse as a historical problem.
- Works in conjunction with US-12 (fill questionnaire) and US-13 (admin creates questionnaire).

---

### US-08: View SU departments and their info

**Requirement Status:** Active
**MoSCoW priority:** Must Have

As a student,
I want to browse the Student Union departments and read about each one,
so that I understand how the SU is organized and what each department does.

#### Notes and constraints

- Departments are displayed on the main page; each has a dedicated sub-section (Members, History, Roadmap within the department card — per customer's product spec).
- Content (history, roadmap) is managed by the Admin.

---

### US-09: Removed — see below

---

### US-10: Manage internal tasks on a kanban board

**Requirement Status:** Active
**MoSCoW priority:** Should Have

As an SU:Core member,
I want to create, assign, and track tasks on a kanban-style board,
so that the team can coordinate event preparation and daily duties without losing track of who does what.

#### Notes and constraints

- This is the SU:Core internal work module described in the product spec.
- Minimum viable card: title, assignee, status column.
- Advanced features (deadlines, tags, internal comments, auto-creation from feedback) are deferred to later sprints.
- The customer currently uses informal tools (Telegram, spreadsheets) for task tracking — this module replaces that workflow.

---

### US-11: Publish and manage events and news

**Requirement Status:** Active
**MoSCoW priority:** Must Have

As an admin,
I want to create, edit, and publish event announcements and news posts,
so that students always see up-to-date information about SU activities.

#### Notes and constraints

- The admin panel must support at minimum: create/edit/delete events and news posts.
- Telegram integration (posts from a Telegram channel appearing on the website automatically) is a desired enhancement noted by the customer — see US-15.
- Only one admin user exists; no multi-user editorial workflow is required for MVP v1.

---

### US-12: Fill out an active questionnaire

**Requirement Status:** Active
**MoSCoW priority:** Must Have

As a student,
I want to find and fill out an open SU questionnaire,
so that I can share my preferences, opinions, or votes on topics the SU cares about.

#### Notes and constraints

- Surveys are currently run via Google Forms; the portal replaces this workflow.
- Questions and answers can include images (confirmed by customer in interview).
- Survey headers should support a customizable banner image (customer example: "cats photo").
- Form structure is linear for MVP v1; branching logic is not required.
- Student does not need an account to fill out a public survey.

---

### US-13: Create and manage questionnaires

**Requirement Status:** Active
**MoSCoW priority:** Must Have

As an admin,
I want to create, open, and close questionnaires,
so that I can collect structured feedback from students through the portal.

#### Notes and constraints

- Admin must be able to: create a new questionnaire, add questions (with optional image attachments), publish it, close it, and view results.
- Supported question types for MVP v1: multiple-choice and open text.
- Export to XLSX is a Should Have feature (US-14); viewing results in-app is Must Have.

---

### US-14: Export questionnaire results to XLSX

**Requirement Status:** Active
**MoSCoW priority:** Should Have

As an admin,
I want to export survey responses to an XLSX file,
so that I can analyse the data in spreadsheet tools without manually copying results.

#### Notes and constraints

- The customer explicitly listed "Questionnaires: xlsx export" in the product spec.
- The export should include all responses with timestamps.
- Chart/diagram generation inside the export is optional (lower priority than raw data).

---

### US-15: Sync Telegram channel posts to the website

**Requirement Status:** Active
**MoSCoW priority:** Could Have

As an admin,
I want posts I publish in the SU Telegram channel to automatically appear on the portal,
so that I maintain one source of truth without duplicating content.

#### Notes and constraints

- The customer explicitly mentioned Telegram integration as a planned feature.
- Implementation requires a Telegram Bot API webhook.
- Out of scope for MVP v1; planned for a later sprint after core content management is stable.

---

### US-16: Room autobooking / Outlook integration

**Requirement Status:** Active
**MoSCoW priority:** Won't Have

As an SU:Core member,
I want the portal to automatically book an auditorium for an event,
so that I don't have to email room 319 manually.

#### Notes and constraints

**Won't Have reason:** The customer explicitly stated "Room autobooking is too much" during the Week 1 interview. The current process (manually contacting room 319) is acceptable for SU's scale. Implementing Outlook integration would add significant technical complexity (OAuth, Outlook Calendar API) with low return for the course scope. This story is valid but intentionally excluded from the product scope for the duration of this course.

---

## Removed Stories

### US-02: Casino slots

**Requirement Status:** Removed
**Previous MoSCoW priority:** Could Have

As a user,
I want to spin some casino slots,
so that I can get a dopamine surge of a lifetime.

**Reason:** This was a placeholder/joke story added to the team's initial draft brainstorm (lab 2 activity worksheet). It is not a legitimate product requirement for the Student Union Portal and was never discussed with the customer. Removed and replaced by real stories derived from the customer interview.

---

### US-09: Sirniki999 morning TV channel

**Requirement Status:** Removed
**Previous MoSCoW priority:** Won't Have

As a user,
I want to see @sirniki999 channel every morning instead of TV,
so that I will become a genius a few months later.

**Reason:** Joke story added by the team during initial brainstorming. Not a valid product requirement. Removed permanently.

---

## Initial proposed MVP v1 scope

The following Must Have stories form the initial proposed MVP v1 scope. They collectively satisfy the customer's stated minimum viable expectation: *"a website containing SU members, surveys, and news blocks with upcoming events."*

- **US-01** — Student views upcoming events
- **US-05** — Student views SU member directory
- **US-08** — Student views SU departments info
- **US-11** — Admin publishes and manages events and news
- **US-12** — Student fills out an active questionnaire
- **US-13** — Admin creates and manages questionnaires

This scope will be refined, estimated, and finalized in Assignment 3.
