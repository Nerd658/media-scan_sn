import pandas as pd
import random

# CHEMINS
INPUT_FILE = 'data/facebook/facebook_posts_final.csv' 
OUTPUT_FILE = 'data/facebook/simulated_comments.csv'

# --- BANQUE DE COMMENTAIRES (Celle que tu as complétée) ---
COMMENTS_BANK = {
    'normal': [
        # --- Total: 41 ---
        "Merci pour l'info", "Intéressant.", "Je suis d'accord.", "Bonne continuation",
        "Vraiment ?", "Du courage", "Paix au Burkina Faso", "On espère que ça va aller",
        "Que Dieu bénisse le Burkina Faso", "Merci, force à vous", "Merci pour l'effort d'information",
        "Bonne nouvelle", "Triste nouvelle", "C'est compliqué", "Il faut prier",
        "OK merci", "Bien dit", "C'est la vérité", "Force à nos FDS", "Vraiment triste",
        "Félicitations", "Source ?", "Important à savoir", "Paix à son âme",
        "Information bien reçue", "Nous suivons de près", "Prompt rétablissement",
        "Merci pour le partage", "C'est noté", "On attend la suite", "Que Dieu nous aide",
        "Très bonne analyse.", "Exactement.", "On est fatigué.", "Rien à ajouter.",
        "C'est clair.", "Le peuple souffre.", "On veut la paix.", "Merci pour la précision.",
        "Dieu est grand.",
        # --- Tes ajouts ---
        "Merci beaucoup pour l'information.", "Vraiment ? C'est une bonne nouvelle.",
        "Du courage à nos FDS.", "Que Dieu protège le Faso.", "Je suis de tout cœur avec vous.",
        "Analyse très pertinente.", "C'est exactement ça le problème.", "Prompt rétablissement au blessé.",
        "On suit la situation de près.", "Félicitations à lui/elle.", "On attend de voir la suite.",
        "Il faut que les gens comprennent.", "C'est une triste réalité.", "Merci pour cet éclaircissement.",
        "Je ne savais pas, merci.", "Bravo pour votre travail.", "Enfin une bonne nouvelle !",
        "Que la paix revienne.", "Force et courage.", "C'est la vie.", "On prie pour le pays.",
        "Information reçue 5/5."
    ],
    'toxic': [
        # --- Total: 22 ---
        "N'importe quoi ! Vous mentez !", "Journaliste corrompu", "Fermez la bouche",
        "C'est un idiot", "Vous êtes nuls", "Quel pays de merde", "Propagande",
        "On en a marre de vos mensonges", "Menteurs !", "Vous racontez des bêtises",
        "Gouvernement de merde", "Arrêtez de nous distraire", "Quelle honte",
        "Vous ne servez à rien", "Imbécile", "Foutaise", "Du n'importe quoi",
        "Bande d'incompétents.", "Vous êtes payés pour mentir.", "Allez vous faire voir.",
        "Quelle nullité.", "Journaliste de pacotille.",
        # --- Tes ajouts ---
        "Vous êtes tous des vendus !", "Encore un article pour endormir le peuple.",
        "Quelle incompétence.", "Ce journaliste est un plaisantin.", "Arrêtez vos bêtises.",
        "On s'en fout de votre avis.", "Journaliste alimentaire.", "Vous ne vérifiez jamais vos sources ?",
        "Toujours les mêmes mensonges.", "Vous n'avez honte ?", "Incapable !",
        "C'est de la merde.", "Ce pays est foutu.", "On vous observe, bande de vauriens.",
        "Propagande de bas étage.", "Zéro crédibilité."
    ],
    'hateful': [
        # --- Total: 18 ---
        "On doit les chasser", "Mort à ces gens", "C'est à cause de [ethnie] tout ça",
        "Il faut les brûler", "Sale race", "Les [groupe] dehors", "C'est un [insulte ethnique]",
        "Il faut les tuer", "On ne veut pas de vous ici", "Retournez chez vous",
        "Ces gens sont le problème", "Haine à ce groupe", "Punition pour eux",
        "Eux tous, il faut les dégager.", "Le problème, ce sont les [groupe].",
        "On ne veut pas de ces [insulte].", "Qu'ils partent !", "À bas les [groupe].",
        # --- Tes ajouts ---
        "C'est toujours les [groupe] qui posent problème.", "On ne veut plus de ces gens-là.",
        "Il faut les chasser du pays.", "Ils ne sont pas de vrais Burkinabè.",
        "Qu'ils retournent d'où ils viennent.", "Ce sont des traîtres.", "On sait qui sont les complices.",
        "Méfiez-vous des [groupe], ce sont des serpents.", "Ils méritent ce qui leur arrive.",
        "Il faut leur régler leur compte.", "Pas de pitié pour les [groupe]."
    ],
    'misinfo': [
        # --- Total: 18 ---
        "Mon oncle a dit que c'est faux", "Le vaccin tue les gens", "La terre est plate",
        "C'est un complot du gouvernement", "Fake news", "Arrêtez d'intoxiquer le peuple",
        "Ce n'est pas vrai", "Information non vérifiée", "C'est un montage",
        "On nous cache la vérité", "C'est l'Occident qui est derrière tout ça",
        "Source : tonton", "Propagande occidentale",
        "Tout est orchestré par [pays].", "Mon ami qui est militaire a dit le contraire.",
        "Ouvrez les yeux, c'est un complot.", "La vidéo est un deepfake.",
        "Ils mentent sur les chiffres.",
        # --- Tes ajouts ---
        "C'est faux ! Mon cousin qui est là-bas a dit le contraire.", "Encore une manipulation de [pays étranger].",
        "Ils nous cachent le vrai bilan.", "C'est un complot pour diviser le pays.",
        "N'écoutez pas, c'est pour vous faire peur.", "La vidéo est truquée, c'est visible.",
        "Ouvrez les yeux, on vous manipule.", "Ce n'est pas un vaccin, c'est du poison.",
        "Source : un ami bien placé au gouvernement.", "Partagez avant que ce soit supprimé !",
        "Ils préparent quelque chose de grave."
    ],
    'adult': [
        # --- Total: 12 ---
        "Regarde ses fesses", "Quelle belle [partie du corps]", "Envoie la vidéo stp",
        "Trop sexy", "Elle cherche quoi habillée comme ça", "Jolie forme",
        "C'est excitant", "Je veux son numéro", "Elle est bonne", "Vidéos X ?",
        "J'aime ce que je vois.", "Elle n'a pas froid aux yeux.",
        # --- Tes ajouts ---
        "Quelle est cette façon de s'habiller ?", "Elle est où la vidéo complète ?",
        "Très belle femme, je la veux.", "Elle cherche mari avec cette tenue ?",
        "J'aimerais être à la place du gars.", "Envoie ton 06 [numéro].",
        "Tu es trop fraîche bébé.", "Elle provoque, c'est tout.", "Montre plus !"
    ]
}


