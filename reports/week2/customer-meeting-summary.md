# Customer Meeting Summary — Week 2

## Meeting details

| Field | Value |
|-------|-------|
| Date | 2026-06-12 |
| Duration | 38 minutes |
| Participants | 5 team members (YM, DM, ZG, OF, AK) + Valera (SU:Core, SD 2nd year) + Anya (SU:Core) |
| Recording | Permitted by customer for private instructor sharing |
| Transcript publication | Approved by customer |

---

## Artifacts demonstrated

- User stories: [user-stories.md](user-stories.md) — 14 active stories with MoSCoW priorities
- Initial proposed MVP v1 scope (US-01, 05, 08, 11, 12, 13)
- Figma prototype: [SU Portal — Week 2 Prototype](https://www.figma.com/design/jQF7Hpaw4iLGrZM8Ei8ieT/SU-Portal-%E2%80%94-Week-2-Prototype?node-id=0-1&t=ialB7LSIfMm7k9u4-1)
- MVP v0: [su.fblrkus.ru](https://su.fblrkus.ru)

---

## Customer approvals

- [x] **Transcript publication in the repository** — approved ("Of course")
- [x] **Written consent to public MIT-licensed development model** — re-confirmed ("Yes, absolutely")
- [x] **User stories** — approved with two modifications (see Resulting changes)
- [x] **MoSCoW priorities** — approved
- [x] **Initial proposed MVP v1 scope** (US-01, 05, 08, 11, 12, 13) — full approval ("Full approval from me")

---

## Discussion points

### Prototype and MVP v0

The team presented the deployed MVP v0 at [su.fblrkus.ru](https://su.fblrkus.ru). Valera reviewed all screens and gave positive feedback overall ("Excellent work for an MVP v0 given the timeframe"). Specific feedback:

**Main page:**
- Current design leads with a large event banner. Customer requested a redesign: main page should primarily show *SU overview and department information*, not a news/events feed.
- Department navigation should be inline on the same page (switch between departments without leaving the page), not separate tabs.

**Donations page:**
- Progress bars and donation counters are out of scope — no real-time tracking of donations is feasible.
- Requested format: static page with a brief description of what the money is for, a QR code, and a link.

**Admin / Kanban board:**
- Visual issue: cards are "white on white on white" — too hard to read. Requested colour differentiation (by status or department).
- Velocity strip and progress counts may be dropped; deadline display is acceptable.

**Forms Builder (questionnaire admin):**
- Admin should be able to view results in-site, not only export to CSV/XLSX.

**Authentication:**
- Public-facing site must have no login prompt. The admin account should be a hidden endpoint — public users never see a login button.
- One hardcoded or console-provisioned admin account is sufficient for the course scope.

**Navigation:**
- Left sidebar navigation is not preferred. With search, notifications, and account icon removed from the header, the header should hold the navigation instead (more vertical space for content).
- Admin-only pages (kanban, forms builder) should be behind a hidden button/link; admins see the same interface as regular users plus contextual admin controls (e.g., "Create event" button on the Events page, "View results" on Questionnaires).

### User stories

Valera read all stories. Key feedback:

- **US-07** (anonymous survey): perspective should shift from the student to the SU. The SU *offers* anonymity as a trust-building measure; it's not a student preference. Story to be rewritten: "As the SU, we want to collect survey responses anonymously, so that students can give candid feedback without fear of being identified."
- **US-14** (XLSX export): should also reference in-site result viewing — export is secondary. Admin must be able to view results in the interface first.
- **US-15** (Telegram sync): Could Have confirmed as the correct priority.
- **US-16** (room autobooking): Won't Have confirmed.
- All other stories accepted without changes.

---

## Decisions

1. MVP v1 scope confirmed: **US-01, US-05, US-08, US-11, US-12, US-13**.
2. US-07 to be rewritten from the SU's perspective.
3. US-14 notes to be expanded to include in-site result viewing as a requirement.
4. Donation feature (US-04) scope clarified: static page with QR code + purpose description, no financial tracking.
5. Navigation to move from left sidebar to top bar in subsequent design iterations.
6. Admin access to be a hidden endpoint — no public login UI.

---

## Action points

| # | Action | Owner | Target |
|---|--------|-------|--------|
| 1 | Rewrite US-07 from SU perspective | Team | Before submission |
| 2 | Add in-site result viewing to US-14 | Team | Before submission |
| 3 | Update US-04 notes to reflect static QR donation page | Team | Before submission |
| 4 | Redesign main page: SU info / departments instead of event feed | Frontend | MVP v1 |
| 5 | Move navigation from sidebar to top bar | Frontend | MVP v1 |
| 6 | Add colour coding to kanban cards | Frontend | MVP v1 |
| 7 | Implement admin as hidden endpoint; no public login button | Backend / Frontend | MVP v1 |
| 8 | Add in-site result viewing for questionnaire admin | Backend / Frontend | MVP v1 |

---

## Risks

- Anya (second customer representative, SU design lead) was largely unreachable due to connection issues. Her design feedback may come in async via chat. Future meetings should confirm her availability or switch to a primary contact.

---

## Resulting changes to user stories or prototype

See [user-stories.md](user-stories.md) for applied changes:
- **US-07** — rewritten: perspective changed from student to SU
- **US-14** — notes updated: in-site result viewing added as a requirement alongside XLSX export
- **US-04** — notes updated: clarified as static QR code + description page, no donation tracking
