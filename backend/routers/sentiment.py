from fastapi import APIRouter, HTTPException
from services.yfinance_service import YFinanceService
from services.gemini_service import GeminiService
from services.gamification_service import GamificationService
from models import SentimentResponse
from datetime import datetime, timezone

router = APIRouter()

@router.get("/sentiment/{symbol}", response_model=SentimentResponse)
async def get_sentiment(symbol: str):
    try:
        # Obtener datos de mercado
        current_price, percent_change, volume = YFinanceService.get_quote_data(symbol)
        market_data = {
            "symbol": symbol.upper(),
            "current_price": current_price,
            "percent_change": percent_change,
            "volume": volume
        }
        
        # Analizar sentimiento con Gemini
        sentiment_analysis = GeminiService.analyze_sentiment(market_data)
        
        # Gamificación: sumar XP por análisis
        user_id = "user_1"  # Usuario único por ahora
        GamificationService.add_analysis(user_id)
        
        return SentimentResponse(
            symbol=symbol.upper(),
            sentiment=sentiment_analysis["sentiment"],
            justification=sentiment_analysis["justification"],
            timestamp=datetime.now(timezone.utc)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")