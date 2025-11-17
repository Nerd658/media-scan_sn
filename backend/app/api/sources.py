from fastapi import APIRouter, HTTPException, status
from typing import List
from ..models.source import Source
from ..services import database_service

router = APIRouter()

@router.post("/sources", response_model=Source, status_code=status.HTTP_201_CREATED)
async def create_source(source: Source):
    """
    Adds a new media source to the database.
    """
    try:
        new_source = await database_service.add_source(source)
        return new_source
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add source: {e}")

@router.get("/sources", response_model=List[Source])
async def read_sources():
    """
    Retrieves all media sources.
    """
    sources = await database_service.get_all_sources()
    return sources

@router.get("/sources/{source_id}", response_model=Source)
async def read_source(source_id: str):
    """
    Retrieves a single media source by its ID.
    """
    source = await database_service.get_source_by_id(source_id)
    if source is None:
        raise HTTPException(status_code=404, detail="Source not found")
    return source

@router.put("/sources/{source_id}", response_model=Source)
async def update_source(source_id: str, source: Source):
    """
    Updates an existing media source.
    """
    updated_source = await database_service.update_source(source_id, source)
    if updated_source is None:
        raise HTTPException(status_code=404, detail="Source not found")
    return updated_source

@router.delete("/sources/{source_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_source(source_id: str):
    """
    Deletes a media source.
    """
    deleted = await database_service.delete_source(source_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Source not found")
    return