from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.quote import router as quote_router
from routers.sentiment import router as sentiment_router
from routers.gamification import router as gamification_router
from models import HealthResponse
from config import settings

app = FastAPI(title="TraderPulse Backend", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(quote_router, prefix="/api/v1", tags=["quote"])
app.include_router(sentiment_router, prefix="/api/v1", tags=["sentiment"])
app.include_router(gamification_router, prefix="/api/v1", tags=["gamification"])

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(status="ok")