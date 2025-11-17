import httpx
from typing import Dict, Any, Optional

# Assuming the AI API URL is configured in settings
from ..config import settings

class AIService:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.client = httpx.AsyncClient(base_url=self.base_url)

    async def _post_to_ai(self, endpoint: str, text: str) -> Optional[Dict[str, Any]]:
        try:
            response = await self.client.post(endpoint, json={"text": text})
            response.raise_for_status()  # Raise an exception for 4xx or 5xx status codes
            return response.json()
        except httpx.HTTPStatusError as e:
            print(f"AI API HTTP error for {endpoint}: {e.response.status_code} - {e.response.text}")
            return None
        except httpx.RequestError as e:
            print(f"AI API request error for {endpoint}: {e}")
            return None
        except Exception as e:
            print(f"An unexpected error occurred calling AI API {endpoint}: {e}")
            return None

    async def predict_sentiment(self, text: str) -> Optional[Dict[str, Any]]:
        return await self._post_to_ai("/predict/sentiment", text)

    async def predict_toxicity(self, text: str) -> Optional[Dict[str, Any]]:
        return await self._post_to_ai("/predict/toxicity", text)

    async def predict_misinformation(self, text: str) -> Optional[Dict[str, Any]]:
        return await self._post_to_ai("/predict/misinformation", text)

    async def predict_politics(self, text: str) -> Optional[Dict[str, Any]]:
        return await self._post_to_ai("/predict/politics", text)

    async def analyze_full(self, text: str) -> Optional[Dict[str, Any]]:
        return await self._post_to_ai("/analysis/full", text)

# Initialize the AI service with the URL from settings
# This assumes settings.nlp_api_url is available and correctly configured
# For now, we'll use a placeholder. We need to add nlp_api_url to config.py
ai_service = AIService(settings.nlp_api_url)
