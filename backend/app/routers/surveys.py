import asyncpg
from fastapi import APIRouter, HTTPException, Request, status

from app.auth import check_submission_rate, get_client_ip
from app.computed import dept_tag, dept_tag_cls, survey_left, survey_time, survey_time_ending
from app.database import get_pool
from app.models.schemas import QStep, SurveyOut, SurveyResponseBody

router = APIRouter(prefix="/surveys", tags=["surveys"])


def _build_step(row: asyncpg.Record) -> QStep:
    return QStep(
        id=row["id"],
        type=row["type"],
        title=row["title"],
        hint=row["hint"] or "",
        options=list(row["options"]) if row["options"] else None,
        low=row["scale_low"] or None,
        high=row["scale_high"] or None,
        median=row["scale_mid"] or None,
    )


@router.get("", response_model=list[SurveyOut])
async def list_surveys(request: Request) -> list[SurveyOut]:
    pool: asyncpg.Pool = get_pool(request)

    surveys = await pool.fetch(
        """
        SELECT id, department, title, description, flow_title, eyebrow,
               est_minutes, closes_at
        FROM surveys
        WHERE published = TRUE
        ORDER BY created_at DESC
        LIMIT 100
        """
    )
    if not surveys:
        return []

    survey_ids = [r["id"] for r in surveys]
    questions = await pool.fetch(
        """
        SELECT id, survey_id, type, title, hint, options, scale_low, scale_high, scale_mid
        FROM survey_questions
        WHERE survey_id = ANY($1) AND deleted_at IS NULL
        ORDER BY survey_id, position
        """,
        survey_ids,
    )

    steps_by_survey: dict[int, list[QStep]] = {sid: [] for sid in survey_ids}
    for q in questions:
        steps_by_survey[q["survey_id"]].append(_build_step(q))

    return [
        SurveyOut(
            id=str(s["id"]),
            tag=dept_tag(s["department"]),
            tagCls=dept_tag_cls(s["department"]),
            title=s["title"],
            desc=s["description"] or "",
            time=survey_time(s["est_minutes"]),
            timeEnding=survey_time_ending(s["closes_at"]) or None,
            left=survey_left(s["closes_at"]),
            flowTitle=s["flow_title"] or "",
            eyebrow=s["eyebrow"] or "",
            steps=steps_by_survey[s["id"]],
        )
        for s in surveys
    ]


@router.post("/{survey_id}/responses", status_code=status.HTTP_204_NO_CONTENT)
async def submit_response(survey_id: int, body: SurveyResponseBody, request: Request) -> None:
    check_submission_rate(get_client_ip(request))
    pool: asyncpg.Pool = get_pool(request)
    exists = await pool.fetchval(
        """
        SELECT 1 FROM surveys
        WHERE id = $1 AND published = TRUE
          AND (closes_at IS NULL OR closes_at > now())
        """,
        survey_id,
    )
    if not exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Survey not found or closed"
        )

    await pool.execute(
        "INSERT INTO survey_responses (survey_id, answers) VALUES ($1, $2)",
        survey_id,
        body.answers,
    )
