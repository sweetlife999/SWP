from typing import Optional

import asyncpg
from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.auth import require_admin
from app.computed import dept_tag
from app.database import get_pool
from app.models.schemas import (
    Department, MemberCreate, MemberOut, MemberPatch, MemberReorderItem,
)

router = APIRouter(prefix="/members", tags=["members"])
admin_router = APIRouter(prefix="/admin/members", tags=["admin-members"],
                         dependencies=[Depends(require_admin)])

_SELECT = """
    SELECT id, name, department, role, meta, bio, photo_url, recent
    FROM members
"""


def _row_to_member(row: asyncpg.Record) -> MemberOut:
    return MemberOut(
        id=str(row["id"]),
        dep=row["department"],
        tag=dept_tag(row["department"]),
        name=row["name"],
        role=row["role"],
        meta=row["meta"] or "",
        bio=row["bio"] or "",
        photo_url=row["photo_url"] or "",
        recent=list(row["recent"] or []),
    )


# ── Public ────────────────────────────────────────────────────────────────────

@router.get("", response_model=list[MemberOut])
async def list_members(
    request: Request,
    dep: Optional[Department] = None,
) -> list[MemberOut]:
    """AC1: optional ?dep=core|active|media filter."""
    pool: asyncpg.Pool = get_pool(request)
    if dep:
        rows = await pool.fetch(
            _SELECT + "WHERE active = TRUE AND department = $1 ORDER BY sort_order, id",
            dep,
        )
    else:
        rows = await pool.fetch(
            _SELECT + "WHERE active = TRUE ORDER BY department, sort_order, id"
        )
    return [_row_to_member(r) for r in rows]


@router.get("/{member_id}", response_model=MemberOut)
async def get_member(member_id: int, request: Request) -> MemberOut:
    pool: asyncpg.Pool = get_pool(request)
    row = await pool.fetchrow(_SELECT + "WHERE active = TRUE AND id = $1", member_id)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Member not found")
    return _row_to_member(row)


# ── Admin ─────────────────────────────────────────────────────────────────────

@admin_router.post("", response_model=MemberOut, status_code=status.HTTP_201_CREATED)
async def create_member(body: MemberCreate, request: Request) -> MemberOut:
    """AC2: created member immediately appears on GET /members."""
    pool: asyncpg.Pool = get_pool(request)
    row = await pool.fetchrow(
        """
        INSERT INTO members (name, department, role, meta, bio, photo_url, recent)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, name, department, role, meta, bio, photo_url, recent
        """,
        body.name,
        body.dep,
        body.role,
        body.meta,
        body.bio,
        body.photo_url,
        list(body.recent),
    )
    return _row_to_member(row)


@admin_router.patch("/reorder", status_code=status.HTTP_204_NO_CONTENT)
async def reorder_members(body: list[MemberReorderItem], request: Request) -> None:
    """Bulk-update sort_order. Accepts [{id, sort_order}, ...] for any subset of members."""
    if not body:
        return
    pool: asyncpg.Pool = get_pool(request)
    async with pool.acquire() as conn:
        async with conn.transaction():
            await conn.executemany(
                "UPDATE members SET sort_order = $1 WHERE id = $2 AND active = TRUE",
                [(item.sort_order, item.id) for item in body],
            )


@admin_router.patch("/{member_id}", response_model=MemberOut)
async def patch_member(member_id: int, body: MemberPatch, request: Request) -> MemberOut:
    provided = body.model_fields_set
    if not provided:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                            detail="No fields to update")

    updates: list[str] = []
    params: list = []

    def add(col: str, val) -> None:
        params.append(val)
        updates.append(f"{col} = ${len(params)}")

    # Non-nullable columns: ignore explicit null (Pydantic already rejects missing required)
    if "dep" in provided and body.dep is not None:
        add("department", body.dep)
    if "name" in provided and body.name is not None:
        add("name", body.name)
    if "role" in provided and body.role is not None:
        add("role", body.role)
    # Nullable-by-convention fields: sending null resets to empty
    if "meta" in provided:
        add("meta", body.meta or "")
    if "bio" in provided:
        add("bio", body.bio or "")
    if "photo_url" in provided:
        add("photo_url", body.photo_url or "")
    if "recent" in provided:
        add("recent", list(body.recent) if body.recent is not None else [])

    if not updates:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                            detail="No valid fields to update")

    pool: asyncpg.Pool = get_pool(request)
    params.append(member_id)
    row = await pool.fetchrow(
        f"UPDATE members SET {', '.join(updates)} "
        f"WHERE id = ${len(params)} AND active = TRUE "
        f"RETURNING id, name, department, role, meta, bio, photo_url, recent",
        *params,
    )
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Member not found")
    return _row_to_member(row)


@admin_router.delete("/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_member(member_id: int, request: Request) -> None:
    """AC3: soft-delete removes member from public listing immediately."""
    pool: asyncpg.Pool = get_pool(request)
    result = await pool.execute(
        "UPDATE members SET active = FALSE WHERE id = $1 AND active = TRUE",
        member_id,
    )
    if result == "UPDATE 0":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Member not found")
