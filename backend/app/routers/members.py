import asyncpg
from fastapi import APIRouter, Depends, Request, status

from app.auth import require_admin
from app.computed import dept_tag
from app.database import get_pool
from app.models.schemas import MemberCreate, MemberOut

router = APIRouter(prefix="/members", tags=["members"])


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
async def list_members(request: Request) -> list[MemberOut]:
    pool: asyncpg.Pool = get_pool(request)
    rows = await pool.fetch(
        """
        SELECT id, name, department, role, meta, bio, recent
        FROM members
        WHERE active = TRUE
        ORDER BY department, sort_order, id
        """
    )
    return [_row_to_member(r) for r in rows]


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
        body.recent,
    )
    return _row_to_member(row)
