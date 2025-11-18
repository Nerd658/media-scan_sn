import pandas as pd
import numpy as np
import random

# --- CONFIGURATION ---
INPUT_FILE = 'data/facebook/facebook_posts_annotated.csv' 
OUTPUT_FILE = 'data/facebook/facebook_posts_final.csv'
SIMULATION_DAYS = 23 


MEDIA_FOLLOWERS = {
    "Burkina24": 1800000,           
    "Libre Info": 256000,         
    "BF1 TV": 1700000,          
    "RTB": 2600000,             
    "AIB": 191000,                   
    "Minute.bf": 354000,             
    "Parlons de Tout": 1600000,       
    "Radars Info Burkina": 212000,  
    "Sidwaya": 207000                
}

def simulate_missing_data():
    """
    Lit le CSV annoté, simule les DATES DE POST manquantes (sur 23 JOURS),
    ajoute les VRAIS followers_count, et simule l'engagement basé sur ces chiffres.
    """
    print(f"Chargement de ton fichier annoté : {INPUT_FILE}...")
    try:
        df = pd.read_csv(INPUT_FILE)
    except FileNotFoundError:
        print(f"Erreur : Fichier {INPUT_FILE} non trouvé. Es-tu sûr du chemin ?")
        return

    # --- 2. Simulation de `post_date` (sur 23 jours) ---
    print(f"Simulation des dates de publication sur {SIMULATION_DAYS} jours...")
    today = pd.Timestamp.now()
    start_date = today - pd.Timedelta(days=SIMULATION_DAYS)
    n_posts = len(df)
    
    time_deltas_days = np.random.beta(a=2, b=1, size=n_posts) * SIMULATION_DAYS
    random_dates = start_date + pd.to_timedelta(time_deltas_days, unit='D')
    random_times = pd.to_timedelta(np.random.randint(0, 24*60*60, size=n_posts), unit='s')
    df['post_date'] = random_dates + random_times
    print(f"Dates de post simulées avec succès (entre {start_date.date()} et {today.date()}).")

    # --- 3. MODIFIÉ : Application des `followers_count` RÉELS ---
    print("Application des 'followers_count' réels depuis le dictionnaire...")
    
    # .map va chercher le nom de la 'page' dans le dictionnaire MEDIA_FOLLOWERS
    df['followers_count'] = df['page'].map(MEDIA_FOLLOWERS)

    # Sécurité: Si un média de ton CSV n'est pas dans le dict (faute de frappe?), 
    # on met 10000 par défaut pour éviter un crash.
    df['followers_count'] = df['followers_count'].fillna(10000).astype(int)

    # Vérification
    if (df['followers_count'] == 10000).any() or (df['followers_count'] == 0).any():
        print("\n!!! ATTENTION !!!")
        print("Certains médias n'ont pas été trouvés dans le dictionnaire MEDIA_FOLLOWERS ou sont à 0.")
        print("Vérifie que les noms dans ton CSV correspondent PARFAITEMENT aux clés du dictionnaire.")
        print("Médias non trouvés ou à 0 :")
        print(df[df['followers_count'].isin([0, 10000])]['page'].unique())
        print("-------------------\n")

    # --- 4. Simulation de l'engagement (MAINTENANT RÉALISTE) ---
    print("Simulation de l'engagement (basée sur les VRAIS followers)...")
    
    # Cette simulation est maintenant bien meilleure car elle est
    # proportionnelle aux VRAIS followers !
    df['mean_engagement_rate'] = df['followers_count'].apply(lambda x: np.random.uniform(0.001, 0.01) * x)
    sigma = 1.5 
    df['engagement_total'] = df['mean_engagement_rate'].apply(
        lambda mu: max(1, np.random.lognormal(mean=np.log(mu + 1e-6), sigma=sigma))
    ).astype(int)

    df['like_count'] = (df['engagement_total'] * np.random.uniform(0.6, 0.8)).astype(int)
    df['comments_count'] = (df['engagement_total'] * np.random.uniform(0.1, 0.2)).astype(int)
    df['share_count'] = (df['engagement_total'] - df['like_count'] - df['comments_count']).astype(int)
    df['share_count'] = df['share_count'].clip(lower=0)
    
    df = df.drop(columns=['mean_engagement_rate', 'engagement_total'])
    print("Engagement simulé avec succès.")

    # --- 5. Nettoyage & Renommage (Format final) ---
    print("Renommage des colonnes pour correspondre au format de sortie...")
    
    df = df.rename(columns={
        'page': 'media',
        'post_link': 'url',
        'content': 'contenu',
        'category': 'categorie' 
    })
    
    df = df.sort_values(by='post_date', ascending=False)
    
    final_columns = [
        'id', 'media', 'contenu', 'post_date', 'url', 
        'like_count', 'share_count', 'comments_count', 
        'followers_count', 'categorie', 'category_score', 'scraped_at'
    ]
    
    columns_to_keep = [col for col in final_columns if col in df.columns]
    df_final = df[columns_to_keep]

    print("\n--- Simulation terminée. Aperçu des données finales : ---")
    print(df_final[['media', 'post_date', 'like_count', 'followers_count']].head())

    df_final.to_csv(OUTPUT_FILE, index=False, encoding='utf-8-sig')
    print(f"\nFichier final sauvegardé : {OUTPUT_FILE}")
    print("C'est ce fichier que nous utiliserons pour tous les modules suivants.")

if __name__ == "__main__":
    simulate_missing_data()