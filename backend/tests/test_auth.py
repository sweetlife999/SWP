"""Unit tests for app.auth — security-critical (QR-SEC quality requirement test)."""

import jwt
import pytest
from fastapi import HTTPException

from app import auth


def test_verify_password(monkeypatch):
    monkeypatch.setattr(auth.settings, "admin_password", "secret123")
    assert auth.verify_password("secret123") is True
    assert auth.verify_password("wrong") is False
    assert auth.verify_password("") is False


def test_token_roundtrip():
    payload = auth._decode_token(auth.create_token())
    assert payload["sub"] == "admin"


def test_expired_token_rejected(monkeypatch):
    monkeypatch.setattr(auth.settings, "token_expire_hours", -1)  # already expired
    token = auth.create_token()
    with pytest.raises(HTTPException) as exc:
        auth._decode_token(token)
    assert exc.value.status_code == 401


def test_garbage_token_rejected():
    with pytest.raises(HTTPException) as exc:
        auth._decode_token("not.a.real.jwt")
    assert exc.value.status_code == 401


def test_none_algorithm_attack_rejected():
    # A token forged with the 'none' algorithm must not be accepted.
    forged = jwt.encode({"sub": "admin"}, key="", algorithm="none")
    with pytest.raises(HTTPException):
        auth._decode_token(forged)


async def test_require_admin_without_credentials():
    with pytest.raises(HTTPException) as exc:
        await auth.require_admin(None)
    assert exc.value.status_code == 401


def test_login_rate_limit():
    auth._login_attempts.clear()
    ip = "203.0.113.7"
    for _ in range(auth._RATE_LIMIT_MAX):
        auth.check_login_rate(ip)  # first N allowed
    with pytest.raises(HTTPException) as exc:
        auth.check_login_rate(ip)  # next one blocked
    assert exc.value.status_code == 429
