from ..db import db
from ..models.analysis import AnalysisResult
from ..models.source import Source # Import the new Source model
import datetime
from bson import ObjectId

async def save_analysis(analysis_data: AnalysisResult):
    """
    Saves an analysis result to the database.
    """
    if "analyses_collection" in db:
        print("Saving analysis to DB...")
        await db["analyses_collection"].insert_one(analysis_data.dict())
        print("Analysis saved!")

async def get_analysis_history(limit: int = 50) -> list:
    """
    Retrieves the latest analysis results from the database.
    """
    analyses_list = []
    if "analyses_collection" not in db:
        return {"error": "DB connection not available"}

    try:
        analyses_cursor = db["analyses_collection"].find().sort("date_analyse", -1).limit(limit)
        async for doc in analyses_cursor:
            doc["_id"] = str(doc["_id"])
            analyses_list.append(doc)
        return analyses_list
    except Exception as e:
        return {"error": "Error retrieving history", "details": str(e)}

async def get_stats():
    """
    Calculates high-level statistics from the database.
    """
    if "analyses_collection" not in db:
        return {"error": "DB connection not available"}

    try:
        total_analyses = await db["analyses_collection"].count_documents({})
        
        # This is a placeholder for more complex stats
        stats = {
            "total_analyses": total_analyses,
            "total_toxiques_simules": 0,
            "repartition_sentiments_simules": {
                "positif": 15,
                "negatif": 5,
                "neutre": 30
            }
        }
        return stats
    except Exception as e:
        return {"error": "Error calculating statistics", "details": str(e)}

# --- Source Management Functions ---

async def get_all_sources() -> list[Source]:
    """
    Retrieves all media sources from the database.
    """
    sources_list = []
    if "sources_collection" not in db:
        return [] # Or raise an error, depending on desired behavior

    try:
        sources_cursor = db["sources_collection"].find()
        async for doc in sources_cursor:
            doc["_id"] = str(doc["_id"])
            sources_list.append(Source(**doc))
        return sources_list
    except Exception as e:
        print(f"Error retrieving sources: {e}")
        return []

async def get_source_by_id(source_id: str) -> Optional[Source]:
    """
    Retrieves a single media source by its ID.
    """
    if "sources_collection" not in db:
        return None

    try:
        doc = await db["sources_collection"].find_one({"_id": ObjectId(source_id)})
        if doc:
            doc["_id"] = str(doc["_id"])
            return Source(**doc)
        return None
    except Exception as e:
        print(f"Error retrieving source by ID: {e}")
        return None

async def add_source(source_data: Source) -> Source:
    """
    Adds a new media source to the database.
    """
    if "sources_collection" not in db:
        raise Exception("DB connection not available for sources")

    try:
        result = await db["sources_collection"].insert_one(source_data.dict(by_alias=True))
        source_data.id = str(result.inserted_id)
        return source_data
    except Exception as e:
        print(f"Error adding source: {e}")
        raise

async def update_source(source_id: str, source_data: Source) -> Optional[Source]:
    """
    Updates an existing media source in the database.
    """
    if "sources_collection" not in db:
        raise Exception("DB connection not available for sources")

    try:
        update_result = await db["sources_collection"].update_one(
            {"_id": ObjectId(source_id)},
            {"$set": source_data.dict(exclude_unset=True, by_alias=True)}
        )
        if update_result.modified_count == 1:
            return await get_source_by_id(source_id)
        return None
    except Exception as e:
        print(f"Error updating source: {e}")
        raise

async def delete_source(source_id: str) -> bool:
    """
    Deletes a media source from the database.
    """
    if "sources_collection" not in db:
        return False

    try:
        delete_result = await db["sources_collection"].delete_one({"_id": ObjectId(source_id)})
        return delete_result.deleted_count == 1
    except Exception as e:
        print(f"Error deleting source: {e}")
        return False
