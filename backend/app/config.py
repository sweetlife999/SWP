from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str = "postgresql://postgres:postgres@localhost:5432/swp"
    admin_password: str = "changeme"
    jwt_secret: str = "dev-secret-change-in-production"
    token_expire_hours: int = 24 * 7
    cors_origins: list[str] = ["http://localhost:3000", "https://su.fblrkus.ru"]
    debug: bool = False


settings = Settings()
