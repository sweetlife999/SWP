from collections import defaultdict
from datetime import UTC, datetime

import asyncpg
from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.auth import require_admin
from app.database import get_pool
from app.models.schemas import (
    AnswerStat,
    QuestionCreate,
    QuestionnaireAdminOut,
    QuestionnaireCreate,
    QuestionnairePatch,
    QuestionnaireResults,
    QuestionOut,
    QuestionPatch,
    QuestionResults,
)
from app.routers.questionnaires import _fetch_questions

admin_router = APIRouter(
    prefix="/admin/questionnaires",
    tags=["admin-questionnaires"],
    dependencies=[Depends(require_admin)],
)


# ── Helpers ───────────────────────────────────────────────────────────────────


def _compute_status(published: bool, closes_at) -> str:
    if not published:
        return "draft"
    if closes_at is None:
        return "open"
    now = datetime.now(UTC)
    tz_aware = closes_at if closes_at.tzinfo else closes_at.replace(tzinfo=UTC)
    return "open" if tz_aware > now else "closed"


def _row_to_question(row: asyncpg.Record) -> QuestionOut:
    return QuestionOut(
        id=row["id"],
        position=row["position"],
        type=row["type"],
        title=row["title"],
        hint=row["hint"] or "",
        options=list(row["options"]) if row["options"] else None,
        scale_low=row["scale_low"] or None,
        scale_high=row["scale_high"] or None,
        scale_mid=row["scale_mid"],
    )


async def _get_survey_or_404(pool: asyncpg.Pool, survey_id: int) -> asyncpg.Record:
    row = await pool.fetchrow("SELECT * FROM surveys WHERE id = $1", survey_id)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Questionnaire not found")
    return row


async def _build_admin_out(pool: asyncpg.Pool, survey_id: int) -> QuestionnaireAdminOut:
    row = await pool.fetchrow(
        """
        SELECT s.*, COUNT(r.id)::int AS response_count
        FROM surveys s
        LEFT JOIN survey_responses r ON r.survey_id = s.id
        WHERE s.id = $1
        GROUP BY s.id
        """,
        survey_id,
    )
    q_rows = await _fetch_questions(pool, survey_id)
    return QuestionnaireAdminOut(
        id=row["id"],
        department=row["department"],
        title=row["title"],
        description=row["description"] or "",
        status=_compute_status(row["published"], row["closes_at"]),
        est_minutes=row["est_minutes"],
        closes_at=row["closes_at"].isoformat() if row["closes_at"] else None,
        response_count=row["response_count"],
        questions=[_row_to_question(q) for q in q_rows],
    )


# ── Admin endpoints ───────────────────────────────────────────────────────────


@admin_router.get("", response_model=list[QuestionnaireAdminOut])
async def list_questionnaires_admin(request: Request) -> list[QuestionnaireAdminOut]:
    """All questionnaires (drafts, open, closed) for the builder picker."""
    pool: asyncpg.Pool = get_pool(request)
    rows = await pool.fetch("SELECT id FROM surveys ORDER BY created_at DESC")
    return [await _build_admin_out(pool, r["id"]) for r in rows]


@admin_router.get("/{questionnaire_id}", response_model=QuestionnaireAdminOut)
async def get_questionnaire_admin(questionnaire_id: int, request: Request) -> QuestionnaireAdminOut:
    """A single questionnaire with its questions, for loading into the builder."""
    pool: asyncpg.Pool = get_pool(request)
    await _get_survey_or_404(pool, questionnaire_id)
    return await _build_admin_out(pool, questionnaire_id)


@admin_router.post("", response_model=QuestionnaireAdminOut, status_code=status.HTTP_201_CREATED)
async def create_questionnaire(
    body: QuestionnaireCreate, request: Request
) -> QuestionnaireAdminOut:
    """Creates a new questionnaire in draft status (published=FALSE)."""
    pool: asyncpg.Pool = get_pool(request)
    row = await pool.fetchrow(
        """
        INSERT INTO surveys (department, title, description, flow_title, eyebrow, est_minutes)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        """,
        body.department,
        body.title,
        body.description,
        body.flow_title,
        body.eyebrow,
        body.est_minutes,
    )
    return QuestionnaireAdminOut(
        id=row["id"],
        department=row["department"],
        title=row["title"],
        description=row["description"],
        status="draft",
        est_minutes=row["est_minutes"],
        closes_at=None,
        response_count=0,
        questions=[],
    )


