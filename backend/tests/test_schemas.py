"""Unit tests for request-model validation (QR-REL: bad input is rejected, not stored)."""

from datetime import time

import pytest
from pydantic import ValidationError

from app.models.schemas import EventCreate, MemberCreate, SurveyResponseBody


def test_event_create_parses_time_and_date():
    e = EventCreate(title="t", desc="d", date="2026-07-15", tag="SU:Core", time="10:00")
    assert e.time == time(10, 0)  # "HH:MM" parsed to a time for the TIME column
    assert e.date.isoformat() == "2026-07-15"


def test_event_create_rejects_unknown_department():
    with pytest.raises(ValidationError):
        EventCreate(title="t", desc="d", date="2026-07-15", tag="SU:Nope")


def test_event_create_defaults():
    e = EventCreate(title="t", desc="d", date="2026-07-15", tag="core")
    assert e.format == "Оффлайн"
    assert isinstance(e.age, str) and e.age != ""
    assert e.featured is False


def test_survey_response_caps_question_count():
    too_many = {str(i): "x" for i in range(201)}  # cap is 200
    with pytest.raises(ValidationError):
        SurveyResponseBody(answers=too_many)


def test_survey_response_accepts_mixed_values():
    body = SurveyResponseBody(answers={"1": "text", "2": 7, "3": ["a", "b"]})
    assert body.answers["2"] == 7


def test_member_create_defaults():
    m = MemberCreate(dep="core", name="Name", role="Role")
    assert m.photo_url == ""
    assert m.recent == []
    assert m.bio == ""


def test_member_create_accepts_support_department():
    # Issue #81: SU:Support is a fourth department alongside Core/Active/Media,
    # not a separate CEO/assistant role.
    m = MemberCreate(dep="support", name="Name", role="Role")
    assert m.dep == "support"


def test_member_create_rejects_unknown_department():
    with pytest.raises(ValidationError):
        MemberCreate(dep="ceo", name="Name", role="Role")
