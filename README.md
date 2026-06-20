# Student Union Portal

A centralized web platform connecting Innopolis University students with the Student Union. Students can browse upcoming events, discover SU members and departments, and participate in questionnaires. SU:Core members manage content and coordinate internal tasks through a built-in admin interface.

**Live:** [https://su.fblrkus.ru](https://su.fblrkus.ru)

## Assignment 2 report

[reports/week2/README.md](reports/week2/README.md)

## Local setup

### With Docker (recommended)

Requires Docker.

```bash
docker compose up --build
```

This starts three services:

- Frontend at [http://localhost:3000](http://localhost:3000)
- Backend health endpoint at [http://localhost:8080/health](http://localhost:8080/health)
- PostgreSQL with persistent data in the named `pgdata` volume

The frontend container proxies `/api` requests to the backend, so the browser can talk to the app from a single origin.

### Without Docker

Requires Node.js ≥ 18 for the frontend and Python 3.12+ for the backend.

```bash
cd frontend
npm install
npm run dev        # → http://localhost:5173
```

```bash
npm run build      # production build → frontend/dist/
npm run preview    # → http://localhost:4173
```

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt -r requirements-dev.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Before running the backend locally, copy [backend/.env.example](backend/.env.example) to `backend/.env` and adjust the secrets if needed. The backend expects PostgreSQL at `postgresql://su:su_dev_password@localhost:5432/su_portal` when running outside Docker.

## Deployment

The site is deployed on a VPS behind nginx (TLS via Let's Encrypt). On every push to `main` that touches `frontend/` or `compose.yml`, GitHub Actions:

1. Builds a Docker image and pushes it to `ghcr.io/sweetlife999/swp-frontend:latest`
2. SSHes to the server and runs `docker compose pull && docker compose up -d`

The server runs the container on `127.0.0.1:3000`; nginx proxies HTTPS traffic to it.

## Structure

```
backend/           — FastAPI + PostgreSQL API
frontend/          — React + TypeScript + Vite (source)
compose.yml        — Docker Compose for the frontend, backend, and PostgreSQL services
reports/week2/     — Assignment 2 report
.github/
  workflows/
    deploy.yml     — CI/CD: build Docker image, push to GHCR, deploy to VPS
    link-check.yml — Lychee link checker
  pull_request_template.md
```
