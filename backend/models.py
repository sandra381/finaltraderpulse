from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class HealthResponse(BaseModel):
    status: str

class QuoteResponse(BaseModel):
    symbol: str
    current_price: float
    percent_change: float
    volume: int

class SentimentResponse(BaseModel):
    symbol: str
    sentiment: str  # Bullish/Neutral/Bearish
    justification: str
    timestamp: datetime