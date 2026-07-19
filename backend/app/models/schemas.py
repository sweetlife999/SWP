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


class EventOut(BaseModel):
    id: int
    title: str
    desc: str
    date: str
    dd: str
    mm: str
    cover: str
    photo_url: str
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


class EventCreate(BaseModel):
    title: str
    desc: str
    date: dt_date
    cover: str = ""
    photo_url: str = ""
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


class EventPatch(BaseModel):
    title: str | None = None
    desc: str | None = None
    date: dt_date | None = None
    # Nullable in DB — explicit null in request clears the field.
    time: dt_time | None = None
    tag: DepartmentOrLabel | None = None
    cover: str | None = None
    photo_url: str | None = None
    foot: str | None = None
    footLabel: str | None = None
    featured: bool | None = None
    status: EventStatus | None = None
    statusText: str | None = None
    format: str | None = None
    age: str | None = None
    locationAddress: str | None = None


# ── Members ───────────────────────────────────────────────────────────────────


class DeptAvatars(BaseModel):
    core: list[str]
    active: list[str]
    media: list[str]
    support: list[str]


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
    deadline: dt_date | None = None


class KanbanCardPatch(BaseModel):
    # All optional: a drag sends only col; the card editor may send any subset.
    # Column keys come from the project's kanban_columns row, not a fixed enum
    # (issue #126 AC4/AC5) — the router 404s if the key doesn't belong to the
    # card's project, same as it always has for column moves.
    col: str | None = None
    title: str | None = None
    desc: str | None = None
    priority: Literal["p-low", "p-mid", "p-high"] | None = None
    blocker: bool | None = None
    # When provided, replaces the card's assignees (each entry a member name,
    # initials derived server-side); an empty list clears all assignees.
    assignees: list[str] | None = None
    # Explicit null clears the deadline.
    deadline: dt_date | None = None


class KanbanCardCreate(BaseModel):
    title: str
    col: str = "backlog"
    desc: str | None = None
    priority: Literal["p-low", "p-mid", "p-high"] = "p-low"
    # Member names; stored in kanban_card_assignees (one row per assignee).
    assignees: list[str] | None = None
    deadline: dt_date | None = None


class KanbanColumnOut(BaseModel):
    key: str
    label: str
    color: str
    order_index: int


# ── Kanban automations ────────────────────────────────────────────────────────
# v1 scope: two triggers the app can actually fire, two actions with a real
# effect. See backend/app/routers/kanban_automations.py for the engine and
# issue #126 for the fuller trigger/condition/action model this can grow into.

AutomationTriggerType = Literal["column_changed", "task_created"]
AutomationActionType = Literal["change_column", "assign_user"]


class AutomationAction(BaseModel):
    type: AutomationActionType
    params: dict[str, str] = {}


class AutomationCreate(BaseModel):
    name: str
    trigger_type: AutomationTriggerType
    # column_changed only: {"to_column": "<key>"}; omitted/empty matches any column.
    trigger_filters: dict[str, str] = {}
    actions: list[AutomationAction] = []
    is_active: bool = True


class AutomationPatch(BaseModel):
    name: str | None = None
    trigger_filters: dict[str, str] | None = None
    actions: list[AutomationAction] | None = None
    is_active: bool | None = None


class AutomationOut(BaseModel):
    id: int
    name: str
    trigger_type: AutomationTriggerType
    trigger_filters: dict[str, str]
    actions: list[AutomationAction]
    is_active: bool
    stats_runs: int


class AutomationRunOut(BaseModel):
    id: int
    automation_id: int
    card_id: int | None = None
    status: Literal["success", "failure"]
    details: dict
    ran_at: datetime


# ── Admin forms (survey list for admin) ──────────────────────────────────────


class FormOut(BaseModel):
    id: str
    tag: str
    tagClass: str
    title: str
    count: int


# ── Uploads ───────────────────────────────────────────────────────────────────


class UploadOut(BaseModel):
    path: str


# ── Auth ──────────────────────────────────────────────────────────────────────


class LoginRequest(BaseModel):
    password: str


class LoginResponse(BaseModel):
    token: str
