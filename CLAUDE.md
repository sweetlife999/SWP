# CLAUDE.md

Student Union Portal — React/TypeScript frontend + FastAPI/Postgres backend.

## Build

```bash
docker compose up --build   # full stack: frontend :3000, backend :8000 (docs at /docs)
cd frontend && npm run build
cd backend && pip install -r requirements.txt -r requirements-dev.txt
```

## Test

```bash
cd backend && pytest --cov=app --cov-report=term-missing
# integration tests (marked @pytest.mark.integration) require DATABASE_URL
```

## Lint / typecheck

```bash
cd frontend && npm run lint && npx tsc --noEmit
cd backend && ruff check . && ruff format --check . && mypy .
```

## Dev server

```bash
cd frontend && npm run dev     # http://localhost:5173
cd backend && uvicorn app.main:app --reload   # http://localhost:8000
```

Copy `backend/.env.example` to `backend/.env` before running the backend outside Docker.
