from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.gamification_service import GamificationService

class AnalyzeRequest(BaseModel):
    symbol: str

router = APIRouter()

@router.post("/gamification/analyze")
async def analyze_symbol(request: AnalyzeRequest):
    user_id = "user_1"  # Usuario único por ahora
    try:
        result = GamificationService.add_analysis(user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in gamification: {str(e)}")

@router.get("/gamification/stats")
async def get_gamification_stats():
    user_id = "user_1"  # Usuario único por ahora
    try:
        stats = GamificationService.get_stats(user_id)
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting stats: {str(e)}")