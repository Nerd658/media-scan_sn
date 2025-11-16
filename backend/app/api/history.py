from fastapi import APIRouter
from ..services import database_service

router = APIRouter()

@router.get("/historique")
async def get_historique_analyses():
    """
    Retrieves the 50 latest analyses from the database.
    """
    return await database_service.get_analysis_history()
