import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import create_pool, get_pool
from app.routers import admin, content, events, kanban, members, questionnaires, surveys


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Refuse to start in production with the default JWT secret.
    if not settings.debug and settings.jwt_secret == "dev-secret-change-in-production":
        raise RuntimeError(
            "JWT_SECRET is set to the insecure default. "
            "Set a strong JWT_SECRET env var, or set DEBUG=true for local development."
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
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)

app.include_router(events.router, prefix="/api")
app.include_router(events.admin_router, prefix="/api")
app.include_router(members.router, prefix="/api")
app.include_router(surveys.router, prefix="/api")
app.include_router(content.router, prefix="/api")
app.include_router(kanban.router, prefix="/api")
app.include_router(questionnaires.router, prefix="/api")
app.include_router(questionnaires.admin_router, prefix="/api")
app.include_router(admin.router, prefix="/api")


@app.get("/health")
async def health(request: Request) -> JSONResponse:
    # Probes the DB so load balancers catch an outage, not just a crashed process.
    try:
        await asyncio.wait_for(get_pool(request).fetchval("SELECT 1"), timeout=2.0)
        return JSONResponse({"status": "ok"})
    except Exception:
        return JSONResponse({"status": "db_unavailable"}, status_code=503)
