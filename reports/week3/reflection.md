# Week 3 Reflection

## Learning points

- **Backlog migration surfaces hidden complexity.** Migrating user stories from a flat markdown file to GitHub Issues forced us to split broad stories into concrete technical PBIs (e.g., US-11 became separate issues for admin panel UI, inline editing, and API endpoints). This level of detail is required for a sprint to be plannable.
- **pydantic-settings v2 has a breaking behavior for list fields.** `list[str]` fields in `BaseSettings` call `json.loads()` before any field validator runs. Environment variables like `CORS_ORIGINS=http://a.com,https://b.com` (no JSON brackets) crash at startup. The fix — using `str` type and a `@property` that splits by comma — is unintuitive and not documented prominently.
- **CI-only image builds are the correct pattern for Docker-based deploy.** Building images on the server requires the full source tree to be present, which breaks as soon as the server only receives a `compose.yml`. Building in GitHub Actions and pulling from GHCR removes this class of failure entirely.
- **Planning Poker calibration takes more than one sprint.** First-round estimates varied widely (range: 5–100 SP per PBI). The 100 SP assigned to database schema migration was based on the feature's scope relative to simpler tasks, not measured against actual hours. Velocity data from Sprint 4 will make estimates more reliable.

## Validated assumptions

- **API stub layer successfully decoupled frontend from backend delivery.** The frontend MVP v1 was completed and deployed two sprints before the backend was ready. The stub layer abstracted the API surface so that the switch to live endpoints will not require frontend component changes.
- **A single admin user with a shared password is sufficient for MVP v1.** No multi-user editorial conflict was observed during Sprint 3 testing; the single-admin model holds for the current scope.
- **Inline `contentEditable` editing is viable for the admin use case.** The customer did not raise concerns about the editing UX during acceptance reviews; no separate rich-text editor is needed for MVP v1.

## Friction and gaps

- **Backend not connected to frontend.** All data shown on the portal is still from API stubs. Students and the customer cannot see real data until Sprint 4 is complete.
- **US-12 (fill out questionnaire) and admin inline editing are still in progress** — these were committed Sprint 3 scope items that did not reach Done by the sprint end.
- **Several story point estimates remain TBD** (#23, #29, US-01/05/08/04). Total sprint velocity cannot be computed until these are estimated.
- **No end-to-end integration tests exist.** Playwright smoke tests (#48) were planned for Sprint 3 but not started. A backend deploy failure could go undetected until a student visits the site.
- **Customer Sprint Review is scheduled for 2026-06-20** (today) — feedback and scope decisions from this meeting are not yet incorporated.

## Planned response

- **Sprint 4:** replace API stub layer with live FastAPI endpoints for events (#40), members (#39), questionnaires, and admin operations. Relevant issues: [#40](https://github.com/sweetlife999/SWP/issues/40), [#39](https://github.com/sweetlife999/SWP/issues/39), [#44](https://github.com/sweetlife999/SWP/issues/44).
- **Sprint 4:** close US-12 and admin inline editing (#32) — both were carried over from Sprint 3.
- **Sprint 4:** estimate all TBD story point items so total backlog size can be reported accurately.
- After the customer review today, update `docs/user-stories.md`, `docs/roadmap.md`, and `reports/week3/customer-review-summary.md` to reflect any scope changes agreed with the customer.
