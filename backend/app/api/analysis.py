from fastapi import APIRouter
from ..models.analysis import TexteAAnalyser, AnalysisResult
from ..services import nlp_service, database_service
import datetime

router = APIRouter()

@router.post("/analyser-texte")
async def analyser_un_texte(data: TexteAAnalyser):
    """
    Analyzes a text, saves the result and returns it.
    """
    texte_recu = data.texte
    
    # 1. Analyze the text
    donnees_analysees = await nlp_service.analyse_text_external(texte_recu)
    
    # 2. Save the analysis
    document_a_sauver = AnalysisResult(
        texte_original=texte_recu,
        resultat_analyse=donnees_analysees,
        date_analyse=datetime.datetime.now(datetime.UTC)
    )
    await database_service.save_analysis(document_a_sauver)
    
    # 3. Return the result
    return donnees_analysees
