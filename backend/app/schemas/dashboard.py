from pydantic import BaseModel, Field, BeforeValidator
from typing import Optional, List, Annotated, Dict
from datetime import datetime

# Pydantic v2 compatible way to handle MongoDB's ObjectId
PyObjectId = Annotated[str, BeforeValidator(str)]

class InfluenceRankingSchema(BaseModel):
    id: Optional[PyObjectId] = Field(alias='_id', default=None)
    media: str
    audience_raw: Optional[float] = None
    engagement_raw: Optional[float] = None
    regularity_raw: Optional[float] = None
    diversity_raw: Optional[int] = None
    audience_norm: Optional[float] = None
    engagement_norm: Optional[float] = None
    regularity_norm: Optional[float] = None
    diversity_norm: Optional[float] = None
    audience_score: Optional[float] = None
    engagement_score: Optional[float] = None
    regularity_score: Optional[float] = None
    diversity_score: Optional[float] = None
    score_influence_total: Optional[float] = None

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True
        json_encoders = { "ObjectId": str }

class MonitoringAlertSchema(BaseModel):
    id: Optional[PyObjectId] = Field(alias='_id', default=None)
    type: str
    media: str
    message: str
    post_link: Optional[str] = None
    date: datetime

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True
        json_encoders = { "ObjectId": str }

class SensitiveAlertSchema(BaseModel):
    id: Optional[PyObjectId] = Field(alias='_id', default=None)
    comment_id: int
    post_id: Optional[int] = None
    media_page: Optional[str] = None
    comment_text: Optional[str] = None
    true_category: Optional[str] = None
    model_label_raw: Optional[str] = None
    model_score: Optional[float] = None
    model_label: str

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True
        json_encoders = { "ObjectId": str }

class TrendDataSchema(BaseModel):
    dates: List[str]
    counts: List[int]

class MediaTrendsSchema(BaseModel):
    media: str
    dates: List[str]
    counts: List[int]

    class Config:
        from_attributes = True

class ThemeSchema(BaseModel):
    theme: str
    count: int

class ByMediaSchema(BaseModel):
    media: str
    themes: Dict[str, int]

class ThemeDistributionSchema(BaseModel):
    id: Optional[PyObjectId] = Field(alias='_id', default=None)
    global_themes: List[ThemeSchema]
    by_media: Dict[str, Dict[str, int]]

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True
        json_encoders = { "ObjectId": str }

class MediaScoresSchema(BaseModel):
    total_influence: float = Field(alias="Score d'Influence Total")
    audience: float = Field(alias="Score d'Audience")
    engagement: float = Field(alias="Score d'Engagement")
    regularity: float = Field(alias="Score de Régularité")
    diversity: float = Field(alias="Score de Diversité")

class MediaDetailsSchema(BaseModel):
    name: str
    description: str
    scores: MediaScoresSchema
    themes: Dict[str, int]

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True
        json_encoders = { "ObjectId": str }
