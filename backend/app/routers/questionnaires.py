from collections import defaultdict

import asyncpg
from fastapi import APIRouter, HTTPException, Request, Response, status

from app.computed import dept_tag, dept_tag_cls, survey_left, survey_time, survey_time_ending
from app.database import get_pool
from app.models.schemas import QStep, QuestionnaireOut, SurveyResponseBody

router = APIRouter(prefix="/questionnaires", tags=["questionnaires"])


# ── Shared helpers (imported by admin_questionnaires) ─────────────────────────

def _question_to_step(row: asyncpg.Record) -> QStep:
    return QStep(
        type=row["type"],
        title=row["title"],
        hint=row["hint"] or "",
        options=list(row["options"]) if row["options"] else None,
        low=row["scale_low"] or None,
        high=row["scale_high"] or None,
        median=row["scale_mid"],
    )


async def _fetch_questions(pool: asyncpg.Pool, survey_id: int) -> list[asyncpg.Record]:
    return await pool.fetch(
        """
        SELECT id, position, type, title, hint, options, scale_low, scale_high, scale_mid
        FROM survey_questions
        WHERE survey_id = $1 AND deleted_at IS NULL
        ORDER BY position
        """,
        survey_id,
    )


# ── Public endpoints ──────────────────────────────────────────────────────────

def _row_to_public(row: asyncpg.Record, steps: list[QStep]) -> QuestionnaireOut:
    return QuestionnaireOut(
        id=str(row["id"]),
        tag=dept_tag(row["department"]),
        tagCls=dept_tag_cls(row["department"]),
        title=row["title"],
        desc=row["description"] or "",
        time=survey_time(row["est_minutes"]),
        timeEnding=survey_time_ending(row["closes_at"]) or None,
        left=survey_left(row["closes_at"]),
        flowTitle=row["flow_title"] or "",
        eyebrow=row["eyebrow"] or "",
        steps=steps,
    )


@router.get("", response_model=list[QuestionnaireOut])
async def list_questionnaires(request: Request) -> list[QuestionnaireOut]:
    """AC1: returns only surveys that are currently open (published and not past closes_at)."""
    pool: asyncpg.Pool = get_pool(request)
    rows = await pool.fetch(
        """
        SELECT id, department, title, description, flow_title, eyebrow, est_minutes, closes_at
        FROM surveys
        WHERE published = TRUE AND (closes_at IS NULL OR closes_at > now())
        ORDER BY created_at DESC
        LIMIT 100
        """
    )
    if not rows:
        return []

    ids = [r["id"] for r in rows]
    q_rows = await pool.fetch(
        """
        SELECT survey_id, type, title, hint, options, scale_low, scale_high, scale_mid
        FROM survey_questions
        WHERE survey_id = ANY($1) AND deleted_at IS NULL
        ORDER BY survey_id, position
        """,
        ids,
    )
    steps_by: dict[int, list[QStep]] = {sid: [] for sid in ids}
    for q in q_rows:
        steps_by[q["survey_id"]].append(_question_to_step(q))

    return [_row_to_public(r, steps_by[r["id"]]) for r in rows]


@router.get("/{questionnaire_id}", response_model=QuestionnaireOut)
async def get_questionnaire(questionnaire_id: int, request: Request) -> QuestionnaireOut:
    """Returns a single open questionnaire with all its questions."""
    pool: asyncpg.Pool = get_pool(request)
    row = await pool.fetchrow(
        """
        SELECT id, department, title, description, flow_title, eyebrow, est_minutes, closes_at
        FROM surveys
        WHERE id = $1 AND published = TRUE AND (closes_at IS NULL OR closes_at > now())
        """,
        questionnaire_id,
    )
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Questionnaire not found")
    q_rows = await _fetch_questions(pool, questionnaire_id)
    return _row_to_public(row, [_question_to_step(q) for q in q_rows])


@router.post("/{questionnaire_id}/responses", status_code=status.HTTP_204_NO_CONTENT)
async def submit_response(
    questionnaire_id: int,
    body: SurveyResponseBody,
    request: Request,
    response: Response,
) -> None:
    """
    AC2: stores answers with no PII — no user id, no IP address.
    AC3: if cookie answered_{id} is present, returns 409 Conflict.
         On success the cookie is set so a second tab submission is also blocked.
    """
    if request.cookies.get(f"answered_{questionnaire_id}"):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Already submitted",
        )

    pool: asyncpg.Pool = get_pool(request)
    exists = await pool.fetchval(
        """
        SELECT 1 FROM surveys
        WHERE id = $1 AND published = TRUE AND (closes_at IS NULL OR closes_at > now())
        """,
        questionnaire_id,
    )
    if not exists:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Questionnaire not found or closed")

    await pool.execute(
        "INSERT INTO survey_responses (survey_id, answers) VALUES ($1, $2)",
        questionnaire_id,
        body.answers,
    )

    response.set_cookie(
        key=f"answered_{questionnaire_id}",
        value="1",
        max_age=60 * 60 * 24 * 365,
        httponly=True,
        samesite="strict",
    )
