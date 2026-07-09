import hashlib
import secrets
import time
from collections import defaultdict
from datetime import UTC, datetime, timedelta
from typing import Annotated

import asyncpg
import jwt
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import settings
from app.database import get_pool

_ALGORITHM = "HS256"
_bearer = HTTPBearer(auto_error=False)

# Per-IP sliding window: at most 5 login attempts per 60 s.
# Stored in-memory — resets on restart, which is acceptable for a single-admin app.
_login_attempts: dict[str, list[float]] = defaultdict(list)
_RATE_LIMIT_MAX = 5
_RATE_LIMIT_WINDOW = 60.0  # seconds

# Separate bucket for public survey/questionnaire submissions — no auth to key
# off of, so IP is the only signal; more lenient than login since legitimate
# users may retry a submission.
_submission_attempts: dict[str, list[float]] = defaultdict(list)
_SUBMIT_RATE_LIMIT_MAX = 10
_SUBMIT_RATE_LIMIT_WINDOW = 60.0  # seconds


def verify_password(password: str) -> bool:
    # compare_digest runs in constant time to prevent timing attacks.
    return secrets.compare_digest(password, settings.admin_password)


def get_client_ip(request: Request) -> str:
    """Real client IP for rate limiting.

    The app is only ever reachable through the project's own nginx reverse
    proxy (see compose.yml), which sets X-Forwarded-For — without this,
    request.client.host is always the proxy's IP and every visitor shares
    one rate-limit bucket.
    """
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _check_rate(
    store: dict[str, list[float]], ip: str, max_attempts: int, window_s: float, message: str
) -> None:
    now = time.monotonic()
    # Discard attempts outside the window, then check the count.
    window = [t for t in store[ip] if now - t < window_s]
    if len(window) >= max_attempts:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=message)
    window.append(now)
    store[ip] = window
    # Remove IPs whose entire window has expired to prevent unbounded growth.
    expired = [k for k, ts in store.items() if all(now - t >= window_s for t in ts)]
    for k in expired:
        del store[k]


def check_login_rate(ip: str) -> None:
    _check_rate(
        _login_attempts,
        ip,
        _RATE_LIMIT_MAX,
        _RATE_LIMIT_WINDOW,
        "Too many login attempts, try again later",
    )


def check_submission_rate(ip: str) -> None:
    _check_rate(
        _submission_attempts,
        ip,
        _SUBMIT_RATE_LIMIT_MAX,
        _SUBMIT_RATE_LIMIT_WINDOW,
        "Too many submissions, try again later",
    )


def _hash_jti(jti: str) -> bytes:
    return hashlib.sha256(jti.encode()).digest()


async def create_session(pool: asyncpg.Pool, jti: str, expires_at: datetime) -> None:
    await pool.execute(
        "INSERT INTO admin_sessions (token_hash, expires_at) VALUES ($1, $2)",
        _hash_jti(jti),
        expires_at,
    )


async def is_session_valid(pool: asyncpg.Pool, jti: str) -> bool:
    row = await pool.fetchval(
        "SELECT 1 FROM admin_sessions WHERE token_hash = $1 AND expires_at > now()",
        _hash_jti(jti),
    )
    return row is not None


async def revoke_session(pool: asyncpg.Pool, jti: str) -> None:
    await pool.execute("DELETE FROM admin_sessions WHERE token_hash = $1", _hash_jti(jti))


def create_token() -> tuple[str, str]:
    """Returns (token, jti). The caller must persist the session via create_session()."""
    jti = secrets.token_hex(16)
    payload = {
        "sub": "admin",
        "jti": jti,
        "iat": datetime.now(UTC),
        "exp": datetime.now(UTC) + timedelta(hours=settings.token_expire_hours),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=_ALGORITHM), jti


def _decode_token(token: str) -> dict:
    # algorithms list prevents the "none" algorithm confusion attack.
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=[_ALGORITHM])
    except jwt.ExpiredSignatureError as err:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired"
        ) from err
    except jwt.PyJWTError as err:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        ) from err


async def require_admin(
    request: Request,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)],
) -> str:
    """Verifies the JWT and returns the subject claim. Use as a FastAPI dependency."""
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    payload = _decode_token(credentials.credentials)
    jti = payload.get("jti")
    if jti and not await is_session_valid(get_pool(request), jti):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session revoked")
    # Stash jti so a logout endpoint can revoke this exact session without re-decoding.
    request.state.jti = jti
    return payload["sub"]
