from typing import List, Union, Dict, Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
import json
import os
import re # Import re for regex operations

from ..mongodb import get_database
from ..schemas.dashboard import InfluenceRankingSchema, MonitoringAlertSchema, SensitiveAlertSchema, TrendDataSchema, ThemeDistributionSchema, MediaDetailsSchema, MediaScoresSchema

router = APIRouter()

# Path to the static mediaDetails.json file
STATIC_MEDIA_DETAILS_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))),
    'frontend', 'media-scan', 'src', 'data', 'mediaDetails.json'
)

def load_static_media_details():
    """Loads media details from the static mediaDetails.json file."""
    try:
        with open(STATIC_MEDIA_DETAILS_PATH, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Warning: Static media details file not found at {STATIC_MEDIA_DETAILS_PATH}")
        return {}
    except json.JSONDecodeError as e:
        print(f"Error decoding static media details JSON: {e}")
        return {}

# Load static media details once at startup
STATIC_MEDIA_DETAILS = load_static_media_details()


@router.get("/influence-ranking", response_model=List[InfluenceRankingSchema])
async def get_influence_ranking(db: AsyncIOMotorClient = Depends(get_database)):
    """
    Returns the influence ranking of media from the MongoDB database.
    """
    rankings = await db["influence_ranking"].find().sort("score_influence_total", -1).to_list(length=100)
    return rankings

@router.get("/alerts", response_model=List[Union[MonitoringAlertSchema, SensitiveAlertSchema]])
async def get_alerts(db: AsyncIOMotorClient = Depends(get_database)):
    """
    Returns a combined list of monitoring and sensitive alerts from the MongoDB database.
    """
    monitoring_alerts_cursor = db["monitoring_alerts"].find()
    sensitive_alerts_cursor = db["sensitive_alerts"].find()

    monitoring_alerts = await monitoring_alerts_cursor.to_list(length=1000)
    sensitive_alerts = await sensitive_alerts_cursor.to_list(length=1000)

    # Note: The frontend will handle sorting and adding placeholder dates for sensitive alerts
    combined_alerts = monitoring_alerts + sensitive_alerts
    return combined_alerts

@router.get("/alerts/sensitive", response_model=List[SensitiveAlertSchema])
async def get_sensitive_alerts(
    db: AsyncIOMotorClient = Depends(get_database),
    category: Optional[str] = Query(None, description="Filter sensitive alerts by true_category (e.g., 'toxic', 'hateful')")
):
    """
    Returns a list of sensitive alerts from the MongoDB database, with optional filtering by category.
    """
    query = {}
    if category:
        query["true_category"] = category
    
    sensitive_alerts_cursor = db["sensitive_alerts"].find(query)
    sensitive_alerts = await sensitive_alerts_cursor.to_list(length=1000)
    return sensitive_alerts

@router.get("/trends", response_model=Dict[str, TrendDataSchema])
async def get_trends(db: AsyncIOMotorClient = Depends(get_database)):
    """
    Returns the publication trends for all media from the MongoDB database.
    """
    trends_cursor = db["media_trends"].find()
    trends_list = await trends_cursor.to_list(length=100)
    
    # Transform the list of documents into a dictionary keyed by media name
    trends_dict = {
        item["media"]: {
            "dates": item["dates"],
            "counts": item["counts"]
        }
        for item in trends_list
    }
    return trends_dict

@router.get("/themes", response_model=ThemeDistributionSchema)
async def get_themes(db: AsyncIOMotorClient = Depends(get_database)):
    """
    Returns the theme distribution data from the MongoDB database.
    """
    # There should only be one document in this collection
    theme_data = await db["theme_distribution"].find_one()
    return theme_data

@router.get("/media/compare", response_model=List[MediaDetailsSchema])
async def compare_media(
    media_names: List[str] = Query(..., description="List of media names to compare"),
    db: AsyncIOMotorClient = Depends(get_database)
):
    """
    Returns detailed information for multiple media for comparison.
    """
    compared_media_details = []
    for media_name in media_names:
        try:
            details = await get_media_details(media_name, db)
            compared_media_details.append(details)
        except HTTPException as e:
            # If a media is not found, we can either skip it or raise an error.
            # For comparison, skipping might be more user-friendly.
            print(f"Warning: {e.detail}")
            continue # Skip this media if not found
    
    return compared_media_details

@router.get("/media/{media_name}", response_model=MediaDetailsSchema)
async def get_media_details(media_name: str, db: AsyncIOMotorClient = Depends(get_database)):
    """
    Returns detailed information for a specific media, including ranking and theme distribution.
    """
    # Fetch ranking info
    ranking_info = await db["influence_ranking"].find_one({"media": media_name})
    if not ranking_info:
        raise HTTPException(status_code=404, detail=f"Media '{media_name}' not found in ranking data.")

    # Fetch theme info
    theme_distribution_doc = await db["theme_distribution"].find_one()
    theme_info = {}
    if theme_distribution_doc and "by_media" in theme_distribution_doc and media_name in theme_distribution_doc["by_media"]:
        theme_info = theme_distribution_doc["by_media"][media_name]

    # Get static description
    static_info = STATIC_MEDIA_DETAILS.get(media_name, {})
    description = static_info.get("description", "Description non disponible.")

    # Construct scores for MediaScoresSchema
    scores = MediaScoresSchema(
        **{
            "Score d'Influence Total": ranking_info["score_influence_total"],
            "Score d'Audience": ranking_info["audience_score"],
            "Score d'Engagement": ranking_info["engagement_score"],
            "Score de Régularité": ranking_info["regularity_score"],
            "Score de Diversité": ranking_info["diversity_score"],
        }
    )

    return MediaDetailsSchema(
        name=media_name,
        description=description,
        scores=scores,
        themes=theme_info,
    )
