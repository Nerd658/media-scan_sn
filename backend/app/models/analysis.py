from pydantic import BaseModel
from typing import Optional, Dict, Any
import datetime

class TexteAAnalyser(BaseModel):
    texte: str

class AnalysisResult(BaseModel):
    texte_original: str
    resultat_analyse: Dict[str, Any]
    date_analyse: datetime.datetime

class AnalysisResultInDB(AnalysisResult):
    id: str
