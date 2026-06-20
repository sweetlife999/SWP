# Student Union Portal

A centralized web platform connecting Innopolis University students with the Student Union. Students can browse upcoming events, discover SU members and departments, and participate in questionnaires. SU:Core members manage content and coordinate internal tasks through a built-in admin interface.

**Live site:** [https://su.fblrkus.ru](https://su.fblrkus.ru)

---

## Reports

| Assignment | Report |
|------------|--------|
| Assignment 3 (Sprint 3 — MVP v1) | [reports/week3/README.md](reports/week3/README.md) |
| Assignment 2 (Sprint 2 — MVP v0) | [reports/week2/README.md](reports/week2/README.md) |

---

## Access to MVP v1

The deployed site is publicly accessible at [https://su.fblrkus.ru](https://su.fblrkus.ru).

**Admin panel:** navigate to [https://su.fblrkus.ru/admin](https://su.fblrkus.ru/admin) — redirects to `/admin/login`. No public login button on the main site by design. Contact the team for admin credentials.

---

## Local setup

### Requirements

- Node.js ≥ 18
- Python 3.12
- Docker + Docker Compose (for full stack)

### Frontend only

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

### Full stack (frontend + backend + database)

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs

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

## Repository structure

```
frontend/          — React + TypeScript + Vite
backend/           — FastAPI + asyncpg + Alembic
deploy/            — Docker Compose, server config
docs/              — user-stories.md, roadmap.md, definition-of-done.md
reports/
  week2/           — Assignment 2 reports
  week3/           — Assignment 3 reports (Sprint 3 — MVP v1)
.github/
  workflows/       — CI: frontend lint, link-check, backend lint
  ISSUE_TEMPLATE/
  pull_request_template.md
CHANGELOG.md
```
