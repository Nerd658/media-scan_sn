import torch
from transformers import CamembertTokenizer, CamembertForSequenceClassification, pipeline
import pandas as pd
from tqdm import tqdm

# CHEMINS (Ils sont corrects)
MODEL_PATH = "src/classification/saved_models/camembert_classifier/"
INPUT_FILE = "data/facebook/facebook_posts_final.csv"
OUTPUT_FILE = "data/facebook/facebook_posts_classified.csv"

# Charger le pipeline
print(f"Chargement du modèle fine-tuné depuis {MODEL_PATH}...")
try:
    # Si tu as un GPU local, mets 0. Sinon, -1 utilisera le CPU.
    device = 0 if torch.cuda.is_available() else -1 
    classifier = pipeline(
        "text-classification",
        model=MODEL_PATH,
        tokenizer=MODEL_PATH,
        device=device 
    )
    print(f"Modèle chargé avec succès sur le device: {'GPU' if device == 0 else 'CPU'}")
except Exception as e:
    print(f"Erreur lors du chargement du modèle : {e}")
    print("Assure-toi que les fichiers (config.json, model.safetensors, etc.) sont bien dans le dossier.")
    exit()

# Labels (doivent correspondre EXACTEMENT à l'entraînement)
CATEGORIES = ["Politique","Gouvernance","Économie", "Sécurité", "Santé", "Culture", "Sport", "Autres", "Social", "Environnement", "Diplomatie","Justice","Humanitaire"]

def classify_all_posts():
    """
    Charge le CSV final, applique la classification sur chaque post, 
    et sauvegarde le résultat.
    """
    try:
        df = pd.read_csv(INPUT_FILE)
    except FileNotFoundError:
        print(f"Erreur : Fichier {INPUT_FILE} non trouvé. Avez-vous lancé l'étape 0 ?")
        return

    # --- MODIFICATION ---
    # On utilise la colonne 'contenu' que nous avons créée
    if 'contenu' not in df.columns:
        print(f"Erreur : Colonne 'contenu' non trouvée dans {INPUT_FILE}.")
        return
    
    text_column = 'contenu'
    # --- FIN MODIFICATION ---

    texts = df[text_column].fillna("").tolist()

    print(f"Début de la classification de {len(texts)} posts (cela peut prendre du temps)...")

    # Classification par batch pour la vitesse (si GPU disponible)
    results = []
    batch_size = 32 if device == 0 else 1 # batch_size de 1 si CPU

    # tqdm pour la barre de progression
    for i in tqdm(range(0, len(texts), batch_size), desc="Classification"):
        batch = texts[i:i+batch_size]
        try:
            # On utilise max_length=256, comme à l'entraînement
            batch_results = classifier(batch, truncation=True, max_length=256)
            results.extend(batch_results)
        except Exception as e:
            # Gérer les textes vides ou problématiques
            print(f"Erreur sur batch {i}: {e}. Remplacement par 'Autres'.")
            results.extend([{'label': 'LABEL_6', 'score': 1.0}] * len(batch))

    # Mapper les résultats (ex: 'LABEL_0') aux noms (ex: 'Politique')
    df['theme'] = [CATEGORIES[int(r['label'].split('_')[-1])] for r in results]
    df['theme_confidence'] = [r['score'] for r in results]

    df.to_csv(OUTPUT_FILE, index=False, encoding='utf-8-sig')
    print(f"\n--- Étape 1 (predict) Terminée ---")
    print(f"Classification terminée. Fichier sauvegardé : {OUTPUT_FILE}")

if __name__ == "__main__":
    classify_all_posts()