def simulate_comments():
    """
    Crée un CSV de commentaires simulés (80% normaux, 20% sensibles)
    en utilisant une banque de commentaires élargie.
    """
    print(f"Chargement des posts depuis {INPUT_FILE}...")
    try:
        df_posts = pd.read_csv(INPUT_FILE)
    except FileNotFoundError:
        print(f"Erreur : Fichier {INPUT_FILE} non trouvé.")
        print("Avez-vous bien lancé l'étape 0-A (simulate_realistic_metrics.py) ?")
        return

    n_sample = min(500, len(df_posts))
    posts_to_comment_on = df_posts.sample(n=n_sample)

    simulated_data = []
    comment_id = 0

    print(f"Génération de commentaires simulés pour {n_sample} posts...")
    
    # --- CORRECTION 1 ---
    # On change `_` en `index`. `index` sera le numéro de la ligne (ex: 452)
    # `post` sera la série contenant les données (media, contenu, etc.)
    for index, post in posts_to_comment_on.iterrows():
        
        num_comments = random.randint(1, 5)

        for _ in range(num_comments):
            if random.random() < 0.8:
                category = 'normal'
            else:
                category = random.choice(['toxic', 'hateful', 'misinfo', 'adult'])

            comment_text = random.choice(COMMENTS_BANK[category])

            simulated_data.append({
                'comment_id': comment_id,
                # --- CORRECTION 2 ---
                # On utilise `index` (le numéro de la ligne) comme post_id
                'post_id': index, 
                'media_page': post['media'], 
                'comment_text': comment_text,
                'true_category': category 
            })
            comment_id += 1

    df_comments = pd.DataFrame(simulated_data)

    df_comments.to_csv(OUTPUT_FILE, index=False, encoding='utf-8-sig')
    print(f"--- Étape 0-B Terminée ---")
    print(f"{len(df_comments)} commentaires simulés sauvegardés dans {OUTPUT_FILE}")
    print("Nous avons maintenant 'facebook_posts_final.csv' ET 'simulated_comments.csv'.")
    print("Prêt pour l'étape suivante : Entraîner le modèle (Module 2).")

if __name__ == "__main__":
    simulate_comments()