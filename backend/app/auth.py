import secrets
import time
from collections import defaultdict
from datetime import UTC, datetime, timedelta
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import settings

_ALGORITHM = "HS256"
_bearer = HTTPBearer(auto_error=False)

# Per-IP sliding window: at most 5 login attempts per 60 s.
# Stored in-memory — resets on restart, which is acceptable for a single-admin app.
_login_attempts: dict[str, list[float]] = defaultdict(list)
_RATE_LIMIT_MAX = 5
_RATE_LIMIT_WINDOW = 60.0  # seconds


def verify_password(password: str) -> bool:
    # compare_digest runs in constant time to prevent timing attacks.
    return secrets.compare_digest(password, settings.admin_password)


def check_login_rate(ip: str) -> None:
    now = time.monotonic()
    # Discard attempts outside the window, then check the count.
    window = [t for t in _login_attempts[ip] if now - t < _RATE_LIMIT_WINDOW]
    if len(window) >= _RATE_LIMIT_MAX:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many login attempts, try again later",
        )
    window.append(now)
    _login_attempts[ip] = window
    # Remove IPs whose entire window has expired to prevent unbounded growth.
    expired = [
        k for k, ts in _login_attempts.items() if all(now - t >= _RATE_LIMIT_WINDOW for t in ts)
    ]
    for k in expired:
        del _login_attempts[k]


def create_token() -> str:
    payload = {
        "sub": "admin",
        "iat": datetime.now(UTC),
        "exp": datetime.now(UTC) + timedelta(hours=settings.token_expire_hours),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=_ALGORITHM)


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
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)],
) -> str:
    """Verifies the JWT and returns the subject claim. Use as a FastAPI dependency."""
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    payload = _decode_token(credentials.credentials)
    return payload["sub"]
