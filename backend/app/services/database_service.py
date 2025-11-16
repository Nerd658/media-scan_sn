from ..db import db
from ..models.analysis import AnalysisResult
import datetime

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
