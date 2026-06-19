from datetime import date, datetime
from typing import Annotated, Literal, Optional

from pydantic import BaseModel, Field, StringConstraints


# ── Shared validators ─────────────────────────────────────────────────────────

SlugStr = Annotated[str, StringConstraints(pattern=r"^[a-z0-9_-]+$", max_length=128)]

Department = Literal["core", "active", "media"]
DepartmentOrLabel = Literal["SU:Core", "SU:Active", "SU:Media", "core", "active", "media"]


# ── Events ────────────────────────────────────────────────────────────────────

EventStatus = Literal["draft", "published", "archived"]


class EventOut(BaseModel):
    id: int
    title: str
    desc: str
    date: str
    dd: str
    mm: str
    cover: str
    tag: str
    tagCls: str
    time: Optional[str] = None
    foot: str
    footLabel: Optional[str] = None
    featured: Optional[bool] = None
    past: Optional[bool] = None
    status: EventStatus
    statusText: Optional[str] = None


class EventCreate(BaseModel):
    title: str
    desc: str
    date: date
    cover: str = ""
    tag: DepartmentOrLabel
    time: Optional[str] = None
    foot: str = ""
    footLabel: Optional[str] = None
    featured: bool = False
    statusText: Optional[str] = None


class EventPatch(BaseModel):
    title: Optional[str] = None
    desc: Optional[str] = None
    date: Optional[date] = None
    # Nullable in DB — explicit null in request clears the field.
    time: Optional[str] = None
    tag: Optional[DepartmentOrLabel] = None
    cover: Optional[str] = None
    foot: Optional[str] = None
    footLabel: Optional[str] = None
    featured: Optional[bool] = None
    status: Optional[EventStatus] = None
    statusText: Optional[str] = None


# ── Members ───────────────────────────────────────────────────────────────────

class MemberOut(BaseModel):
    id: str
    dep: str
    tag: str
    name: str
    role: str
    meta: str
    bio: str
    photo_url: str
    recent: list[str]


class MemberCreate(BaseModel):
    dep: Department
    name: str
    role: str
    meta: str = ""
    bio: str = ""
    photo_url: str = ""
    recent: list[str] = []


class MemberPatch(BaseModel):
    dep: Optional[Department] = None
    name: Optional[str] = None
    role: Optional[str] = None
    meta: Optional[str] = None
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    recent: Optional[list[str]] = None


class MemberReorderItem(BaseModel):
    id: int
    sort_order: int


# ── Surveys ───────────────────────────────────────────────────────────────────

class QStep(BaseModel):
    type: str
    title: str
    hint: str
    options: Optional[list[str]] = None
    low: Optional[str] = None
    high: Optional[str] = None
    median: Optional[int] = None


class SurveyOut(BaseModel):
    id: str
    tag: str
    tagCls: str
    title: str
    desc: str
    time: str
    timeEnding: Optional[bool] = None
    left: str
    flowTitle: str
    eyebrow: str
    steps: list[QStep]


# Answer values: text answer, scale integer, or list of chosen option indices.
SurveyAnswerValue = str | int | list[str] | list[int]

class SurveyResponseBody(BaseModel):
    answers: Annotated[
        dict[str, SurveyAnswerValue],
        Field(max_length=200),  # cap at 200 question keys
    ]


# ── Questionnaires (admin CRUD + public read) ─────────────────────────────────

QuestionType = Literal["single", "multi", "scale", "text"]
QuestionnaireStatus = Literal["draft", "open", "closed"]


class QuestionOut(BaseModel):
    id: int
    position: int
    type: str
    title: str
    hint: str
    options: Optional[list[str]] = None
    scale_low: Optional[str] = None
    scale_high: Optional[str] = None
    scale_mid: Optional[int] = None


class QuestionnaireOut(BaseModel):
    """Public-facing shape returned by GET /questionnaires and GET /questionnaires/:id."""
    id: str
    tag: str
    tagCls: str
    title: str
    desc: str
    time: str
    timeEnding: Optional[bool] = None
    left: str
    flowTitle: str
    eyebrow: str
    steps: list[QStep]


class QuestionnaireAdminOut(BaseModel):
    """Admin-facing shape with status and management fields."""
    id: int
    department: str
    title: str
    description: str
    status: QuestionnaireStatus
    est_minutes: int
    closes_at: Optional[str] = None
    response_count: int
    questions: list[QuestionOut]


class QuestionnaireCreate(BaseModel):
    department: Department
    title: str
    description: str = ""
    flow_title: str = ""
    eyebrow: str = ""
    est_minutes: int = 2


class QuestionnairePatch(BaseModel):
    status: Optional[QuestionnaireStatus] = None
    title: Optional[str] = None
    description: Optional[str] = None
    flow_title: Optional[str] = None
    eyebrow: Optional[str] = None
    est_minutes: Optional[int] = None
    closes_at: Optional[datetime] = None


class QuestionCreate(BaseModel):
    type: QuestionType
    title: str
    hint: str = ""
    options: Optional[list[str]] = None
    scale_low: Optional[str] = None
    scale_high: Optional[str] = None
    scale_mid: Optional[int] = None


class QuestionPatch(BaseModel):
    type: Optional[QuestionType] = None
    title: Optional[str] = None
    hint: Optional[str] = None
    options: Optional[list[str]] = None
    scale_low: Optional[str] = None
    scale_high: Optional[str] = None
    scale_mid: Optional[int] = None


class AnswerStat(BaseModel):
    answer: str
    count: int
    pct: float


class QuestionResults(BaseModel):
    question_id: int
    position: int
    type: str
    title: str
    answered: int
    stats: list[AnswerStat]


class QuestionnaireResults(BaseModel):
    id: int
    title: str
    total_responses: int
    questions: list[QuestionResults]


# ── Content blocks ────────────────────────────────────────────────────────────

class ContentBlockOut(BaseModel):
    html: str
    updatedAt: Optional[str] = None
    updatedBy: Optional[str] = None


class ContentBlockUpdate(BaseModel):
    html: str


# ── Kanban ────────────────────────────────────────────────────────────────────

class KanbanTag(BaseModel):
    label: str
    cls: str
    dot: Optional[bool] = None


class KanbanMeta(BaseModel):
    icon: str
    text: str
    urgent: Optional[bool] = None
    soon: Optional[bool] = None


class KanbanAssignee(BaseModel):
    initials: str
    bg: str
    offset: Optional[bool] = None


class KanbanAttachment(BaseModel):
    icon: str
    bold: str
    rest: str


class KanbanCardOut(BaseModel):
    id: str
    col: str
    blocker: Optional[bool] = None
    tags: list[KanbanTag]
    title: str
    desc: Optional[str] = None
    attachment: Optional[KanbanAttachment] = None
    progressPct: Optional[int] = None
    progressLabel: Optional[str] = None
    meta: Optional[list[KanbanMeta]] = None
    priority: str
    pLabel: str
    assignees: list[KanbanAssignee]


class KanbanCardPatch(BaseModel):
    col: Literal["backlog", "next", "doing", "review", "done"]


# ── Admin forms (survey list for admin) ──────────────────────────────────────

class FormOut(BaseModel):
    id: str
    tag: str
    tagClass: str
    title: str
    count: int


# ── Auth ──────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    password: str


class LoginResponse(BaseModel):
    token: str
