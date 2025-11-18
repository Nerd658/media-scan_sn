import pandas as pd
import numpy as np
import json

# CHEMINS 
INPUT_FILE = "data/facebook/facebook_posts_classified.csv"
OUTPUT_FILE = "output/influence_ranking.json"

# --- MODIFICATION ---
# On utilise nos 23 jours de simulation
SIMULATION_DAYS = 23
# --- FIN MODIFICATION ---

# Pondérations (validées)
WEIGHT_AUDIENCE = 0.30
WEIGHT_ENGAGEMENT = 0.40
WEIGHT_REGULARITY = 0.20
WEIGHT_DIVERSITY = 0.10

def normalize(series):
    """Normalisation Min-Max (0 à 1)"""
    # Gérer le cas où max == min (pour éviter division par zéro)
    if series.max() == series.min():
        return pd.Series(1.0, index=series.index)
    return (series - series.min()) / (series.max() - series.min())

def calculate_scores():
    """
    Calcule le score d'influence composite pour chaque média.
    """
    print(f"Chargement des données classifiées depuis {INPUT_FILE}...")
    try:
        df = pd.read_csv(INPUT_FILE)
    except FileNotFoundError:
        print(f"Erreur : Fichier {INPUT_FILE} non trouvé.")
        print("Avez-vous lancé le script 'src/classification/model/predict.py' ?")
        return

    # S'assurer que les dates sont au bon format
    df['post_date'] = pd.to_datetime(df['post_date'], errors='coerce')
    df = df.dropna(subset=['post_date'])

    # --- MODIFICATION ---
    # On calcule sur les 23 derniers jours (ou max de nos données)
    cutoff_date = df['post_date'].max() - pd.Timedelta(days=SIMULATION_DAYS)
    df_period = df[df['post_date'] >= cutoff_date]
    print(f"Calcul des scores sur {len(df_period)} posts ({SIMULATION_DAYS} derniers jours)...")
    # --- FIN MODIFICATION ---

    # --- MODIFICATION ---
    # Agréger par 'media' (le nom de notre colonne)
    grouped = df_period.groupby('media')
    # --- FIN MODIFICATION ---

    # 1. Audience (30%) - Basé sur les followers
    audience_metric = grouped['followers_count'].mean()

    # 2. Engagement (40%) - Basé sur l'engagement moyen par post
    df_period['engagement_total'] = df_period['like_count'] + df_period['comments_count'] + df_period['share_count']
    engagement_metric = df_period.groupby('media')['engagement_total'].mean()

    # --- MODIFICATION ---
    # 3. Régularité (20%) - Basé sur le nombre de posts par semaine (sur 23 jours)
    posts_par_semaine = grouped.size() / (SIMULATION_DAYS / 7.0) # Nb total posts / (3.28 semaines)
    regularity_metric = posts_par_semaine
    # --- FIN MODIFICATION ---

    # 4. Diversité Thématique (10%) - Basé sur le nombre de thèmes couverts
    # On utilise 'theme' (créé par predict.py)
    diversity_metric = grouped['theme'].nunique()

    # Créer un DataFrame avec les métriques brutes
    stats_df = pd.DataFrame({
        'audience_raw': audience_metric,
        'engagement_raw': engagement_metric,
        'regularity_raw': regularity_metric,
        'diversity_raw': diversity_metric
    })

    # Normaliser les métriques (de 0 à 1)
    stats_df['audience_norm'] = normalize(stats_df['audience_raw'])
    stats_df['engagement_norm'] = normalize(stats_df['engagement_raw'])
    stats_df['regularity_norm'] = normalize(stats_df['regularity_raw'])
    stats_df['diversity_norm'] = stats_df['diversity_raw'] / 7 # 7 thèmes max

    # Calculer les scores pondérés
    stats_df['audience_score'] = stats_df['audience_norm'] * WEIGHT_AUDIENCE * 100
    stats_df['engagement_score'] = stats_df['engagement_norm'] * WEIGHT_ENGAGEMENT * 100
    stats_df['regularity_score'] = stats_df['regularity_norm'] * WEIGHT_REGULARITY * 100
    stats_df['diversity_score'] = stats_df['diversity_norm'] * WEIGHT_DIVERSITY * 100

    # Score Final
    stats_df['score_influence_total'] = (
        stats_df['audience_score'] +
        stats_df['engagement_score'] +
        stats_df['regularity_score'] +
        stats_df['diversity_score']
    )
    
    # --- MODIFICATION ---
    # Trier et formater pour le JSON
    # 'media' est déjà l'index, on le remet en colonne
    stats_df = stats_df.sort_values(by='score_influence_total', ascending=False).reset_index()
    # --- FIN MODIFICATION ---
    
    output_data = stats_df.to_dict(orient='records')

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=4, ensure_ascii=False)
        
    print(f"\n--- Étape 2 (influence) Terminée ---")
    print(f"Classement d'influence sauvegardé dans {OUTPUT_FILE}")
    print("\nAperçu du classement final :")
    print(stats_df[['media', 'score_influence_total', 'audience_score', 'engagement_score']].head())

if __name__ == "__main__":
    calculate_scores()