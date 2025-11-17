from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from ..services.ai_service import ai_service # Corrected import
from ..schemas.analysis import TextInput, BatchTextInput, FullAnalysisResponse # Corrected import

router = APIRouter(prefix="/analysis", tags=["AI Analysis"])

@router.post("/", response_model=FullAnalysisResponse)
async def analyze_text(
    text_input: TextInput
):
    # Call AI service for full analysis
    ai_results = await ai_service.analyze_full(text_input.text)

    if ai_results is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to get AI analysis results.")

    # Return the full analysis response
    return FullAnalysisResponse(**ai_results)

@router.post("/batch", response_model=List[FullAnalysisResponse])
async def analyze_batch_text(
    batch_text_input: BatchTextInput
):
    results = []
    for text in batch_text_input.texts:
        ai_results = await ai_service.analyze_full(text)
        if ai_results is None:
            # Optionally, handle errors for individual items differently, e.g., log them
            print(f"Skipping analysis for text: {text[:50]}... due to AI service error.")
            results.append(None) # Or a specific error object
        else:
            results.append(FullAnalysisResponse(**ai_results))
    
    # Filter out None results if any analysis failed
    return [res for res in results if res is not None]

# Endpoint to get AI model stats (as per PDF)
@router.get("/stats/models")
async def get_model_stats():
    # This would typically call an AI service endpoint that provides model stats
    # For now, return a mock response
    return {
        "status": "ok",
        "models": {
            "sentiment": {"status": "online", "load": "20%"},
            "toxicity": {"status": "online", "load": "15%"},
            "misinformation": {"status": "online", "load": "10%"},
            "politics": {"status": "online", "load": "12%"}
        }
    }

# Endpoint to get AI analysis logs (as per PDF)
@router.get("/stats/logs")
async def get_analysis_logs():
    # This would typically retrieve logs from a logging system or database
    # For now, return a mock response
    return {
        "status": "ok",
        "logs": [
            {"timestamp": "2025-11-17T10:00:00Z", "event": "sentiment_analysis_success", "text_sample": "Some text..."},
            {"timestamp": "2025-11-17T10:05:00Z", "event": "toxicity_analysis_failure", "text_sample": "Another text...", "error": "AI model offline"}
        ]
    }