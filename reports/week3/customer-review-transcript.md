# Customer Review Transcript — Sprint 3

**Date:** 2026-06-20
**Format:** Video call
**Participants:** Team (Iaroslav M., Dmitrii M., Zakhar G., Alisa K.); Customer: Valerii [redacted]
**Recording:** Permitted by customer. Private instructor sharing: permitted. Publication in repository: permitted (confirmed separately, not on recording).

*Note: transcript cleaned for readability. Filler words, crosstalk, and off-topic exchanges removed. No timestamps available in the source recording. PII redacted.*

---

**[Team]:** We are recording — is that okay?

**[Customer]:** Yes.

**[Team]:** Briefly — the purpose of this call: you need to look at what we built this sprint, say whether it's okay or not okay.

**[Customer]:** Sure, tell me what you did this sprint.

**[Team]:** We built the database, the backend, and updated the frontend based on feedback from the previous meeting. The backend is not connected to the frontend yet, but it exists and the database is there — we just need to wire it all together.

**[Customer]:** Nice. What did you write it in?

**[Team]:** Python. FastAPI.

**[Customer]:** Good choice.

**[Team]:** We also confirmed the tech choice with you in chat earlier.

**[Customer]:** Right, yes. I'd like to see the demo directly — what you actually built.

**[Team]:** The demo is at the same link we sent before: [https://su.fblrkus.ru](https://su.fblrkus.ru).

---

**[Team]:** So — the backend is not connected yet, so the site still serves static content. We have open PRs that we haven't fully reviewed. All backend endpoints are implemented; they're just not in the deploy yet. We have one PR that's ready, but there are still some minor fixes needed on others.

One slightly technical question came up regarding the database schema.

**[Team]:** Almost everything is straightforward except for the questionnaires. Right now the schema stores all survey answers as JSON. Do you approve, or do you have other suggestions?

**[Customer]:** No, no — that's fine, excellent. It's not a relational database anyway — if you can make a separate column per question, that's the most efficient approach for partner data. That's optimal.

**[Team]:** Great. The database is PostgreSQL.

**[Customer]:** PostgreSQL? Nice.

---

**[Customer]:** Looking at the frontend — honestly I had no issues with the previous version either. If you fixed everything Anya mentioned, I personally was already okay with it. If you fixed everything — great, well done.

**[Team]:** Yes, we fixed everything.

---

**[Team]:** Here is what we did by user story:

- Events browsing ✅
- Member directory ✅
- Departments overview ✅
- Questionnaire management and results viewer ✅
- Admin authentication ✅
- Database ✅

What is still in progress:

- Questionnaire filling online — so the admin can edit directly in the browser
- Inline content editing — in progress
- Event publishing via admin UI — in review
- Kanban board frontend integration — not implemented yet

**[Customer]:** That's fine. Kanban is your plan-maximum. Even having it sketched out is already cool. So next sprint you'll be closing the open PRs and doing the backend wiring?

**[Team]:** Exactly — next sprint is PRs and backend integration.

---

**[Customer]:** By user stories — approved. Frontend — approved from me, honestly I approved the previous version too. If you only improved it, great. I'll start working more closely with you next week, because this is where I'm most interested.

In general — overall approved.

**[Team]:** Just to confirm explicitly: do you approve the MVP v1 progress as of now?

**[Customer]:** Yes. Overall approved.

---

**[Team]:** One more question about the admin panel. In the previous meeting we discussed that there should be no login button visible on the public site — access is via the URL directly. Is that still the case?

**[Customer]:** Yes. Not so much "change the URL" as just knowing the path. You go to `/admin`, it redirects to `/admin/login` with a password prompt. That's correct.

**[Team]:** Right — that's exactly what we have: `/admin` redirects to `/admin/login` if there's no JWT token. For now we kept a button during development for convenience, but it will be removed.

**[Customer]:** Makes sense. By the way — is your JWT in role-based access format, or just a session presence token?

**[Team]:** Just a session token — single admin, not role-based.

**[Customer]:** Okay, that's fine for now. That'll be a task for next week when we work on integration together.

---

**[Team]:** Let's look at the backlog.

**[Customer]:** I like that you write `With Results` in the backlog — it's cool that the task itself is written that way. Prioritisation is there, sprints are there, the tasks themselves — I'm not the judge of your own tasks.

The format of the status view is good — you can look at current tasks and say yes, this is exactly what I want. The tasks are well chosen, they need to be done. Well done.

---

**[Team]:** A question about content. We need actual content for the site: SU member names, departments (Core / Active / Media), roles, photos, bios — that kind of thing. Also SU history and description, upcoming events, and a donate link.

**[Customer]:** Understood. For now leave placeholder content. I'll ask Alyona — she'll either write the history herself or I will, and she'll approve it. That will probably be next week.

**[Team]:** No problem — we'll send you a list in chat of exactly what we need.

**[Customer]:** Yes, do that.

---

**[Team]:** Any other questions from our side? No. That's everything.

**[Customer]:** Alright, good call everyone. Good luck.

**[Team]:** Thank you, goodbye.
