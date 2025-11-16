from fastapi import APIRouter
from ..services import database_service

router = APIRouter()

@router.get("/statistiques")
async def get_statistiques():
    """
    Calculates high-level statistics from the database.
    """
    return await database_service.get_stats()
