"""Unit tests for app.config — settings load env overrides and sane defaults."""

from app.config import Settings


def test_settings_reads_overrides():
    s = Settings(admin_password="x", cors_origins="http://localhost:3000, https://su.fblrkus.ru")
    assert s.admin_password == "x"
    # how main.py splits CORS origins
    assert [o.strip() for o in s.cors_origins.split(",")] == [
        "http://localhost:3000",
        "https://su.fblrkus.ru",
    ]


def test_settings_defaults():
    s = Settings()
    assert s.token_expire_hours > 0
    assert isinstance(s.debug, bool)
