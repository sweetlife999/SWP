from datetime import date

import asyncpg
from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.auth import require_admin
from app.computed import (
    DEPT_MAP,
    dept_tag,
    dept_tag_cls,
    event_date_str,
    event_dd,
    event_mm,
    is_past,
)
from app.database import get_pool
from app.models.schemas import EventCreate, EventOut, EventPatch
from app.sql_patch import SqlPatchBuilder, require_fields_provided

router = APIRouter(prefix="/events", tags=["events"])
admin_router = APIRouter(
    prefix="/admin/events", tags=["admin-events"], dependencies=[Depends(require_admin)]
)

_SELECT = """
    SELECT id, title, description, event_date, event_time, department,
           cover_class, photo_url, foot_text, foot_label, featured, status, status_text,
           event_format, age_limit, location_address
    FROM events
"""

_RETURNING = (
    "id, title, description, event_date, event_time, department, "
    "cover_class, photo_url, foot_text, foot_label, featured, status, status_text, "
    "event_format, age_limit, location_address"
)


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
        photo_url=row["photo_url"] or "",
        tag=dept_tag(row["department"]),
        tagCls=dept_tag_cls(row["department"]),
        time=f"{t.hour:02d}:{t.minute:02d}" if t else None,
        foot=row["foot_text"] or "",
        footLabel=row["foot_label"] or None,
        featured=row["featured"] or None,
        past=past or None,
        status=row["status"],
        statusText=row["status_text"] or None,
        format=row["event_format"],
        age=row["age_limit"],
        locationAddress=row["location_address"] or "",
    )


# ── Public ────────────────────────────────────────────────────────────────────


@router.get("", response_model=list[EventOut])
async def list_events(request: Request) -> list[EventOut]:
    """AC1: only published events are visible in the public listing (drafts/archived excluded)."""
    pool: asyncpg.Pool = get_pool(request)
    rows = await pool.fetch(
        _SELECT + "WHERE status = 'published' ORDER BY event_date DESC, id DESC LIMIT 500"
    )
    return [_row_to_event(r) for r in rows]


@router.get("/{event_id}", response_model=EventOut)
async def get_event(event_id: int, request: Request) -> EventOut:
    """Public. Returns a published event by id."""
    pool: asyncpg.Pool = get_pool(request)
    row = await pool.fetchrow(_SELECT + "WHERE id = $1 AND status = 'published'", event_id)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    return _row_to_event(row)


# ── Admin ─────────────────────────────────────────────────────────────────────


@admin_router.get("", response_model=list[EventOut])
async def admin_list_events(request: Request) -> list[EventOut]:
    """Returns all events regardless of status."""
    pool: asyncpg.Pool = get_pool(request)
    rows = await pool.fetch(_SELECT + "WHERE TRUE ORDER BY event_date DESC, id DESC LIMIT 500")
    return [_row_to_event(r) for r in rows]


@admin_router.post("", response_model=EventOut, status_code=status.HTTP_201_CREATED)
async def create_event(body: EventCreate, request: Request) -> EventOut:
    """Creates a draft. Status defaults to 'draft' at the DB level."""
    pool: asyncpg.Pool = get_pool(request)
    row = await pool.fetchrow(
        """
        INSERT INTO events
          (title, description, event_date, event_time, department,
           cover_class, photo_url, foot_text, foot_label, featured, status_text,
           event_format, age_limit, location_address)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING """
        + _RETURNING,
        body.title,
        body.desc,
        body.date,
        body.time or None,
        DEPT_MAP[body.tag],
        body.cover,
        body.photo_url,
        body.foot,
        body.footLabel,
        body.featured,
        body.statusText,
        body.format,
        body.age,
        body.locationAddress,
    )
    return _row_to_event(row)


@admin_router.patch("/{event_id}", response_model=EventOut)
async def patch_event(event_id: int, body: EventPatch, request: Request) -> EventOut:
    """AC2: sending {status: 'published'} makes the event visible on GET /events."""
    return await _apply_patch(event_id, body, get_pool(request))


@admin_router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(event_id: int, request: Request) -> None:
    """AC3: only draft events may be deleted; published/archived return 422."""
    pool: asyncpg.Pool = get_pool(request)
    row = await pool.fetchrow("SELECT status FROM events WHERE id = $1", event_id)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    if row["status"] != "draft":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Cannot delete a {row['status']} event; archive it instead",
        )
    await pool.execute("DELETE FROM events WHERE id = $1", event_id)


# ── Shared helper ─────────────────────────────────────────────────────────────


async def _apply_patch(event_id: int, body: EventPatch, pool: asyncpg.Pool) -> EventOut:
    provided = body.model_fields_set
    require_fields_provided(provided)

    patch = SqlPatchBuilder()
    add = patch.add

    # Non-nullable columns: reject explicit null.
    for field, col, val in [
        ("title", "title", body.title),
        ("desc", "description", body.desc),
        ("cover", "cover_class", body.cover),
        ("foot", "foot_text", body.foot),
    ]:
        if field in provided:
            if val is None:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"'{field}' cannot be null",
                )
            add(col, val)

    if "date" in provided:
        if body.date is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="'date' cannot be null"
            )
        add("event_date", body.date)

    if "tag" in provided:
        if body.tag is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="'tag' cannot be null"
            )
        add("department", DEPT_MAP[body.tag])

    if "featured" in provided:
        if body.featured is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="'featured' cannot be null"
            )
        add("featured", body.featured)

    if "status" in provided:
        if body.status is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="'status' cannot be null"
            )
        add("status", body.status)

    # Nullable columns: explicit null clears the field.
    if "photo_url" in provided:
        add("photo_url", body.photo_url or "")
    if "time" in provided:
        add("event_time", body.time or None)
    if "footLabel" in provided:
        add("foot_label", body.footLabel)
    if "statusText" in provided:
        add("status_text", body.statusText)
    if "format" in provided and body.format is not None:
        add("event_format", body.format)
    if "age" in provided and body.age is not None:
        add("age_limit", body.age)
    if "locationAddress" in provided and body.locationAddress is not None:
        add("location_address", body.locationAddress)

    patch.require_updates()

    patch.params.append(event_id)
    row = await pool.fetchrow(
        f"UPDATE events SET {', '.join(patch.updates)}, updated_at = now() "
        f"WHERE id = ${len(patch.params)} "
        f"RETURNING {_RETURNING}",
        *patch.params,
    )
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    return _row_to_event(row)