@admin_router.patch("/{questionnaire_id}", response_model=QuestionnaireAdminOut)
async def patch_questionnaire(
    questionnaire_id: int,
    body: QuestionnairePatch,
    request: Request,
) -> QuestionnaireAdminOut:
    """
    Updates metadata or transitions status:
      draft → open  : sets published = TRUE
      open  → closed: sets closes_at = now()
      any   → draft : sets published = FALSE
    """
    pool: asyncpg.Pool = get_pool(request)
    await _get_survey_or_404(pool, questionnaire_id)

    provided = body.model_fields_set
    if not provided:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="No fields to update"
        )

    updates: list[str] = []
    params: list = []

    def add(col: str, val) -> None:
        params.append(val)
        updates.append(f"{col} = ${len(params)}")

    if "status" in provided and body.status is not None:
        if body.status == "open":
            add("published", True)
        elif body.status == "closed":
            add("closes_at", datetime.now(UTC))
        elif body.status == "draft":
            add("published", False)

    if "title" in provided and body.title is not None:
        add("title", body.title)
    if "description" in provided and body.description is not None:
        add("description", body.description)
    if "flow_title" in provided and body.flow_title is not None:
        add("flow_title", body.flow_title)
    if "eyebrow" in provided and body.eyebrow is not None:
        add("eyebrow", body.eyebrow)
    if "est_minutes" in provided and body.est_minutes is not None:
        add("est_minutes", body.est_minutes)
    if "closes_at" in provided:
        add("closes_at", body.closes_at)

    if updates:
        params.append(questionnaire_id)
        await pool.execute(
            f"UPDATE surveys SET {', '.join(updates)} WHERE id = ${len(params)}",
            *params,
        )

    return await _build_admin_out(pool, questionnaire_id)


@admin_router.post(
    "/{questionnaire_id}/questions", response_model=QuestionOut, status_code=status.HTTP_201_CREATED
)
async def add_question(
    questionnaire_id: int,
    body: QuestionCreate,
    request: Request,
) -> QuestionOut:
    """Appends a question to the questionnaire. Position is assigned automatically."""
    pool: asyncpg.Pool = get_pool(request)
    await _get_survey_or_404(pool, questionnaire_id)

    async with pool.acquire() as conn:
        async with conn.transaction():
            next_pos = await conn.fetchval(
                "SELECT COALESCE(MAX(position), 0) + 1 FROM survey_questions WHERE survey_id = $1",
                questionnaire_id,
            )
            row = await conn.fetchrow(
                """
                INSERT INTO survey_questions
                  (survey_id, position, type, title, hint, options,
                   scale_low, scale_high, scale_mid)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING id, position, type, title, hint, options,
                          scale_low, scale_high, scale_mid
                """,
                questionnaire_id,
                next_pos,
                body.type,
                body.title,
                body.hint,
                body.options,
                body.scale_low,
                body.scale_high,
                body.scale_mid,
            )
    return _row_to_question(row)


@admin_router.patch("/{questionnaire_id}/questions/{question_id}", response_model=QuestionOut)
async def patch_question(
    questionnaire_id: int,
    question_id: int,
    body: QuestionPatch,
    request: Request,
) -> QuestionOut:
    pool: asyncpg.Pool = get_pool(request)

    provided = body.model_fields_set
    if not provided:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="No fields to update"
        )

    updates: list[str] = []
    params: list = []

    def add(col: str, val) -> None:
        params.append(val)
        updates.append(f"{col} = ${len(params)}")

    if "type" in provided and body.type is not None:
        add("type", body.type)
    if "title" in provided and body.title is not None:
        add("title", body.title)
    if "hint" in provided:
        add("hint", body.hint or "")
    if "options" in provided:
        add("options", body.options)
    if "scale_low" in provided:
        add("scale_low", body.scale_low)
    if "scale_high" in provided:
        add("scale_high", body.scale_high)
    if "scale_mid" in provided:
        add("scale_mid", body.scale_mid)

    params.extend([question_id, questionnaire_id])
    row = await pool.fetchrow(
        f"UPDATE survey_questions SET {', '.join(updates)} "
        f"WHERE id = ${len(params) - 1} AND survey_id = ${len(params)} AND deleted_at IS NULL "
        f"RETURNING id, position, type, title, hint, options, scale_low, scale_high, scale_mid",
        *params,
    )
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")
    return _row_to_question(row)


