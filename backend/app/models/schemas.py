# Alias date/time types: fields named `date`/`time` shadow them under eager
# annotation evaluation (Python <3.14), breaking `date | None` / `time | None`
# at import time. Aliasing keeps the type names reachable.
from datetime import date as dt_date
from datetime import datetime
from datetime import time as dt_time
from typing import Annotated, Literal

from pydantic import BaseModel, Field, StringConstraints

# ── Shared validators ─────────────────────────────────────────────────────────

SlugStr = Annotated[str, StringConstraints(pattern=r"^[a-z0-9_-]+$", max_length=128)]

Department = Literal["core", "active", "media", "support"]
DepartmentOrLabel = Literal[
    "SU:Core", "SU:Active", "SU:Media", "SU:Support", "core", "active", "media", "support"
]


# ── Events ────────────────────────────────────────────────────────────────────

EventStatus = Literal["draft", "published", "archived"]


class ScheduleItem(BaseModel):
    time: str = ""
    title: str = ""
    where: str = ""


class OrganizerItem(BaseModel):
    initials: str = ""
    name: str = ""
    role: str = ""


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
    time: str | None = None
    foot: str
    footLabel: str | None = None
    featured: bool | None = None
    past: bool | None = None
    status: EventStatus
    statusText: str | None = None
    format: str = "Оффлайн"
    age: str = "0+"
    locationAddress: str = ""
    schedule: list[ScheduleItem] = []
    organizers: list[OrganizerItem] = []


class EventCreate(BaseModel):
    title: str
    desc: str
    date: dt_date
    cover: str = ""
    tag: DepartmentOrLabel
    # Parsed from an "HH:MM" string into a time so asyncpg can bind the TIME column.
    time: dt_time | None = None
    foot: str = ""
    footLabel: str | None = None
    featured: bool = False
    statusText: str | None = None
    format: str = "Оффлайн"
    age: str = "0+"
    locationAddress: str = ""
    schedule: list[ScheduleItem] = []
    organizers: list[OrganizerItem] = []


class EventPatch(BaseModel):
    title: str | None = None
    desc: str | None = None
    date: dt_date | None = None
    # Nullable in DB — explicit null in request clears the field.
    time: dt_time | None = None
    tag: DepartmentOrLabel | None = None
    cover: str | None = None
    foot: str | None = None
    footLabel: str | None = None
    featured: bool | None = None
    status: EventStatus | None = None
    statusText: str | None = None
    format: str | None = None
    age: str | None = None
    locationAddress: str | None = None
    schedule: list[ScheduleItem] | None = None
    organizers: list[OrganizerItem] | None = None


# ── Members ───────────────────────────────────────────────────────────────────


class DeptAvatars(BaseModel):
    core: list[str]
    active: list[str]
    media: list[str]


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
    is_active: bool = True


class MemberCreate(BaseModel):
    dep: Department
    name: str
    role: str
    meta: str = ""
    bio: str = ""
    photo_url: str = ""
    recent: list[str] = []


class MemberPatch(BaseModel):
    dep: Department | None = None
    name: str | None = None
    role: str | None = None
    meta: str | None = None
    bio: str | None = None
    photo_url: str | None = None
    recent: list[str] | None = None
    is_active: bool | None = None


class MemberReorderItem(BaseModel):
    id: int
    sort_order: int


# ── Surveys ───────────────────────────────────────────────────────────────────


class QStep(BaseModel):
    # Question id — lets the client key submitted answers by question so the
    # stats views (which read answers ->> question_id) aggregate correctly.
    id: int
    type: str
    title: str
    hint: str
    options: list[str] | None = None
    low: str | None = None
    high: str | None = None
    median: int | None = None


class SurveyOut(BaseModel):
    id: str
    tag: str
    tagCls: str
    title: str
    desc: str
    time: str
    timeEnding: bool | None = None
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
    options: list[str] | None = None
    scale_low: str | None = None
    scale_high: str | None = None
    scale_mid: int | None = None


class QuestionnaireOut(BaseModel):
    """Public-facing shape returned by GET /questionnaires and GET /questionnaires/:id."""

    id: str
    tag: str
    tagCls: str
    title: str
    desc: str
    time: str
    timeEnding: bool | None = None
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
    closes_at: str | None = None
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
    status: QuestionnaireStatus | None = None
    title: str | None = None
    description: str | None = None
    flow_title: str | None = None
    eyebrow: str | None = None
    est_minutes: int | None = None
    closes_at: datetime | None = None


class QuestionCreate(BaseModel):
    type: QuestionType
    title: str
    hint: str = ""
    options: list[str] | None = None
    scale_low: str | None = None
    scale_high: str | None = None
    scale_mid: int | None = None


class QuestionPatch(BaseModel):
    type: QuestionType | None = None
    title: str | None = None
    hint: str | None = None
    options: list[str] | None = None
    scale_low: str | None = None
    scale_high: str | None = None
    scale_mid: int | None = None


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
    updatedAt: str | None = None
    updatedBy: str | None = None


class ContentBlockUpdate(BaseModel):
    html: str


# ── Kanban ────────────────────────────────────────────────────────────────────


class KanbanTag(BaseModel):
    label: str
    cls: str
    dot: bool | None = None


class KanbanMeta(BaseModel):
    icon: str
    text: str
    urgent: bool | None = None
    soon: bool | None = None


class KanbanAssignee(BaseModel):
    initials: str
    bg: str
    offset: bool | None = None


class KanbanAttachment(BaseModel):
    icon: str
    bold: str
    rest: str


class KanbanCardOut(BaseModel):
    id: str
    col: str
    blocker: bool | None = None
    tags: list[KanbanTag]
    title: str
    desc: str | None = None
    attachment: KanbanAttachment | None = None
    progressPct: int | None = None
    progressLabel: str | None = None
    meta: list[KanbanMeta] | None = None
    priority: str
    pLabel: str
    assignees: list[KanbanAssignee]


class KanbanCardPatch(BaseModel):
    # All optional: a drag sends only col; the card editor may send any subset.
    col: Literal["backlog", "next", "doing", "review", "done"] | None = None
    title: str | None = None
    desc: str | None = None
    priority: Literal["p-low", "p-mid", "p-high"] | None = None
    blocker: bool | None = None
    # When provided, replaces the card's assignees with a single one (initials);
    # empty string clears assignees.
    assignee: str | None = None


class KanbanCardCreate(BaseModel):
    title: str
    col: Literal["backlog", "next", "doing", "review", "done"] = "backlog"
    desc: str | None = None
    priority: Literal["p-low", "p-mid", "p-high"] = "p-low"
    # Optional assignee initials (e.g. "МР"); stored in kanban_card_assignees.
    assignee: str | None = None


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
