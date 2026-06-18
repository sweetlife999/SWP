from datetime import date
from typing import Annotated, Literal, Optional

from pydantic import BaseModel, Field, StringConstraints


# ── Shared validators ─────────────────────────────────────────────────────────

SlugStr = Annotated[str, StringConstraints(pattern=r"^[a-z0-9_-]+$", max_length=128)]

Department = Literal["core", "active", "media"]
DepartmentOrLabel = Literal["SU:Core", "SU:Active", "SU:Media", "core", "active", "media"]


# ── Events ────────────────────────────────────────────────────────────────────

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
    status: Optional[str] = None
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
    recent: list[str]


class MemberCreate(BaseModel):
    dep: Department
    name: str
    role: str
    meta: str = ""
    bio: str = ""
    recent: list[str] = []


class MemberPatch(BaseModel):
    dep: Optional[Department] = None
    name: Optional[str] = None
    role: Optional[str] = None
    meta: Optional[str] = None
    bio: Optional[str] = None
    recent: Optional[list[str]] = None


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
