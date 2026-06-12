# Customer Meeting Transcript — Week 2

**Date:** 2026-06-12
**Duration:** 38 minutes
**Language note:** Meeting was conducted in Russian. This is a sanitised English translation. Profanity and off-topic exchanges are omitted or marked `[redacted]`. Unclear audio is marked `[inaudible]`.
**Recording:** Permitted by customer for private instructor sharing. Publication of this sanitised transcript in the repository: explicitly approved by the customer.

**Participants:**
- **YM** — Yaroslav Moskvin (Team Lead)
- **DM** — Dmitrii Malofeev (FullStack Developer)
- **ZG** — Zakhar Gurtovoi (Backend Developer)
- **OF** — Olga Frolovskaia (Frontend Developer)
- **AK** — Alisa Kondakova (Frontend Developer)
- **V** — Valera (Customer — SU:Core, SD 2nd year)
- **A** — Anya (Customer — SU representative; had significant connection issues throughout)

---

V: Thanks. Since I wasn't at the first meeting — could you introduce yourselves?

DM: I'm Dima. I'm involved in SU:Core somewhat — first year, DSAI.

YM: I'm Yaroslav, DSAI-01.

AK: I'm Alisa.

OF: I'm Olga, CSE, first year.

ZG: I'm Zakhar, DSAI-01.

V: I'm Valera. SD, second year. I do something in SU:Core — periodically, as mood dictates. That's all you need to know. Fair warning: I'm a tough customer — so there shouldn't be any problems as long as you're on your game.

YM: Two quick administrative questions before we start. First — can we publish the sanitised transcript of this meeting in our public GitHub repository?

V: Of course.

YM: Second — the repository is distributed under an MIT licence. You gave written consent to this before repository creation. Confirming that consent remains in effect?

V: Yes, absolutely.

YM: Thank you. One last thing — if you need to leave early, could you let us know?

V: Sure, no problem.

V: Actually, since I wasn't at the first meeting — a few thoughts on hosting. Three reasonable options: (1) request a university VM from IT — totally viable, just requires coordinating with the IT department; (2) Yandex has a free student VM grant — around 3,000 roubles, easily enough, we used that as first-years; (3) paid hosting. That's just my input in case it's useful.

YM: We've already sorted hosting — it's deployed.

V: Great. So — what did you do this week for the report?

YM: We wrote user stories with MoSCoW prioritisation — Must/Should/Could Have. We need your approval on the stories, we want to confirm six stories for MVP v1, and we'd like to show you what we've built in Figma and as an MVP v0.

V: Highly understandable. I'll start reading the user stories. Can someone show me the design at the same time?

---

**Prototype and MVP v0 review**

DM: I'll share the deployed MVP v0 link.

V: [reviewing the main page] What is this large event banner at the top — "Innopolis 2026, Results"?

DM: Mock data. In the real product it would be an actual event.

V: Is it clickable?

DM: Not yet — it will be later.

V: Alright. About the main page — I think we discussed this: we want the main page to show information *about the SU*. Who we are, what we do. Not a news/events feed at the top.

A: [joins] Yes — we discussed that the main page should show department information. The user switches between departments on the same page — not navigate to a separate tab. Just inline.

V: Right. Main page = SU overview and departments. The big event banner at the top is not what we need there.

DM: Understood — we'll rework the main page structure.

V: [continuing to scroll] History section — looks good; a separate page for it is fine. Roadmap too. Events — I like the split between upcoming and past. "My registrations" — we can drop that, no auth.

V: Questionnaires look good. I see a list on the left and an open questionnaire on the right — if I close it, I just see the list?

DM: Correct.

V: Nice. The design is solid.

**Donations:**

V: Donations — this is a bit too much. Counters and progress bars — we're not going to update that data. What we actually want is a simple static page: "please donate," an explanation of what the money is for, a QR code, and a link. We can't track incoming donations — money comes in, gets spent, no one audits it in real time. No quarterly reports.

DM: So — static page, QR code, description of purpose?

V: Exactly. If we need to nudge people to donate, we post in Telegram with a link to that page.

**Admin / Kanban board:**

V: [reviewing kanban] Generally good. One visual issue — everything is white on white on white. Hard on the eyes. It would help to have colour differentiation — maybe colour-code by status or department. It would be nice, for example, if the whole card background had a subtle colour.

DM: We'll add colour coding.

