from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    gemini_api_key: str = "dummy-key"
    frontend_url: str = "http://localhost:3000"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()