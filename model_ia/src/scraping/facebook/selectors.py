# ==================================================================
# 🔹 Sélecteurs CSS/XPath pour les posts Facebook
# ==================================================================
POST_CONTENT = "div[data-ad-preview='message']"  # Texte du post
POST_DATE = "a[href*='posts'] abbr"              # Date affichée du post
POST_LINK = "a[href*='story'], a[href*='/posts/']"  # Lien direct du post

# Sélecteurs pour l'engagement
LIKE_COUNT = "div[aria-label*='like'], span[aria-label*='like']"   # Nombre de likes
SHARE_COUNT = "a[aria-label*='partager'], span[aria-label*='partager']"  # Nombre de partages
COMMENTS_COUNT = "a[aria-label*='commentaires'], span[aria-label*='commentaires']"  # Nombre total de commentaires

# Boutons utiles
SEE_MORE = "div[role='button'][tabindex='0']"  # Voir plus de contenu