V: The task cards look like standard kanban everywhere — that's fine. I see deadlines on cards — those are achievable. Velocity strip — maybe. I'd drop the progress percentage counts — too much effort to keep accurate.

V: [on Forms Builder] Looks good. Quick clarification — how does an admin add a question? They click something in the left panel?

DM: At the bottom of the left panel there's "Add question" with options: single choice, multiple choice, scale, text input.

V: Good. How does the admin view questionnaire results — other than this CSV export button I see?

DM: Right now only export exists. We'll add in-site result viewing.

V: Yes — the admin should be able to see results directly in the interface. Export is a bonus, not the primary way.

**Authentication:**

V: About authentication — our core concept is: this site is a business card you hand to someone. They click the link, look, and leave. Authentication really disrupts that flow. For public visitors there should be no login prompt at all. There's one admin account.

V: My recommendation: admin login should be a hidden endpoint. The public interface has no login button. The admin either has the URL hardcoded or you provision the account manually in the console. For our scale that's completely fine.

DM: That matches what we planned — one admin account, no public login UI.

V: Perfect.

**Navigation:**

V: One more design note — I'm not a fan of the left sidebar navigation. Since we're removing search, notifications, and account icon from the header, the header will be essentially empty. Let's put the navigation there instead — we gain more vertical space for content.

DM: Makes sense — we'll move navigation to the top bar.

V: For internal admin tools — kanban, forms builder — those can be hidden behind a single button. Public pages stay clean. Actually, it's probably better if the admin sees the same interface as a regular user, just with extra buttons revealed in context. For example, inside Questionnaires the admin gets an extra "View results / Export" button. Inside Events — a "Create event" button. Less context switching.

DM: Understood — role-based view augmentation rather than a separate panel.

V: [on the prototype quality] By the way — this is excellent work for an MVP v0, given the timeframe. The questionnaire screens are particularly nice. Honestly the prototype quality is well above what the course expected from week 2 — we expected 14 rectangles with labels. So of course we're already getting into real UI feedback. Take that as a compliment.

---

**User stories review**

V: Alright — user stories. I'm reading...

V: What are "Notes and constraints" — acceptance criteria?

YM: More like notes and reminders for ourselves.

V: OK. [pause] I see US-02 is removed — I see the casino entry. [laughs]

V: US-07 — anonymous survey. I'm not sure it's told from the right perspective. As written, it's "a student wants anonymous responses." But the actual desire is from the SU's side — we want to *offer* anonymity so that students trust us and give honest feedback. I'd rewrite it: "As the SU, we want to collect survey responses anonymously, so that students can give candid feedback without fear of being identified."

DM: We'll rephrase it.

V: [on US-14] US-14 is XLSX export. I'd add that in-site result viewing should be there too — not just export. Either as a note here or as part of US-13.

YM: We'll add it to US-14's notes.

V: How many stories total?

YM: Sixteen with two removed — fourteen active.

V: [reading US-15] US-15 — [pause] [redacted] Telegram posts automatically appearing on the portal. Ambitious. But — Could Have is the right label. If you have the bandwidth, great. It's genuinely useful but definitely not essential.

V: [on US-16] Room autobooking — Won't Have, confirmed. That's too much for this scope.

V: Overall the stories are solid. Let's go to the MVP v1 scope.

---

**MVP v1 scope approval**

YM: Proposed MVP v1 scope: US-01, US-05, US-08, US-11, US-12, US-13.

V: US-01 — yes, absolutely.
US-05 — absolutely.
US-08 — absolutely, yes.
US-11 — yes.
US-12 — yes.
US-13 — yes.

V: Full approval from me.

A: [rejoins] Quick question — we were just discussing members and departments on the main page. US-05 is member directory, US-08 is departments — how are those different?

YM: US-08 covers department information on the main page — you can switch between departments inline. US-05 is a separate Members page — a full directory of everyone who has ever been in SU, current and alumni. Like a hall of fame.

A: Got it — main page has current team per department, Members page has the full historical roster.

V: Exactly. That distinction makes sense.

V: Alright — we're done here. Full approval on the scope and the user stories with the two modifications noted.

---

**Wrap-up**

YM: Thank you — that covers everything from our side. We'll update the user stories and iterate on the prototype based on your feedback.

V: Great work. Seriously — for the time you had, this is impressive. Keep it up.

**[Recording ends]**
