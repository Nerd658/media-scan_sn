import httpx
from ..config import settings

NLP_API_ENDPOINT = f"{settings.nlp_api_url}/predict"
HEALTH_CHECK_URL = f"{settings.nlp_api_url}/health"

async def analyse_text_external(text: str) -> dict:
    """
    Calls the external NLP API to analyze the given text.
    """
    try:
        async with httpx.AsyncClient() as client:
            print(f"Calling NLP API at: {NLP_API_ENDPOINT}")
            response = await client.post(
                NLP_API_ENDPOINT, json={"text": text}, timeout=10.0
            )
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as e:
        return {"error": f"NLP API failed (code {e.response.status_code})", "details": str(e)}
    except httpx.RequestError as e:
        return {"error": f"Could not reach NLP API: {settings.nlp_api_url}", "details": str(e)}
    except Exception as e:
        return {"error": "Internal error", "details": str(e)}

async def get_nlp_api_status() -> dict:
    """
    Checks the health of the external NLP API.
    """
    try:
        async with httpx.AsyncClient() as client:
            print(f"Calling monitoring at: {HEALTH_CHECK_URL}")
            response = await client.get(HEALTH_CHECK_URL, timeout=5.0)
            response.raise_for_status()
            return response.json()
    except (httpx.RequestError, httpx.HTTPStatusError) as e:
        print(f"Monitoring error: {e}")
        return {"status": "DOWN", "error": "NLP API is unreachable or down"}
