import pandas as pd
from transformers import pipeline
import torch
import json
from tqdm import tqdm

# CHEMINS (Corrects)
MODEL_PATH = "src/classification/saved_models/sensitive_classifier/"
INPUT_FILE = "data/facebook/comments_FOR_PREDICTION.csv"
OUTPUT_FILE = "output/sensitive_alerts.json"

# Nos labels (Corrects)
CATEGORIES = ['normal', 'toxic', 'hateful', 'misinfo', 'adult']

def generate_alerts_from_holdout():
    """
    Charge notre modèle fine-tuné et l'exécute sur le
    jeu de test "hold-out".
    Version Corrigée : on garde TOUTES les détections non-normales.
    """
    print(f"Chargement de notre modèle sensible fine-tuné (98.7% Prc) depuis {MODEL_PATH}...")
    try:
        device = 0 if torch.cuda.is_available() else -1
        sensitive_classifier = pipeline(
            "text-classification",
            model=MODEL_PATH,
            tokenizer=MODEL_PATH,
            device=device
        )
        print(f"Modèle chargé avec succès sur device: {'GPU' if device == 0 else 'CPU'}")
    except Exception as e:
        print(f"Erreur chargement modèle : {e}. As-tu bien dézippé le modèle ?")
        return

    print(f"Chargement du jeu de test 'hold-out' : {INPUT_FILE}...")
    try:
        df_predict = pd.read_csv(INPUT_FILE)
        df_predict = df_predict.dropna(subset=['comment_text'])
    except FileNotFoundError:
        print(f"Erreur : Fichier {INPUT_FILE} non trouvé.")
        print("Avez-vous lancé 'split_sensitive_dataset.py' ?")
        return

    texts = df_predict['comment_text'].tolist()
    if not texts:
        print("Aucun commentaire à analyser.")
        return

    print(f"Analyse de {len(texts)} commentaires du jeu 'hold-out'...")

    results = []
    batch_size = 32 if device == 0 else 1
    for i in tqdm(range(0, len(texts), batch_size), desc="Génération Alertes"):
        batch = texts[i:i+batch_size]
        try:
            batch_results = sensitive_classifier(batch, truncation=True, max_length=128)
            results.extend(batch_results)
        except Exception:
            results.extend([{'label': 'LABEL_0', 'score': 1.0}] * len(batch)) # 'normal'

    # Ajouter les prédictions au dataframe
    df_predict['model_label_raw'] = [r['label'] for r in results]
    df_predict['model_score'] = [r['score'] for r in results]
    df_predict['model_label'] = [CATEGORIES[int(r['label'].split('_')[-1])] for r in results]


    # Étape 1 : On ne garde que ce qui n'est PAS 'normal'
    df_alerts = df_predict[df_predict['model_label'] != 'normal'].copy()

    
    print(f"\n{len(df_alerts)} commentaires détectés comme NON-NORMAUX.")


    print(f"\n--- Module 5 (Excellence) Terminé ---")
    print(f"{len(df_alerts)} commentaires détectés comme sensibles (C'EST LE CHIFFRE FINAL).")

    # Formater pour le JSON de sortie
    output_data = df_alerts.to_dict(orient='records')
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=4, ensure_ascii=False)

    print(f"-> Alertes de contenu sensible sauvegardées dans {OUTPUT_FILE}")


if __name__ == "__main__":
    generate_alerts_from_holdout()