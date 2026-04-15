import yfinance as yf
from typing import Tuple
from fastapi import HTTPException


class YFinanceService:
    @staticmethod
    def get_quote_data(symbol: str) -> Tuple[float, float, int]:
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            if not info or "currentPrice" not in info:
                raise HTTPException(status_code=404, detail="Symbol not found")

            current_price = float(info["currentPrice"])
            previous_close = float(info.get("previousClose", current_price))
            percent_change = (
                ((current_price - previous_close) / previous_close) * 100
                if previous_close
                else 0.0
            )
            volume = int(info.get("volume", 0))

            return current_price, percent_change, volume
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching data: {str(e)}")