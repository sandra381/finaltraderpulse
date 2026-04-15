import pytest
from services.gamification_service import GamificationService

def test_add_analysis():
    user_id = "test_user"
    # Reset user data for test
    GamificationService._user_data[user_id] = {"xp": 0, "analysis_count": 0, "badges": []}
    
    # First analysis
    result = GamificationService.add_analysis(user_id)
    assert result["xp"] == 10
    assert result["level"] == 1
    assert result["badges"] == ["First Analysis"]
    assert result["nextLevelXP"] == 50
    
    # Second analysis
    result = GamificationService.add_analysis(user_id)
    assert result["xp"] == 20
    assert result["level"] == 1
    assert result["badges"] == ["First Analysis"]
    
    # Fifth analysis
    for _ in range(3):
        GamificationService.add_analysis(user_id)
    result = GamificationService.add_analysis(user_id)
    assert result["xp"] == 60
    assert result["level"] == 2
    assert "Bull Market Expert" in result["badges"]
    assert result["nextLevelXP"] == 100

def test_get_stats():
    user_id = "test_user_2"
    GamificationService._user_data[user_id] = {"xp": 100, "analysis_count": 10, "badges": ["First Analysis", "Bull Market Expert", "Sentinel"]}
    
    stats = GamificationService.get_stats(user_id)
    assert stats["xp"] == 100
    assert stats["level"] == 3
    assert stats["badges"] == ["First Analysis", "Bull Market Expert", "Sentinel"]
    assert stats["nextLevelXP"] == 150
    assert stats["analysis_count"] == 10