import os
import pytest

# Set required environment variables BEFORE any test imports
# This prevents pydantic_settings from failing when .env doesn't exist
os.environ.setdefault("GEMINI_API_KEY", "test-api-key")
os.environ.setdefault("FRONTEND_URL", "http://localhost:3000")
