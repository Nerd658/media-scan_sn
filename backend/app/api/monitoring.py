from fastapi import APIRouter
from ..services import nlp_service

router = APIRouter()

@router.get("/monitoring-status")
async def get_monitoring_status():
    """
    Checks the health status of the external NLP API.
    """
    return await nlp_service.get_nlp_api_status()
