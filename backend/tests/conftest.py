"""Shared test setup. Sets safe env defaults before app.config is imported."""

import os

os.environ.setdefault("ADMIN_PASSWORD", "test-admin-pw")
os.environ.setdefault("JWT_SECRET", "test-secret-not-for-production-0123456789")
os.environ.setdefault("DEBUG", "true")
os.environ.setdefault("TOKEN_EXPIRE_HOURS", "168")
os.environ.setdefault("DATABASE_URL", "postgresql://su:su_dev_password@localhost:6767/su_portal")
