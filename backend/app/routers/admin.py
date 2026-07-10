from datetime import UTC, datetime, timedelta
from typing import Any

import asyncpg
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status

from app.auth import (
    check_login_rate,
    create_session,
    create_token,
    get_client_ip,
    require_admin,
    revoke_session,
    verify_password,
)
from app.computed import dept_tag, dept_tag_cls
from app.config import settings
from app.database import get_pool
from app.models.schemas import FormOut, LoginRequest, LoginResponse

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/login", response_model=LoginResponse)
async def login(body: LoginRequest, request: Request) -> LoginResponse:
    check_login_rate(get_client_ip(request))
    if not verify_password(body.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Wrong password")
    token, jti = create_token()
    expires_at = datetime.now(UTC) + timedelta(hours=settings.token_expire_hours)
    await create_session(get_pool(request), jti, expires_at)
    return LoginResponse(token=token)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(request: Request, admin_sub: str = Depends(require_admin)) -> None:
    """Revokes the current session so the token can no longer be used, even before it expires."""
    jti = getattr(request.state, "jti", None)
    if jti:
        await revoke_session(get_pool(request), jti)


@router.get("/forms", response_model=list[FormOut], dependencies=[Depends(require_admin)])
async def list_forms(request: Request) -> list[FormOut]:
    pool: asyncpg.Pool = get_pool(request)
    rows = await pool.fetch(
        """
        SELECT s.id, s.department, s.title, s.created_at,
               COUNT(r.id)::int AS response_count
        FROM surveys s
        LEFT JOIN survey_responses r ON r.survey_id = s.id
        GROUP BY s.id, s.department, s.title, s.created_at
        ORDER BY s.created_at DESC
        """
    )
    return [
        FormOut(
            id=str(r["id"]),
            tag=dept_tag(r["department"]),
            tagClass=dept_tag_cls(r["department"]),
            title=r["title"],
            count=r["response_count"],
        )
        for r in rows
    ]


@router.get("/forms/{form_id}/responses", dependencies=[Depends(require_admin)])
async def get_form_responses(
    form_id: int,
    request: Request,
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
) -> list[dict[str, Any]]:
    """Each row's keys are that survey's question titles (plus "_submitted_at") —
    genuinely dynamic per survey, so no fixed response_model applies here."""
    pool: asyncpg.Pool = get_pool(request)
    exists = await pool.fetchval(
        "SELECT 1 FROM surveys WHERE id = $1",
        form_id,
    )
    if not exists:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Form not found")

    questions = await pool.fetch(
        """
        SELECT id, title
        FROM survey_questions
        WHERE survey_id = $1 AND deleted_at IS NULL
        ORDER BY position
        """,
        form_id,
    )
    q_title: dict[str, str] = {str(q["id"]): q["title"] for q in questions}

    response_rows = await pool.fetch(
        """
        SELECT id, answers, submitted_at
        FROM survey_responses
        WHERE survey_id = $1
        ORDER BY submitted_at DESC
        LIMIT $2 OFFSET $3
        """,
        form_id,
        limit,
        offset,
    )

    result = []
    for row in response_rows:
        record: dict = {"_submitted_at": row["submitted_at"].isoformat()}
        for qid, answer in row["answers"].items():
            record[q_title.get(str(qid), f"Q{qid}")] = answer
        result.append(record)
    return result
