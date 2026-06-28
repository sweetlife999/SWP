import asyncpg
from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.auth import check_login_rate, create_token, require_admin, verify_password
from app.computed import dept_tag, dept_tag_cls
from app.database import get_pool
from app.models.schemas import FormOut, LoginRequest, LoginResponse

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/login", response_model=LoginResponse)
async def login(body: LoginRequest, request: Request) -> LoginResponse:
    check_login_rate(request.client.host if request.client else "unknown")
    if not verify_password(body.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Wrong password")
    return LoginResponse(token=create_token())


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
    limit: int = 100,
    offset: int = 0,
) -> list[dict]:
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
