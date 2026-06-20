# Sprint 3 Retrospective

## What went well

1. **Frontend MVP shipped on time.** All six MVP v1 user stories are visually complete and accessible at [https://su.fblrkus.ru](https://su.fblrkus.ru), including the questionnaire viewer, admin event management, and inline content editing.
2. **Deploy pipeline is fully automated.** GitHub Actions builds all three Docker images (frontend, backend, db), pushes them to GHCR, and the VPS only pulls — no manual steps needed on the server after a merge to main.
3. **PR workflow was followed consistently.** Every feature has an issue-linked branch, a PR, and at least one review comment. The team used issue templates, the extended PR template, and branch naming conventions throughout the sprint.

## What did not go well

1. **Backend integration was not completed.** The FastAPI backend was scaffolded and the database schema written, but the API endpoints are not yet wired to the frontend — all student-facing pages still show API stub data.
2. **Multiple deploy failures cost significant time.** Three separate deploy bugs (missing database build context, port conflict on VPS, pydantic-settings CORS crash) required hotfix PRs and delayed the backend going live.
3. **Estimation accuracy was low for infrastructure tasks.** Several PBIs still have TBD story points, and the gap between the planned Sprint 3 scope and what was actually completed is hard to measure without velocity data.

## Action points

1. In Sprint 4, start backend endpoint integration in week 1 of the sprint — not in the final days. Specifically: replace the API stub layer with live FastAPI calls for events, members, and questionnaires.
2. Before merging any backend PR, verify all environment variable names and formats against the deployed `.env` — run `docker compose up` locally with the real `.env.example` values before opening a PR.
