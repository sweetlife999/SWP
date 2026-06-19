"""Helpers that derive frontend display fields from raw DB values."""

from datetime import date, datetime, timezone
from typing import Optional

DEPT_TAG: dict[str, str] = {
    "core": "SU:Core",
    "active": "SU:Active",
    "media": "SU:Media",
}

DEPT_TAG_CLS: dict[str, str] = {
    "core": "tag-core",
    "active": "tag-active",
    "media": "tag-media",
}

# Accepts both the DB enum value and the display label sent by the frontend.
DEPT_MAP: dict[str, str] = {
    "core": "core", "SU:Core": "core",
    "active": "active", "SU:Active": "active",
    "media": "media", "SU:Media": "media",
}

PRIORITY_LABEL: dict[str, str] = {
    "p-high": "P0",
    "p-mid": "P1",
    "p-low": "P2",
}

MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
          "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]


def dept_tag(department: str) -> str:
    return DEPT_TAG.get(department, department)


def dept_tag_cls(department: str) -> str:
    return DEPT_TAG_CLS.get(department, "tag-core")


def event_dd(d: date) -> str:
    return f"{d.day:02d}"


def event_mm(d: date) -> str:
    return MONTHS[d.month - 1]


def event_date_str(d: date) -> str:
    return d.isoformat()


def is_past(d: date) -> bool:
    return d < datetime.now(timezone.utc).date()


def survey_time(est_minutes: int) -> str:
    return f"~{est_minutes} min"


def survey_left(closes_at: Optional[datetime]) -> str:
    if closes_at is None:
        return ""
    now = datetime.now(timezone.utc)
    if closes_at.tzinfo is None:
        closes_at = closes_at.replace(tzinfo=timezone.utc)
    delta = closes_at - now
    if delta.total_seconds() <= 0:
        return "closed"
    days = delta.days
    hours = delta.seconds // 3600
    if days > 0:
        return f"{days}d left"
    if hours > 0:
        return f"{hours}h left"
    return "closing soon"


def survey_time_ending(closes_at: Optional[datetime]) -> bool:
    if closes_at is None:
        return False
    now = datetime.now(timezone.utc)
    if closes_at.tzinfo is None:
        closes_at = closes_at.replace(tzinfo=timezone.utc)
    delta = closes_at - now
    return 0 < delta.total_seconds() < 86400
