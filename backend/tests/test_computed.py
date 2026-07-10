"""Unit tests for app.computed — pure display-field helpers (critical module)."""

from datetime import UTC, date, datetime, timedelta

from app import computed


def test_dept_tag():
    assert computed.dept_tag("core") == "SU:Core"
    assert computed.dept_tag("active") == "SU:Active"
    assert computed.dept_tag("media") == "SU:Media"
    assert computed.dept_tag("support") == "SU:Support"  # issue #81
    assert computed.dept_tag("unknown") == "unknown"  # passthrough fallback


def test_dept_tag_cls():
    assert computed.dept_tag_cls("media") == "tag-media"
    assert computed.dept_tag_cls("nope") == "tag-core"  # default


def test_event_date_helpers():
    d = date(2026, 7, 5)
    assert computed.event_dd(d) == "05"
    assert computed.event_mm(d) == "JUL"
    assert computed.event_date_str(d) == "2026-07-05"


def test_is_past():
    assert computed.is_past(date(2000, 1, 1)) is True
    assert computed.is_past(date(2999, 1, 1)) is False


def test_survey_time():
    assert computed.survey_time(5) == "~5 min"


def test_survey_left():
    assert computed.survey_left(None) == ""
    assert "left" in computed.survey_left(datetime.now(UTC) + timedelta(days=2))
    assert computed.survey_left(datetime.now(UTC) - timedelta(days=1)) == "closed"


def test_survey_time_ending():
    assert computed.survey_time_ending(datetime.now(UTC) + timedelta(hours=3)) is True
    assert computed.survey_time_ending(datetime.now(UTC) + timedelta(days=5)) is False
    assert computed.survey_time_ending(None) is False


def test_lookup_maps():
    assert computed.DEPT_MAP["SU:Core"] == "core"
    assert computed.DEPT_MAP["media"] == "media"
    assert computed.DEPT_MAP["SU:Support"] == "support"
    assert computed.DEPT_MAP["support"] == "support"
    assert computed.PRIORITY_LABEL["p-high"] == "P0"
