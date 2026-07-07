# Student Union Portal

A centralized web platform connecting Innopolis University students with the Student Union. Students can browse upcoming events, discover SU members and departments, and participate in questionnaires. SU:Core members manage content and coordinate internal tasks through a built-in admin interface.

**Live:** [https://su.fblrkus.ru](https://su.fblrkus.ru)

---

## Reports

| Assignment | Report |
|------------|--------|
| Assignment 5 (Sprint 5 - MVP v2) | [reports/week5/README.md](reports/week5/README.md) |
| Assignment 4 (Sprint 4 — Integration, Quality & Automation) | [reports/week4/README.md](reports/week4/README.md) |
| Assignment 3 (Sprint 3 — MVP v1) | [reports/week3/README.md](reports/week3/README.md) |
| Assignment 2 (Sprint 2 — MVP v0) | [reports/week2/README.md](reports/week2/README.md) |

---

## Access to MVP v2

The deployed site is publicly accessible at [https://su.fblrkus.ru](https://su.fblrkus.ru).

**Admin panel:** navigate to [https://su.fblrkus.ru/admin](https://su.fblrkus.ru/admin) — redirects to `/admin/login`. No public login button on the main site by design. Contact the team for admin credentials.

---

## Local setup

### Requirements

- Node.js ≥ 18
- Python 3.12
- Docker + Docker Compose (for full stack)

### Full stack (recommended)

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs

### Frontend only (without Docker)

```bash
cd frontend
npm install
npm run dev        # → http://localhost:5173
npm run build      # production build → frontend/dist/
```

### Backend only (without Docker)

```bash
cd backend
pip install -r requirements.txt
# set DB_URL and SECRET_KEY in .env
uvicorn app.main:app --reload
```

### Linting

```bash
# Frontend
cd frontend && npm run lint && npx tsc --noEmit

# Backend
cd backend && ruff check . && ruff format --check .
```

---

## Deployment

The site is deployed on a VPS behind nginx (TLS via Let's Encrypt). On every push to `main` that touches `frontend/`, `backend/`, or `compose.yml`, GitHub Actions:

1. Builds Docker images and pushes them to GHCR
2. SSHes to the server and runs `docker compose pull && docker compose up -d`

---

## Repository structure

```
.
|-- .github/
|   |-- ISSUE_TEMPLATE/
|   |-- workflows/
|   |   |-- backend-lint.yml
|   |   |-- backend-tests.yml
|   |   |-- deploy.yml
|   |   |-- frontend-lint.yml
|   |   `-- link-check.yml
|   `-- pull_request_template.md
|-- backend/               - FastAPI + asyncpg + Alembic
|   |-- app/
|   |   |-- models/
|   |   |-- routers/
|   |   |-- auth.py
|   |   |-- computed.py
|   |   |-- config.py
|   |   |-- database.py
|   |   `-- main.py
|   |-- tests/
|   |-- Dockerfile
|   |-- README.md
|   |-- mantra.md
|   |-- pyproject.toml
|   |-- pyrightconfig.json
|   |-- requirements-dev.txt
|   `-- requirements.txt
|-- compose.local.yml
|-- compose.yml
|-- database/              - PostgreSQL migrations
|   |-- migrations/
|   |   |-- 0001_init.sql
|   |   |-- 0002_content_seed.sql
|   |   |-- 0003_stats_views.sql
|   |   |-- 0004_kanban_seed.sql
|   |   |-- 0005_event_format_age.sql
|   |   |-- 0006_event_detail_fields.sql
|   |   `-- 0007_member_is_active.sql
|   |-- Dockerfile
|   |-- README.md
|   `-- run-migrations.sh
|-- docs/                  - user stories, roadmap, definition of done, quality and testing docs
|   |-- architecture/
|   |-- definition-of-done.md
|   |-- development-process.md
|   |-- Process_Requirements.md
|   |-- quality-requirement-tests.md
|   |-- quality-requirements.md
|   |-- roadmap.md
|   |-- testing.md
|   |-- user-acceptance-tests.md
|   `-- user-stories.md
|-- frontend/              - React + TypeScript + Vite
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |-- hooks/
|   |   |-- lib/
|   |   |-- pages/
|   |   |-- tests/
|   |   |-- App.tsx
|   |   |-- main.tsx
|   |   `-- styles.css
|   |-- Dockerfile
|   |-- eslint.config.js
|   |-- index.html
|   |-- nginx.conf
|   |-- package.json
|   |-- playwright.config.ts
|   |-- tsconfig.json
|   `-- vite.config.ts
|-- reports/
|   |-- week2/             - Assignment 2 reports
|   |-- week3/             - Assignment 3 reports (Sprint 3 - MVP v1)
|   |-- week4/             - Assignment 4 reports (Sprint 4 - Integration, Quality & Automation)
|   `-- week5/             - Assignment 5 reports (Sprint 5 - MVP v2)
|-- CHANGELOG.md
|-- LICENSE
|-- README.md
|-- thumbor.conf
`-- ...
```
