import asyncpg
from fastapi import APIRouter, Request

from app.database import get_pool
from app.models.schemas import EventOut
from app.routers.events import _SELECT, _row_to_event

router = APIRouter(prefix="/news", tags=["news"])


@router.get("", response_model=list[EventOut])
async def get_news(request: Request) -> list[EventOut]:
    """Returns the 4 most recent published or archived events."""
    pool: asyncpg.Pool = get_pool(request)
    rows = await pool.fetch(
        _SELECT
        + "WHERE status IN ('published', 'archived') ORDER BY event_date DESC, id DESC LIMIT 4"
    )
    return [_row_to_event(r) for r in rows]
