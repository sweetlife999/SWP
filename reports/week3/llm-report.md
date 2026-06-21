# LLM Usage Report — Week 3

## Tools used

**Claude Code (Claude Sonnet 4.6)** — used throughout Sprint 3 via the `claude` CLI and the VS Code extension.

---

## How AI tools were used

### Report and documentation writing

Claude Code was used to draft and maintain the following files:

- `docs/roadmap.md` — initial structure and sprint goal wording
- `docs/user-stories.md` — migration of user stories from Assignment 2 into GitHub-linked index format
- `reports/week3/sprint-report.md` — structure, backlog size table, MVP v1 scope table, next-steps section
- `reports/week3/reflection.md`, `retrospective.md` — structure and initial content based on actual sprint events
- `reports/week3/agenda.md` — Sprint Review agenda for the customer meeting

In all cases, the team reviewed, edited, and approved the generated content. Filler text was removed or replaced with project-specific information.

### Debugging

Claude Code helped diagnose three deploy failures:

1. **`unable to prepare context: path "/opt/swp/database" not found`** — traced to the database directory not being present on the VPS at build time. Fix: build the database image in CI and push to GHCR; server only pulls.
2. **Port 5432 already allocated** — identified that another container (`9-12ege-db-1`) held the port. Fix: remap to `6767:5432`.
3. **`pydantic_settings.exceptions.SettingsError: error parsing value for field "cors_origins"`** — root-caused to pydantic-settings v2 calling `json.loads()` on `list[str]` fields before any validator runs. Fix: change field type to `str` and expose `cors_origins_list` as a `@property`.

### Code review

Claude Code reviewed PRs #55 (backend) and #60 (error handling / empty states) at the team's request. Findings were discussed in the team chat only and not posted to GitHub. Key issues identified:

- PR #60: `useFetch` infinite re-render bug when `options` object passed inline, wrong API paths (`/api/kanban` vs `/api/admin/kanban`, `/api/surveys` vs `/api/questionnaires`), missing auth header on PATCH requests, no step reset on survey switch.

### Workflow and configuration

Claude Code wrote the GitHub Actions deploy workflow (`.github/workflows/deploy.yml`) changes for building all three images in CI and writing the backend `.env` from a GitHub Secret.

---

## What was done by the team without AI

- Planning Poker estimates and backlog prioritisation decisions
- Customer interview and sprint review meeting
- All code implementation (frontend components, backend FastAPI routes, database migrations)
- PR reviews and merge decisions
- Repository setup, branch protection rules, and issue template design
