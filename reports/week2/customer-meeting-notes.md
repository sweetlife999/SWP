# Customer Meeting Notes — Week 2

> **Note:** A recording was made with customer permission. These notes are supplementary documentation based on handwritten notes taken during the session by ZG. See [customer-meeting-transcript.md](customer-meeting-transcript.md) for the sanitised English transcript and [customer-meeting-summary.md](customer-meeting-summary.md) for the full summary.

**Date:** 2026-06-12
**Note-taker:** Zakhar Gurtovoi

---

## Interface feedback — MVP v0 / Figma prototype

**Header / Navigation:**
- "Portal search" → remove entirely
- Notifications → too much, remove
- Account icon → remove from public header
- Navigation should move from left sidebar to the top bar (header will be empty once search/notifications/account are gone — use that space)

**Main page:**
- Main page must lead with SU identity: who we are, what we do, department branches, members overview
- Main events belong in the Events section, not the main page
- History and Roadmap on a separate page — approved

**Events:**
- Split into current / past — approved
- "My registrations" → remove (no auth)

**Donations:**
- Remove donation goal counter and total amount
- Replace with a simple static description: what the money is for (e.g. "for printing costs, for the Telegram bot, etc.")

**Kanban / SU:Core Board:**
- Design is too monotone — "white in white in white"
- Extra statistics not needed: velocity strip, "38% complete" counters — not worth maintaining
- Deadline display on cards is acceptable

**Questionnaires / Forms:**
- Admins must be able to view results of closed forms and export from the same menu (not a separate admin-only section)

**Accounts page:**
- Remove from navigation / public UI

**Customer's words (paraphrased):**
> "I beg you, Yarik — build the foundation solid first, then we'll add features for the future."

---

## User stories

- US-05 (Members): should cover **all** SU participants since 2019 (current and alumni), not just the current team
