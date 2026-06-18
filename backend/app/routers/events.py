from datetime import date

import asyncpg
from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.auth import require_admin
from app.computed import DEPT_MAP, dept_tag, dept_tag_cls, event_date_str, event_dd, event_mm, is_past
from app.database import get_pool
from app.models.schemas import EventCreate, EventOut, EventPatch

router = APIRouter(prefix="/events", tags=["events"])
admin_router = APIRouter(prefix="/admin/events", tags=["admin-events"],
                         dependencies=[Depends(require_admin)])

_SELECT = """
    SELECT id, title, description, event_date, event_time, department,
           cover_class, foot_text, foot_label, featured, status_text
    FROM events
"""


def _row_to_event(row: asyncpg.Record) -> EventOut:
    d: date = row["event_date"]
    past = is_past(d)
    t = row["event_time"]
    return EventOut(
        id=row["id"],
        title=row["title"],
        desc=row["description"],
        date=event_date_str(d),
        dd=event_dd(d),
        mm=event_mm(d),
        cover=row["cover_class"] or "",
        tag=dept_tag(row["department"]),
        tagCls=dept_tag_cls(row["department"]),
        time=f"{t.hour:02d}:{t.minute:02d}" if t else None,
        foot=row["foot_text"] or "",
        footLabel=row["foot_label"] or None,
        featured=row["featured"] or None,
        past=past or None,
        status="passed" if past else "live",
        statusText=row["status_text"] or None,
    )


@router.get("", response_model=list[EventOut])
async def list_events(request: Request) -> list[EventOut]:
    pool: asyncpg.Pool = get_pool(request)
    rows = await pool.fetch(_SELECT + "ORDER BY event_date DESC, id DESC")
    return [_row_to_event(r) for r in rows]


@router.get("/{event_id}", response_model=EventOut)
async def get_event(event_id: int, request: Request) -> EventOut:
    pool: asyncpg.Pool = get_pool(request)
    row = await pool.fetchrow(_SELECT + "WHERE id = $1", event_id)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    return _row_to_event(row)


@router.post("", response_model=EventOut, status_code=status.HTTP_201_CREATED,
             dependencies=[Depends(require_admin)])
async def create_event(body: EventCreate, request: Request) -> EventOut:
    pool: asyncpg.Pool = get_pool(request)
    row = await pool.fetchrow(
        """
        INSERT INTO events
          (title, description, event_date, event_time, department,
           cover_class, foot_text, foot_label, featured, status_text)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id, title, description, event_date, event_time, department,
                  cover_class, foot_text, foot_label, featured, status_text
        """,
        body.title,
        body.desc,
        body.date,              # already a datetime.date from Pydantic
        body.time or None,
        DEPT_MAP[body.tag],     # Literal guarantees key is valid
        body.cover,
        body.foot,
        body.footLabel,
        body.featured,
        body.statusText,
    )
    return _row_to_event(row)


@router.patch("/{event_id}", response_model=EventOut,
              dependencies=[Depends(require_admin)])
async def patch_event(event_id: int, body: EventPatch, request: Request) -> EventOut:
    return await _apply_patch(event_id, body, get_pool(request))


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT,
               dependencies=[Depends(require_admin)])
async def delete_event(event_id: int, request: Request) -> None:
    await _delete_event(event_id, get_pool(request))


# ── Admin-namespaced mirrors (/admin/events/*) ────────────────────────────────

@admin_router.get("", response_model=list[EventOut])
async def admin_list_events(request: Request) -> list[EventOut]:
    pool: asyncpg.Pool = get_pool(request)
    rows = await pool.fetch(_SELECT + "ORDER BY event_date DESC, id DESC")
    return [_row_to_event(r) for r in rows]


@admin_router.patch("/{event_id}", response_model=EventOut)
async def admin_patch_event(event_id: int, body: EventPatch, request: Request) -> EventOut:
    return await _apply_patch(event_id, body, get_pool(request))


@admin_router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_event(event_id: int, request: Request) -> None:
    await _delete_event(event_id, get_pool(request))


# ── Shared helpers ────────────────────────────────────────────────────────────

async def _apply_patch(event_id: int, body: EventPatch, pool: asyncpg.Pool) -> EventOut:
    provided = body.model_fields_set
    if not provided:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                            detail="No fields to update")

    updates: list[str] = []
    params: list = []

    def add(col: str, val) -> None:
        # col is always a hardcoded string literal below, never user input.
        params.append(val)
        updates.append(f"{col} = ${len(params)}")

    # Non-nullable DB columns: reject explicit null, skip if absent.
    for field, col, val in [
        ("title",    "title",       body.title),
        ("desc",     "description", body.desc),
        ("cover",    "cover_class", body.cover),
        ("foot",     "foot_text",   body.foot),
    ]:
        if field in provided:
            if val is None:
                raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                                    detail=f"'{field}' cannot be null")
            add(col, val)

    if "date" in provided:
        if body.date is None:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                                detail="'date' cannot be null")
        add("event_date", body.date)   # already datetime.date from Pydantic

    if "tag" in provided:
        if body.tag is None:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                                detail="'tag' cannot be null")
        add("department", DEPT_MAP[body.tag])  # Literal guarantees valid key

    if "featured" in provided:
        if body.featured is None:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                                detail="'featured' cannot be null")
        add("featured", body.featured)

    # Nullable DB columns: explicit null clears the field.
    if "time" in provided:
        add("event_time", body.time or None)
    if "footLabel" in provided:
        add("foot_label", body.footLabel)
    if "statusText" in provided:
        add("status_text", body.statusText)

    if not updates:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                            detail="No valid fields to update")

    params.append(event_id)
    row = await pool.fetchrow(
        f"UPDATE events SET {', '.join(updates)}, updated_at = now() "
        f"WHERE id = ${len(params)} "
        f"RETURNING id, title, description, event_date, event_time, department, "
        f"cover_class, foot_text, foot_label, featured, status_text",
        *params,
    )
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    return _row_to_event(row)


async def _delete_event(event_id: int, pool: asyncpg.Pool) -> None:
    result = await pool.execute("DELETE FROM events WHERE id = $1", event_id)
    if result == "DELETE 0":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
