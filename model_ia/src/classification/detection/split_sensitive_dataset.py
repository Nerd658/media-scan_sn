import pandas as pd
from sklearn.model_selection import train_test_split

INPUT_FILE = "data/facebook/simulated_comments.csv"
TRAIN_FILE = "data/facebook/comments_FOR_TRAINING.csv"
PREDICT_FILE = "data/facebook/comments_FOR_PREDICTION.csv"
HOLDOUT_SIZE = 0.2 # On garde 20% des données pour le test final

def create_holdout_set():
    """
    Splitte le jeu de commentaires simulés en un set d'entraînement/validation
    et un set de prédiction final (hold-out) que le modèle ne verra jamais.
    """
    print(f"Chargement de {INPUT_FILE}")
    df = pd.read_csv(INPUT_FILE)
    df = df.dropna(subset=['comment_text', 'true_category'])

    # Splitter en 80% train/val et 20% prédiction finale
    df_train_val, df_predict = train_test_split(
        df,
        test_size=HOLDOUT_SIZE,
        random_state=42,
        stratify=df['true_category'] # Assure qu'on a de tout dans les 2 sets
    )

    # Sauvegarder les deux fichiers
    df_train_val.to_csv(TRAIN_FILE, index=False, encoding='utf-8-sig')
    df_predict.to_csv(PREDICT_FILE, index=False, encoding='utf-8-sig')

    print("--- Étape 5-A Terminée ---")
    print(f"{len(df_train_val)} commentaires sauvegardés dans {TRAIN_FILE} (pour Colab)")
    print(f"{len(df_predict)} commentaires sauvegardés dans {PREDICT_FILE} (pour le test final)")

if __name__ == "__main__":
    create_holdout_set()