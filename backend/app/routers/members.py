from typing import Optional

import asyncpg
from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.auth import require_admin
from app.computed import dept_tag
from app.database import get_pool
from app.models.schemas import Department, MemberCreate, MemberOut, MemberPatch

router = APIRouter(prefix="/members", tags=["members"])

_SELECT = """
    SELECT id, name, department, role, meta, bio, recent
    FROM members
    WHERE active = TRUE
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
        recent=list(row["recent"] or []),
    )


@router.get("", response_model=list[MemberOut])
async def list_members(
    request: Request,
    dep: Optional[Department] = None,
) -> list[MemberOut]:
    """Public. Optional ?dep=core|active|media filter."""
    pool: asyncpg.Pool = get_pool(request)
    if dep:
        rows = await pool.fetch(
            _SELECT + "AND department = $1 ORDER BY sort_order, id",
            dep,
        )
    else:
        rows = await pool.fetch(
            _SELECT + "ORDER BY department, sort_order, id"
        )
    return [_row_to_member(r) for r in rows]


@router.get("/{member_id}", response_model=MemberOut)
async def get_member(member_id: int, request: Request) -> MemberOut:
    """Public. Returns a single active member by id."""
    pool: asyncpg.Pool = get_pool(request)
    row = await pool.fetchrow(_SELECT + "AND id = $1", member_id)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Member not found")
    return _row_to_member(row)


@router.post("", response_model=MemberOut, status_code=status.HTTP_201_CREATED,
             dependencies=[Depends(require_admin)])
async def create_member(body: MemberCreate, request: Request) -> MemberOut:
    pool: asyncpg.Pool = get_pool(request)
    row = await pool.fetchrow(
        """
        INSERT INTO members (name, department, role, meta, bio, recent)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, name, department, role, meta, bio, recent
        """,
        body.name,
        body.dep,
        body.role,
        body.meta,
        body.bio,
        list(body.recent),
    )
    return _row_to_member(row)


@router.patch("/{member_id}", response_model=MemberOut,
              dependencies=[Depends(require_admin)])
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

    # Non-nullable columns: skip if explicitly sent as null
    if "dep" in provided and body.dep is not None:
        add("department", body.dep)
    if "name" in provided and body.name is not None:
        add("name", body.name)
    if "role" in provided and body.role is not None:
        add("role", body.role)
    # meta/bio/recent have DB defaults — sending null resets them to empty
    if "meta" in provided:
        add("meta", body.meta or "")
    if "bio" in provided:
        add("bio", body.bio or "")
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
        f"RETURNING id, name, department, role, meta, bio, recent",
        *params,
    )
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Member not found")
    return _row_to_member(row)


@router.delete("/{member_id}", status_code=status.HTTP_204_NO_CONTENT,
               dependencies=[Depends(require_admin)])
async def delete_member(member_id: int, request: Request) -> None:
    # Soft-delete: preserves historical data (event credits, kanban assignees, etc.)
    pool: asyncpg.Pool = get_pool(request)
    result = await pool.execute(
        "UPDATE members SET active = FALSE WHERE id = $1 AND active = TRUE",
        member_id,
    )
    if result == "UPDATE 0":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Member not found")
