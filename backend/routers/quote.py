from fastapi import APIRouter, HTTPException
from services.yfinance_service import YFinanceService
from models import QuoteResponse

router = APIRouter()

@router.get("/quote/{symbol}", response_model=QuoteResponse)
async def get_quote(symbol: str):
    try:
        current_price, percent_change, volume = YFinanceService.get_quote_data(symbol)
        return QuoteResponse(
            symbol=symbol.upper(),
            current_price=current_price,
            percent_change=percent_change,
            volume=volume
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")