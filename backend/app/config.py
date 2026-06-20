from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str = "postgresql://su:su_dev_password@localhost:5432/su_portal"
    admin_password: str = "changeme"
    jwt_secret: str = "dev-secret-change-in-production"
    token_expire_hours: int = 24 * 7
    cors_origins: str = "http://localhost:3000,https://su.fblrkus.ru"
    debug: bool = False

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]


settings = Settings()
