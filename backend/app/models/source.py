from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Source(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    name: str
    url: str
    status: str = "Active"
    last_scraped: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "name": "L'Observateur Paalga",
                "url": "https://www.lobservateur.bf/",
                "status": "Active",
                "last_scraped": "2025-11-16T10:00:00Z",
            }
        }