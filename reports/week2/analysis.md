# Week 2 Analysis — Student Union Portal

## Learning points

**User story writing**

Writing user stories from raw interview notes forced us to separate what the customer *said they wanted* from what they *actually need*. The "Mom Test" interview technique from Week 1 paid off here: because the interview focused on workflows and pain points rather than feature requests, the resulting stories describe real value rather than assumed features. For example, instead of "integrate with Outlook", the story became US-16 (Won't Have) — a genuine need that is out of scope for this course — because the interview revealed that manual room booking is not actually a bottleneck for SU at its current scale.

**Prioritisation**

Applying MoSCoW forced the team to confront tradeoffs explicitly. Several stories that seemed important initially (anonymous surveys, donation system, Telegram sync) were downgraded to Could Have or Should Have once we mapped them against the customer's own stated MVP criteria: *"a website containing SU members, surveys, and news blocks with upcoming events."* The donation system in particular may be legally blocked by the absence of a registered legal entity — a constraint that only emerged from the interview.

**Interface design**

Designing a full interactive Figma prototype before the customer meeting — rather than just a wireframe — significantly raised the quality of feedback received. The customer immediately gave concrete UI critique (navigation placement, colour scheme, donation page scope) that would have been impossible to elicit from static boxes. The main lesson: a working visual artefact compresses the feedback loop and surfaces implicit product requirements (e.g., "there should be no login button anywhere on the public site") that stakeholders cannot articulate in the abstract.

**MVP v0 deployment**

Deploying MVP v0 as a real public URL (React SPA on a VPS, HTTPS, CI/CD via GitHub Actions) — rather than just a localhost demo — forced us to solve production infrastructure problems early: nginx configuration, Let's Encrypt TLS, rsync-over-SSH deployment, and a Lychee link-checking pipeline. These would otherwise be deferred to the last week. Running `npm run build` in CI also revealed a latent TypeScript error before it could break a live demo.

**Customer validation**

The Week 2 customer meeting validated the overall direction and revealed three concrete requirement gaps: (1) US-07 was framed from the wrong perspective — it is the SU, not the student, that owns the anonymity requirement; (2) US-14 was incomplete — in-site result viewing is more important than XLSX export; (3) US-04 had unrealistic assumptions about donation tracking. All three were updated immediately. The meeting also produced clear design direction: move navigation to the top bar, remove all auth UI from the public-facing pages, and simplify the main page to focus on SU identity rather than a news feed. The prototype quality exceeded customer expectations, which shortened the approval phase significantly.

---

## Validated assumptions

| Assumption | Source | Status |
|---|---|---|
| Students do not need login to browse the portal | Customer interview (Week 1) | **Confirmed** — Week 2 meeting: customer explicitly said auth "disrupts the flow"; public site must have no login button |
| Room autobooking is out of scope | Customer interview (Week 1) | **Confirmed** — Week 2 meeting: "Won't Have, confirmed, too much" |
| Google Forms is the current survey tool and its limitations drive the questionnaire feature | Interview + product spec | **Confirmed** — consistent with Week 2 discussion |
| Photos cannot be stored directly in the database | Customer interview (Week 1) | **Confirmed** — consistent with Week 2 discussion |
| Survey questions and answers can include images | Customer interview (Week 1) | **Confirmed** — consistent with Week 2 prototype review |
| White-and-green colour scheme is required | Customer interview (Week 1) | **Confirmed** — customer approved prototype aesthetic |
| The SU has a Telegram channel that drives content publishing | Customer interview (Week 1) | **Confirmed** — Week 2 meeting: "we send the Telegram post and link to the site" |
| Donation system is a static QR code page, no financial tracking | Week 2 customer meeting | **Confirmed** — customer explicitly clarified: no counters, no progress bars, just QR + description |
| Admin account is a single hidden-endpoint credential, no public login UI | Week 2 customer meeting | **Confirmed** — customer said "hardcode or provision via console, no login button on public pages" |

---

## Needs clarification

1. **Admin account provisioning** — Week 2 confirmed a single admin account with no public login UI. However: how is this account created in production? Is a one-time seeded account in the database sufficient, or should there be a CLI command / environment-variable mechanism? To be resolved in Assignment 3.

2. **Photo storage infrastructure** — Who provides the server or S3-compatible storage? What are the expected data volumes? This determines whether Thumbor or a simpler image CDN is appropriate.

3. **Telegram integration scope** — Is US-15 (Telegram → portal sync) directional only (Telegram webhook → portal), or does the admin also need to post to Telegram from the portal? The former is simpler. To be clarified before implementation.

4. **Survey anonymity enforcement level** — Week 2 confirmed the SU wants anonymous responses; the *degree* of enforcement (client-only vs server-side unlinkability) is still an open design question. Cookie/session de-duplication is a reasonable middle ground.

5. **Events vs internal SU meetings** — Should the events module distinguish between public events and internal SU meetings? Affects who can see what on the events calendar. Not raised in Week 2.

6. **Account lifecycle for SU team** — What happens when an SU member graduates? No process for de-activating admin credentials was discussed. Likely out of scope for the course but worth noting.

---

## Planned response

| Finding | Affected stories | Planned action |
|---|---|---|
| US-07 reframed from SU's perspective | US-07 | **Done** — story rewritten in Week 2 |
| Donation is a static QR page, no tracking | US-04 | **Done** — notes updated; implementation scope is now clear |
| In-site result viewing required alongside export | US-14, US-13 | **Done** — US-14 title and notes updated |
| Navigation moves to top bar | US-08, US-01 (UI) | Plan for MVP v1 iteration; prototype to be updated in Assignment 3 |
| Admin = hidden endpoint, no public login | US-11, US-13 (admin) | Design for MVP v1 backend: single admin account seeded at deploy time |
| Main page redesign: SU info instead of event feed | US-08 | Plan for MVP v1 iteration |
| Kanban colour differentiation needed | US-10 | Plan for MVP v1 frontend |
| Telegram integration directional (one-way) | US-15 | Narrow scope to webhook listener when implemented |
