# Student Union Portal

A centralized web platform connecting Innopolis University students with the Student Union. Students can browse upcoming events, discover SU members and departments, and participate in questionnaires. SU:Core members manage content and coordinate internal tasks through a built-in admin interface.

**Live:** [https://su.fblrkus.ru](https://su.fblrkus.ru)

## Assignment 2 report

[reports/week2/README.md](reports/week2/README.md)

## Local setup

### With Docker (recommended)

Requires Docker.

```bash
docker build -t swp-frontend ./frontend
docker run -p 3000:80 swp-frontend
# → http://localhost:3000
```

### Without Docker

Requires Node.js ≥ 18.

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
frontend/          — React + TypeScript + Vite (source)
compose.yml        — Docker Compose for the frontend service
reports/week2/     — Assignment 2 report
.github/
  workflows/
    deploy.yml     — CI/CD: build Docker image, push to GHCR, deploy to VPS
    link-check.yml — Lychee link checker
  pull_request_template.md
```
