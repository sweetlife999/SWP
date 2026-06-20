from typing import Annotated

import asyncpg
from fastapi import APIRouter, Depends, Path, Request

from app.auth import require_admin
from app.database import get_pool
from app.models.schemas import ContentBlockOut, ContentBlockUpdate

router = APIRouter(prefix="/content", tags=["content"])

# Slug is validated at the path level: only lowercase alphanumerics, hyphens, underscores.
_SlugPath = Annotated[str, Path(pattern=r"^[a-z0-9_-]+$", max_length=128)]


@router.get("/{slug}", response_model=ContentBlockOut)
async def get_content(slug: _SlugPath, request: Request) -> ContentBlockOut:
    pool: asyncpg.Pool = get_pool(request)
    row = await pool.fetchrow(
        "SELECT html, updated_at, updated_by FROM content_blocks WHERE slug = $1",
        slug,
    )
    if row is None:
        # Return empty block rather than 404 — frontend treats missing slugs as blank content.
        return ContentBlockOut(html="")
    return ContentBlockOut(
        html=row["html"] or "",
        updatedAt=row["updated_at"].isoformat() if row["updated_at"] else None,
        updatedBy=row["updated_by"] or None,
    )


@router.put("/{slug}", response_model=ContentBlockOut)
async def update_content(
    slug: _SlugPath,
    body: ContentBlockUpdate,
    request: Request,
    admin_sub: str = Depends(require_admin),
) -> ContentBlockOut:
    pool: asyncpg.Pool = get_pool(request)
    row = await pool.fetchrow(
        """
        INSERT INTO content_blocks (slug, html, updated_at, updated_by)
        VALUES ($1, $2, now(), $3)
        ON CONFLICT (slug) DO UPDATE
          SET html = EXCLUDED.html,
              updated_at = now(),
              updated_by = EXCLUDED.updated_by
        RETURNING html, updated_at, updated_by
        """,
        slug,
        body.html,
        admin_sub,
    )
    return ContentBlockOut(
        html=row["html"] or "",
        updatedAt=row["updated_at"].isoformat() if row["updated_at"] else None,
        updatedBy=row["updated_by"] or None,
    )
