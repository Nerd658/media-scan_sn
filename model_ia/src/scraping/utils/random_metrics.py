import random

def generate_post_metrics():
    """
    Génère des valeurs réalistes pour les likes, commentaires et partages.
    """
    return {
        "likes": random.randint(20, 600),        # entre 20 et 600 likes
        "comments": random.randint(0, 150),      # entre 0 et 150 commentaires
        "shares": random.randint(0, 80)          # entre 0 et 80 partages
    }
