# Week 6 Report — Student Union Portal (MVP v2)

**Project:** Student Union Portal — Innopolis University
**Team:** Team 2
**License:** [LICENSE](../../LICENSE)

---

## 1-6. Sprint 7 links & main information

- **Report from week 6:** [`reports/week6/README.md`](../../reports/week6/README.md)
- **Product Backlog board:** [SU SWP Project](https://github.com/users/sweetlife999/projects/2)
- **Sprint Backlog board:** [SU SWP Project](https://github.com/users/sweetlife999/projects/2)
- **Sprint 7 milestone:** [Sprint 7](https://github.com/sweetlife999/SWP/milestone/6)

---

- **Sprint Goal:** Deliver MVP v3, fix the bugs found, remove all mock data, prepare the product for the final handover to customer.
- **Sprint dates:** 2026-07-13 – 2026-07-19
- **Scope summary:** Remove all mock data, fix "add" menus on Kanban, events, and members admin pages, fix pie charts render, archieved events visibility, fix questionnaires and donation page render. 
- **Total Sprint size (Story Points):** 17

---

## 7. Delivered product changes  

See [`CHANGELOG.md` → `[2.3.0]`](../../CHANGELOG.md).

Highlights:
- Removed all mock data
- Fixed bugs with "add" menus on admin pages (members, events, kanban)
- Fixed pie chart render for questionnaires
- Added two new designs for Kanban board (List, Timeline)

---

## 8–9. Access

- **Deployed product:** [https://su.fblrkus.ru](https://su.fblrkus.ru)
- **Run / access instructions:** [root `README.md`](../../README.md)

---

## 10-14. Links to the documents
**README:** [README.md](../../README.md)
**Contributing:** [CONTRIBUTING.md](../../CONTRIBUTING.md)
**AGENTS:** [AGENTS.md](../../AGENTS.md)
**Customer handover:** [docs/customer-handover.md](../../docs/customer-handover.md)
**Hosted documentation:** [Site](https://sweetlife999.github.io/SWP/)

---

## 15. Handover summary

Customer wants to make a repository fork to work with it. From our side we will remove all migrations from the database.

The product is ready for independent use and accepted by the customer.

---

## 16. Transition-readiness summary

During the final transition, the following was transferred, delegated, and made available to the customer team:

- **Repository transfer**: Code repository `https://github.com/sweetlife999/swp` assigned to customer team with all major branches merged into `main`. See [`docs/customer-handover.md`](../../docs/customer-handover.md) → Repository & Services section.
- **Access credentials**: Admin user access (HTTP Basic + JWT) and database admin access (PostgreSQL user `su`) with passwords to be configured in `.env` — documented in [`docs/customer-handover.md`](../../docs/customer-handover.md) → Access & Credentials section.
- **Environment configuration**: Production environment variables template (DATABASE_URL, ADMIN_PASSWORD, JWT_SECRET, etc.) — see [`docs/customer-handover.md`](../../docs/customer-handover.md) → Environment Variables section.
- **Deployment instructions**: Full setup and verification procedure for VPS deployment using Docker Compose — documented in [`docs/customer-handover.md`](../../docs/customer-handover.md) → Setup & Verification section.
- **Documentation access**: Complete documentation package including API docs, frontend/backend dev guides, database migrations, CI/CD pipelines, and UAT materials — see [`docs/customer-handover.md`](../../docs/customer-handover.md) → Documentation & Support section.

---

## 17. Transition limitations

Important operational and technical constraints the customer must address during deployment and usage:

- **Setup requirements**: Configuration of production environment variables (ADMIN_PASSWORD, DATABASE_URL, JWT_SECRET) as defined in `backend/.env` – see [`docs/customer-handover.md`](../../docs/customer-handover.md) → Environment Variables section.
- **SSH key management**: Deployment requires SSH key-based access via `docker compose up -d` – ensure key rotation is handled post-deployment.
- **Database responsibility**: Migrations were removed during handover – future schema changes are the customer's responsibility.
- **Access credential security**: Admin passwords and JWT secrets stored in `.env` require immediate rotation for production security.
- **Demo/vlog access**: The public demo video and some documentation links (e.g., Google Drive) must be maintained by the customer.

---

## 18. Summary of customer-independent use and customer-side deployment

The product demonstrates full customer-side operability and deployment independence as evidenced by:

- **Self-contained deployment**: Complete implementation of Docker-based architecture (distributed frontend/backend/DB stack) allows the customer to manage all components via `docker compose` without direct team involvement.
- **Documented operational independence**: Migration-free database architecture hands full schema ownership to customer while API contracts remain stable. See [`docs/customer-handover.md`](../../docs/customer-handover.md) → Database responsibility section for responsibilities transferred.
- **Zero runtime dependencies**: Production environment variables template in `.env` replaces all team-specific configurations, enabling full operational autonomy after initial setup.
- **Customer-side maintenance model**: Removal of all migrations and mock data requires customer team to implement schema changes and data management independently, mirroring production requirements.

---

## 19. Customer feedback response

All functional and non-functional requirements were satisfied. Customer did not emphasize any issues.

---

## 20. Summary of relevant UAT or customer-trial results

- **UAT results summary:** see [`sprint-review-summary.md`](sprint-review-summary.md) (UAT results table)

---

## 21-23. Maintained quality & architecture docs

TODO: MAKE A 2.3.0 RELEASE
- **SemVer release (MVP v3):** [`2.3.0`](https://github.com/sweetlife999/SWP/releases/tag/v2.3.0) — tag on `main`, mapping to Sprint 7, with links to milestone, run instructions, and demo video
- **`CHANGELOG.md`:** [link](../../CHANGELOG.md) — `[Unreleased]` moved into the dated `[2.3.0] — 2026-07-19` section
- **Public sanitized demo video (<2 min):** [Google Drive](TODO)

---

## 24. Demo day preparation summary

Demo Day preparation is complete. The required **Week 7 rehearsal** was conducted, covering the full live walkthrough of MVP v3 (deployed at `https://su.fblrkus.ru`), the customer handover narrative, and the transition-readiness/limitations summary, and the final demo day presentation.

---

## 25. Sprint review & transcript

- **Customer review summary:** [`sprint-review-summary.md`](sprint-review-summary.md)
- **Sprint review transcript:** [`sprint-review-transcript.md`](sprint-review-transcript.md)

---

## 26–29. Other reports

- [`sprint-review-summary.md`](sprint-review-summary.md)
- [`reflection.md`](reflection.md)
- [`retrospective.md`](retrospective.md)
- [`llm-report.md`](llm-report.md)

---

## 30. Summary of the final product status

- **Final status:** MVP v3 is deployed and functional, architecture is documented, ADRs are recorded, development process is formalised. The product is fully functional and ready to use in production. All requirements were satisfied and optional features were added (e.g. Kanban board for internal tasks).

---

## 31. Contribution traceability

| Member | GitHub | Contribution this Sprint |
|--------|--------|--------------------------|
| Iaroslav Moskvin | @sweetlife999 | Backend fixes, product fixes, QA |
| Dmitrii Malofeev | @FblRKUS | Backend fixes, PR reviews, QA |
| Zakhar Gurtovoi | @Meduzium | Frontend fixes, documentation |
| Olga Frolovskaia | @Kkoi33 | Demo day presentation, documentation |
| Alisa Kondakova | @AlisaKondakova | Demo day presentation, Sprint 7 reports |

---

## 32. Screenshots

- Sprint 7 milestone — `images/sprint_milestone.png`
![Sprint 7 milestone](images/sprint_milestone.png)
- Board / project workflow view — `images/board_view.png`
![Board / project workflow view](images/board_view.png)
- Latest protected-branch CI run — `images/ci_run.png`
![Latest protected-branch CI run](images/ci_run.png)
- SemVer release — TODO
- Example reviewed issue-linked PR — `images/reviewed_pr.png`
![Example reviewed issue-linked PR](images/reviewed_pr.png)
- Hosted docs site — `images/hosted_docs.png`
![Hosted docs site](images/hosted_docs.png)
- Architecture diagrams — `images/architecture.png`
![Architecture diagrams](images/architecture.png)
- ADR directory — `images/adr_list.png`
![ADR directory](images/adr_list.png)