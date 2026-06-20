import json

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str = "postgresql://su:su_dev_password@localhost:5432/su_portal"
    admin_password: str = "changeme"
    jwt_secret: str = "dev-secret-change-in-production"
    token_expire_hours: int = 24 * 7
    cors_origins: list[str] = ["http://localhost:3000", "https://su.fblrkus.ru"]
    debug: bool = False

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: object) -> object:
        if not isinstance(v, str):
            return v
        v = v.strip()
        if v.startswith("["):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                pass
        return [o.strip() for o in v.split(",") if o.strip()]


settings = Settings()
