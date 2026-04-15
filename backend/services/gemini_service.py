import google.generativeai as genai
from config import settings
from typing import Dict, Any
import json
import re


class GeminiService:
    _configured = False

    @classmethod
    def _ensure_configured(cls):
        if not cls._configured:
            genai.configure(api_key=settings.gemini_api_key)
            cls._configured = True

    @staticmethod
    def analyze_sentiment(market_data: Dict[str, Any]) -> Dict[str, str]:
        GeminiService._ensure_configured()
        prompt = (
            f"Eres analista financiero. Basado en estos datos de mercado: "
            f"{json.dumps(market_data)}, responde ÚNICAMENTE con un objeto JSON "
            f'con los campos "sentiment" (valor: Bullish, Neutral o Bearish) '
            f'y "justification" (string corto en inglés explicando el análisis). '
            f"No incluyas markdown ni texto extra."
        )

        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(prompt)
            # Strip possible markdown code fences
            text = response.text.strip()
            text = re.sub(r"^```(?:json)?\s*", "", text)
            text = re.sub(r"\s*```$", "", text)
            result = json.loads(text)
            return result
        except Exception as e:
            return {
                "sentiment": "Neutral",
                "justification": f"Error analyzing sentiment: {str(e)}",
            }