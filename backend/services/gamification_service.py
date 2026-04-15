from typing import Dict, List
from math import floor

class GamificationService:
    # Almacenamiento en memoria
    _user_data: Dict[str, Dict] = {}
    
    BADGES = {
        1: "First Analysis",
        5: "Bull Market Expert", 
        10: "Sentinel"
    }
    
    @classmethod
    def get_user_data(cls, user_id: str) -> Dict:
        if user_id not in cls._user_data:
            cls._user_data[user_id] = {
                "xp": 0,
                "analysis_count": 0,
                "badges": []
            }
        return cls._user_data[user_id]
    
    @classmethod
    def add_analysis(cls, user_id: str) -> Dict:
        data = cls.get_user_data(user_id)
        data["xp"] += 10
        data["analysis_count"] += 1
        
        # Check for new badges
        count = data["analysis_count"]
        for threshold, badge in cls.BADGES.items():
            if count >= threshold and badge not in data["badges"]:
                data["badges"].append(badge)
        
        level = floor(data["xp"] / 50) + 1
        next_level_xp = level * 50
        
        return {
            "xp": data["xp"],
            "level": level,
            "badges": data["badges"],
            "nextLevelXP": next_level_xp
        }
    
    @classmethod
    def get_stats(cls, user_id: str) -> Dict:
        data = cls.get_user_data(user_id)
        level = floor(data["xp"] / 50) + 1
        next_level_xp = level * 50
        
        return {
            "xp": data["xp"],
            "level": level,
            "badges": data["badges"],
            "nextLevelXP": next_level_xp,
            "analysis_count": data["analysis_count"]
        }