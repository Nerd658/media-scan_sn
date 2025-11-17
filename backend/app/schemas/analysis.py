from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime

# Schemas for individual AI predictions
class SentimentResult(BaseModel):
    label: str
    score: float

class ToxicityResult(BaseModel):
    score: float
    hate: bool
    insult: bool

class MisinformationResult(BaseModel):
    label: str

class PoliticsResult(BaseModel):
    is_political: bool
    category: str

# Schema for the full AI analysis response
class FullAnalysisResponse(BaseModel):
    sentiment: Optional[SentimentResult] = None
    toxicity: Optional[ToxicityResult] = None
    misinformation: Optional[MisinformationResult] = None
    politics: Optional[PoliticsResult] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Schema for input text
class TextInput(BaseModel):
    text: str

# Schema for batch text input
class BatchTextInput(BaseModel):
    texts: List[str]
