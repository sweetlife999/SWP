import asyncio
import logging
from contextlib import asynccontextmanager

import asyncpg
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import create_pool, get_pool
from app.routers import (
    admin,
    admin_questionnaires,
    content,
    events,
    kanban,
    kanban_automations,
    members,
    news,
    questionnaires,
    surveys,
    uploads,
)

logging.basicConfig(level=logging.INFO if not settings.debug else logging.DEBUG)
logger = logging.getLogger("app")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Refuse to start in production with the default JWT secret or admin password.
    if not settings.debug and settings.jwt_secret == "dev-secret-change-in-production":
        raise RuntimeError(
            "JWT_SECRET is set to the insecure default. "
            "Set a strong JWT_SECRET env var, or set DEBUG=true for local development."
        )
    if not settings.debug and settings.admin_password == "changeme":
        raise RuntimeError(
            "ADMIN_PASSWORD is set to the insecure default. "
            "Set a strong ADMIN_PASSWORD env var, or set DEBUG=true for local development."
        )
    app.state.pool = await create_pool(settings.database_url)
    yield
    await app.state.pool.close()


app = FastAPI(
    title="SU Portal API",
    lifespan=lifespan,
    # Disable interactive docs in production to avoid exposing the full API schema.
    docs_url="/docs" if settings.debug else None,
    redoc_url=None,
    openapi_url="/openapi.json" if settings.debug else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_origins.split(",")],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)

app.include_router(events.router, prefix="/api")
app.include_router(events.admin_router, prefix="/api")
app.include_router(news.router, prefix="/api")
app.include_router(members.router, prefix="/api")
app.include_router(members.admin_router, prefix="/api")
app.include_router(surveys.router, prefix="/api")
app.include_router(content.router, prefix="/api")
app.include_router(kanban.router, prefix="/api")
app.include_router(kanban_automations.router, prefix="/api")
app.include_router(questionnaires.router, prefix="/api")
app.include_router(admin_questionnaires.admin_router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(uploads.router, prefix="/api")


@app.exception_handler(asyncpg.exceptions.CheckViolationError)
async def check_violation_handler(request: Request, exc: asyncpg.exceptions.CheckViolationError) -> JSONResponse:
    # A CHECK constraint violation means the request data was incomplete/invalid
    # for its type (e.g. a scale question missing its bounds) — that's a client
    # error (422), not a server fault, and the bare 500 FastAPI would otherwise
    # return gives the frontend/admin no way to explain the failure to the user.
    logger.warning("Database check constraint violated: %s", exc)
    return JSONResponse({"detail": "Invalid data for this request"}, status_code=422)


@app.get("/health")
async def health(request: Request) -> JSONResponse:
    # Probes the DB so load balancers catch an outage, not just a crashed process.
    try:
        await asyncio.wait_for(get_pool(request).fetchval("SELECT 1"), timeout=2.0)
        return JSONResponse({"status": "ok"})
    except Exception:
        logger.exception("Health check DB probe failed")
        return JSONResponse({"status": "db_unavailable"}, status_code=503)
