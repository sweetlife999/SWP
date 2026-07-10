# Student Union Portal – Handover Documentation
## 1. Repository & Services
| Artifact | Location | Notes |
|----------|----------|-------|
| Code | `https://github.com/sweetlife999/swp` | Repository assigned to the customer team. All major branches merged into main.
| Front-end | `frontend/` | React + TypeScript, served on port 3000 in local dev. Deployed behind NGINX with TLS.
| Back-end | `backend/` | FastAPI, runs on port 9999 inside Docker. API docs at `http://localhost:9999/docs`.
| DB | `docker compose.yml` | PostgreSQL 16, data stored in Pgdata volume. Auto-migration via `migrate` service.
| Deployment | `deploy.yml` | SSH key-based; uses `docker compose pull && up -d` on production VPS.

## 2. Access & Credentials
| Role | Access | Details |
|------|--------|---------|
| Admin users | HTTP Basic (JWT) | Login via `/admin/login`. Password stored in `.env`.
| DB Admin | PostgreSQL user `su` | Password managed separately (default: `su_dev_password`).
| NGINX/Reverse proxy | Remote server user `deploy` | Private key accessible via repo secrets. SSH key rotation required.

**Important**: ✘ Do **not** share secrets in this document. Provide them via encrypted channel.

## 3. Environment Variables
All runtime values loaded from `backend/.env`:
```
DATABASE_URL=postgresql://su_app:APP_DB_PASSWORD@db:5432/su_portal
ADMIN_PASSWORD=<PRODUCTION_PASSWORD>
JWT_SECRET=<strength>=16 characters
TOKEN_EXPIRE_HOURS=168
CORS_ORIGINS=http://localhost:3000,https://su.fblrkus.ru
DEBUG=false
```
**Tip**: Use non-production `.env` files (not committed) for local development.

## 4. Setup & Verification
1. **Clone repository**: 
   ```bash
git clone https://github.com/sweetlife999/swp
cd swp
```
2. **Create `.env`** in `backend/` with production values.
3. **Provision infrastructure**: 
   - Ensure Docker/Docker-Compose installed on VPS.
4. **Deploy**: 
   ```bash
   # SSH into VPS
   cd /opt/swp
   docker compose pull && docker compose up -d
```
5. **Verify containers**: 
   ```bash
docker ps
# Should list: frontend, backend, db, thumbor, migrate, etc.
```
6. **Check health**: 
   - Web UI: `https://PLACEHOLDER_TODO` (reachable)
   - Admin login: `https://PLACEHOLDER_TODO/admin` (SSH + JWT auth).
   - Verified services: DB, thumbor, thumbor.conf.

## 5. Documentation & Support
- **API Docs**: `http://localhost:9999/docs` (or deployed path).
- **Front-end Dev**: `frontend/src/` (JSX/TSX), tests at `frontend/src/__tests__/`.
- **Back-end Dev**: `backend/app/` (routes in `routers/`).
- **Database**: `database/migrations/` (SQL files).
- **CI/CD**: `/.github/workflows/` (lint/test/deploy pipelines).
- **UAT**: `docs/user-acceptance-tests.md`.
- **Acceptance Criteria**: `docs/definition-of-done.md`.

## 6. Open Items & Remaining Support
- Security: Implement HTTPS + validate TLS certificates.
- Backup: Enable VPS-level backups + database point-in-time recovery.
- Monitoring: Set up Prometheus metrics for traffic/response-time analysis.
- Compliance: Audit roles/permissions to ensure least-privilege access.

> This document reflects the current production state and dependencies. Follow this guide to take ownership smoothly without operational gaps.