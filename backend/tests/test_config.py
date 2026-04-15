import os
import pytest
from config import settings


def test_environment_variables():
    """Test that required settings attributes exist and have values."""
    assert hasattr(settings, 'gemini_api_key')
    assert hasattr(settings, 'frontend_url')
    assert settings.frontend_url  # non-empty


def test_cors_origins():
    """Test that CORS middleware is configured with the expected origin."""
    from main import app
    from starlette.middleware.cors import CORSMiddleware

    # user_middleware is a list of Middleware(cls, **kwargs) tuples
    cors_found = False
    cors_origins = []
    for m in app.user_middleware:
        if m.cls is CORSMiddleware:
            cors_found = True
            cors_origins = m.options.get('allow_origins', [])
            break

    assert cors_found, "CORSMiddleware not registered on app"
    assert settings.frontend_url in cors_origins