@admin_router.delete(
    "/{questionnaire_id}/questions/{question_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_question(
    questionnaire_id: int,
    question_id: int,
    request: Request,
) -> None:
    """
    Soft-deletes the question (sets deleted_at). Hard deletion is forbidden
    because existing responses reference question IDs and must remain intact.
    """
    pool: asyncpg.Pool = get_pool(request)
    result = await pool.execute(
        """
        UPDATE survey_questions SET deleted_at = now()
        WHERE id = $1 AND survey_id = $2 AND deleted_at IS NULL
        """,
        question_id,
        questionnaire_id,
    )
    if result == "UPDATE 0":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")


@admin_router.get("/{questionnaire_id}/results", response_model=QuestionnaireResults)
async def get_results(questionnaire_id: int, request: Request) -> QuestionnaireResults:
    """
    Aggregates responses per question using the survey_answer_stats (single/scale)
    and survey_multi_stats (multi) DB views. Text answers are returned as a sample list.
    """
    pool: asyncpg.Pool = get_pool(request)
    survey = await _get_survey_or_404(pool, questionnaire_id)

    total = await pool.fetchval(
        "SELECT COUNT(*) FROM survey_responses WHERE survey_id = $1",
        questionnaire_id,
    )

    q_rows = await _fetch_questions(pool, questionnaire_id)
    if not q_rows:
        return QuestionnaireResults(
            id=questionnaire_id,
            title=survey["title"],
            total_responses=total,
            questions=[],
        )

    scalar_stats = await pool.fetch(
        "SELECT question_id, answer, count, pct FROM survey_answer_stats WHERE survey_id = $1",
        questionnaire_id,
    )
    multi_stats = await pool.fetch(
        "SELECT question_id, answer, count FROM survey_multi_stats WHERE survey_id = $1",
        questionnaire_id,
    )
    text_rows = await pool.fetch(
        "SELECT answers FROM survey_responses"
        " WHERE survey_id = $1 ORDER BY submitted_at DESC LIMIT 200",
        questionnaire_id,
    )

    scalar_by: dict[int, list] = defaultdict(list)
    for r in scalar_stats:
        scalar_by[r["question_id"]].append(r)

    multi_by: dict[int, list] = defaultdict(list)
    for r in multi_stats:
        multi_by[r["question_id"]].append(r)

    text_by: dict[str, list[str]] = defaultdict(list)
    for resp in text_rows:
        for qid, val in resp["answers"].items():
            if isinstance(val, str) and val:
                text_by[qid].append(val)

    questions: list[QuestionResults] = []
    for q in q_rows:
        qid = q["id"]

        if q["type"] in ("single", "scale"):
            rows = scalar_by[qid]
            answered = sum(r["count"] for r in rows)
            stats = [
                AnswerStat(answer=r["answer"] or "", count=r["count"], pct=float(r["pct"]))
                for r in sorted(rows, key=lambda r: -r["count"])
            ]

        elif q["type"] == "multi":
            rows = multi_by[qid]
            answered = max((r["count"] for r in rows), default=0)
            total_picks = sum(r["count"] for r in rows)
            stats = [
                AnswerStat(
                    answer=r["answer"] or "",
                    count=r["count"],
                    pct=round(r["count"] * 100.0 / total_picks, 1) if total_picks else 0.0,
                )
                for r in sorted(rows, key=lambda r: -r["count"])
            ]

        else:  # text
            samples = text_by.get(str(qid), [])[:50]
            answered = len(samples)
            stats = [AnswerStat(answer=a, count=1, pct=0.0) for a in samples]

        questions.append(
            QuestionResults(
                question_id=qid,
                position=q["position"],
                type=q["type"],
                title=q["title"],
                answered=answered,
                stats=stats,
            )
        )

    return QuestionnaireResults(
        id=questionnaire_id,
        title=survey["title"],
        total_responses=total,
        questions=questions,
    )
