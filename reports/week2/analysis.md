# Week 2 Analysis — Student Union Portal

## Learning points

**User story writing**

Writing user stories from raw interview notes forced us to separate what the customer *said they wanted* from what they *actually need*. The "Mom Test" interview technique from Week 1 paid off here: because the interview focused on workflows and pain points rather than feature requests, the resulting stories describe real value rather than assumed features. For example, instead of "integrate with Outlook", the story became US-16 (Won't Have) — a genuine need that is out of scope for this course — because the interview revealed that manual room booking is not actually a bottleneck for SU at its current scale.

**Prioritisation**

Applying MoSCoW forced the team to confront tradeoffs explicitly. Several stories that seemed important initially (anonymous surveys, donation system, Telegram sync) were downgraded to Could Have or Should Have once we mapped them against the customer's own stated MVP criteria: *"a website containing SU members, surveys, and news blocks with upcoming events."* The donation system in particular may be legally blocked by the absence of a registered legal entity — a constraint that only emerged from the interview.

**Interface design** *(to be updated after prototype session)*

Placeholder — to be completed after the Figma prototype is created and reviewed.

**MVP v0 deployment** *(to be updated after deployment)*

Placeholder — to be completed after MVP v0 is deployed and smoke-checked.

**Customer validation** *(to be updated after Week 2 customer meeting)*

Placeholder — to be completed after the customer review session.

---

## Validated assumptions

| Assumption | Source | Status |
|---|---|---|
| Students do not need login to browse the portal | Customer interview (Week 1) | Confirmed: only one admin user exists |
| Room autobooking is out of scope | Customer interview (Week 1) | Confirmed: customer explicitly said "too much" |
| Google Forms is the current survey tool and its limitations drive the questionnaire feature | Interview + product spec | Confirmed: customer described Google Forms as their current workaround |
| Photos cannot be stored directly in the database | Customer interview (Week 1) | Confirmed: image optimizer (Thumbor) or external storage needed |
| Survey questions and answers can include images | Customer interview (Week 1) | Confirmed: customer specified this explicitly |
| White-and-green colour scheme is required | Customer interview (Week 1) | Confirmed: Innopolis-themed, not identical to my.university |
| The SU has a Telegram channel that drives content publishing | Customer interview (Week 1) | Confirmed: admin creates posts in Telegram first, portal should mirror |
| Donation system requires a legal entity / external payment redirect | Interview + technical Q&A doc | Unconfirmed — see "Needs clarification" |
| SpringBoot is mandatory as backend | Product spec (initial) | Likely negotiable — customer's spec says "highly recommended / open for negotiations" |

---

## Needs clarification

1. **Donation legality** — Does SU have a registered legal entity that allows receiving payments? Or is a T-Bank redirect link the only feasible option? This affects whether US-04 is truly a Should Have or effectively a Won't Have.

2. **Admin account provisioning** — How does the single admin account get created and rotated? Is a one-time seeded admin sufficient, or is there a need for at least basic credential management?

3. **Photo storage infrastructure** — Who provides the server/S3-compatible storage? What are the expected data volumes (GB vs TB)? This determines whether Thumbor or a simpler image CDN is appropriate.

4. **Telegram integration scope** — Is the Telegram sync (US-15) directional (Telegram → portal only), or does the admin also need to post from the portal to Telegram? The former is simpler (webhook listener); the latter requires the portal to call the Telegram Bot API.

5. **Stack confirmation** — The product spec lists SpringBoot as "highly recommended" but notes it is open to negotiation. The interview notes suggest FastAPI + React may be acceptable. This choice affects MVP v0 architecture and needs customer sign-off.

6. **Account lifecycle for SU members** — What happens when a student on the SU team graduates? Is there a process for de-activating admin credentials?

7. **Survey anonymity enforcement** — How strictly must anonymous surveys be anonymous? Client-side only (no name field) is trivial; true server-side unlinkability is complex. The level of enforcement affects US-07 scope significantly.

8. **Events vs internal SU meetings** — Should the events module distinguish between public events (open to all students) and internal SU meetings? This affects who can see what on the events calendar.

---

## Planned response

| Finding | Affected stories | Planned action |
|---|---|---|
| Donation legal ambiguity | US-04 | Confirm with customer in Week 2 meeting; may downgrade to Won't Have if no legal entity exists |
| Telegram integration is directional (Telegram → portal) | US-11, US-15 | Narrow US-15 scope to webhook-based one-way sync; clarify with customer |
| SpringBoot vs FastAPI still open | All backend stories | Finalise stack choice with customer in Week 2 meeting; document decision in mvp-v0-report.md |
| Anonymous survey complexity | US-07 | Downgrade from Could Have to Won't Have if cookie/session-based de-duplication is insufficient and full enforcement is required |
| MVP v1 scope is tight (6 stories) | US-01, 05, 08, 11, 12, 13 | Keep scope small and prototype only these 6 for the Week 2 customer review; add Should Have stories to Assignment 3 backlog |
