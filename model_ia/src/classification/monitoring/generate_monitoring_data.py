import pandas as pd
import json

# CHEMINS (Ils sont corrects)
INPUT_FILE = "data/facebook/facebook_posts_classified.csv"
OUTPUT_ALERTS = "output/monitoring_alerts.json"
OUTPUT_TRENDS = "output/monitoring_trends.json"
OUTPUT_THEMES = "output/monitoring_themes_distribution.json"

def generate_monitoring():
    """
    Génère les JSON pour les alertes, les tendances de publication 
    et la distribution des thèmes.
    (Version corrigée pour utiliser 'media' et 'url')
    """
    print(f"Chargement du fichier classifié : {INPUT_FILE}...")
    try:
        df = pd.read_csv(INPUT_FILE)
    except FileNotFoundError:
        print(f"Erreur : Fichier {INPUT_FILE} non trouvé.")
        print("Avez-vous lancé le script 'src/classification/model/predict.py' ?")
        return
        
    df['post_date'] = pd.to_datetime(df['post_date'], errors='coerce')
    df = df.dropna(subset=['post_date'])

    # --- 1. Alertes (Inactivité & Pics d'engagement) ---
    alerts = []
    today = pd.Timestamp.now()

    # Calculer la moyenne d'engagement par média
    df['engagement_total'] = df['like_count'] + df['comments_count'] + df['share_count']
    

    # On groupe par 'media'
    engagement_mean_by_media = df.groupby('media')['engagement_total'].mean()
    engagement_std_by_media = df.groupby('media')['engagement_total'].std()

    # Joindre pour avoir un seuil par post
    # On joint sur 'media'
    df = df.join(engagement_mean_by_media.rename('engagement_mean'), on='media')
    df = df.join(engagement_std_by_media.rename('engagement_std'), on='media')
    
    # Remplacer les NaN (pour les médias avec 1 seul post, l'écart-type std est NaN)
    df['engagement_std'] = df['engagement_std'].fillna(0)

    # Seuil de pic = Moyenne + 3 * Écart-type (classique)
    df['engagement_threshold'] = df['engagement_mean'] + (3 * df['engagement_std'])

    # Détection des pics
    pic_posts = df[df['engagement_total'] > df['engagement_threshold']]
    
    print(f"Détection de {len(pic_posts)} posts à engagement 'pic'...")
    for _, post in pic_posts.iterrows():
        alerts.append({
            'type': 'pic_engagement',
            'media': post['media'],
            'message': f"Pic d'engagement détecté sur un post ({int(post['engagement_total'])} réactions)",
            'post_link': post['url'], # On utilise 'url'
            'date': post['post_date']
        })

    # Détection d'inactivité
    # On groupe par 'media'
    last_post_date = df.groupby('media')['post_date'].max()
    
    print("Vérification de l'inactivité...")
    for media, last_date in last_post_date.items():
        # Calcule les jours depuis le dernier post JUSQU'À MAINTENANT
        days_inactive = (today - last_date).days
        
        # On alerte si plus de 7 jours (même si nos données sont sur 23j, 
        # une inactivité de 7j est une info pertinente)
        if days_inactive > 7:
            alerts.append({
                'type': 'inactivite',
                'media': media,
                'message': f"Aucune publication détectée depuis {days_inactive} jours.",
                'post_link': None,
                'date': today.isoformat()
            })

    # Sauvegarder les alertes
    # (On convertit les dates en string pour le JSON)
    for alert in alerts:
        if 'date' in alert and isinstance(alert['date'], pd.Timestamp):
            alert['date'] = alert['date'].isoformat()
            
    with open(OUTPUT_ALERTS, 'w', encoding='utf-8') as f:
        json.dump(alerts, f, indent=4, ensure_ascii=False)
    print(f"-> {len(alerts)} alertes générées dans {OUTPUT_ALERTS}")

    # --- 2. Tendances de Publication (pour graphiques) ---
    print("Génération des tendances de publication...")
    # --- CORRECTION ---
    # Agréger par jour et par 'media'
    trends = df.groupby([pd.Grouper(key='post_date', freq='D'), 'media']).size().reset_index(name='count')

    # Formater pour Plotly/Dash
    trends_data = {}
    # --- CORRECTION ---
    for media in trends['media'].unique():
        media_data = trends[trends['media'] == media]
        trends_data[media] = {
            'dates': media_data['post_date'].dt.strftime('%Y-%m-%d').tolist(),
            'counts': media_data['count'].tolist()
        }

    with open(OUTPUT_TRENDS, 'w', encoding='utf-8') as f:
        json.dump(trends_data, f, indent=4, ensure_ascii=False)
    print(f"-> Données de tendance (par jour) sauvegardées dans {OUTPUT_TRENDS}")

    # --- 3. Distribution des Thèmes (pour graphiques camembert) ---
    print("Génération de la distribution des thèmes...")
    # Global
    global_themes = df['theme'].value_counts().reset_index()
    global_themes.columns = ['theme', 'count']

    # --- CORRECTION ---
    # Par 'media'
    themes_by_media = df.groupby('media')['theme'].value_counts().unstack(fill_value=0).to_dict(orient='index')

    themes_output = {
        'global': global_themes.to_dict(orient='records'),
        'by_media': themes_by_media
    }

    with open(OUTPUT_THEMES, 'w', encoding='utf-8') as f:
        json.dump(themes_output, f, indent=4, ensure_ascii=False)
    print(f"-> Données de distribution des thèmes sauvegardées dans {OUTPUT_THEMES}")
    
    print("\n--- Module 4 (Monitoring) Terminé ---")

if __name__ == "__main__":
    generate_monitoring()