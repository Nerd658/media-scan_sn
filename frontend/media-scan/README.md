# Media-Scan Frontend Application

## Description
Ceci est l'application frontend pour le projet Media-Scan, construite avec React. Elle fournit une interface utilisateur complète pour l'authentification, un tableau de bord interactif, et diverses fonctionnalités pour l'analyse et le monitoring des médias. Toutes les données affichées sont désormais dynamiquement récupérées via une API backend.

## Technologies Clés Utilisées
*   **Framework:** React 19
*   **Outil de Build:** Vite
*   **Styling:** Tailwind CSS
*   **Routage:** React Router DOM v6
*   **Gestion d'État:** React Context API (pour l'Authentification et le Thème)
*   **Icônes:** Heroicons
*   **Client HTTP:** API `fetch` native
*   **Graphiques:** Recharts (pour la visualisation des données)

## Aperçu de la Structure du Projet
Le projet suit une structure d'application React standard :

*   `public/`: Assets statiques. Contient le dossier `data/` avec les fichiers JSON originaux utilisés pour le seeding de la base de données MongoDB.
*   `src/`: Code source principal de l'application.
    *   `assets/`: Images et autres assets.
    *   `components/`: Composants UI réutilisables (par exemple, `Layout`, `Sidebar`, `ProtectedRoute`).
        *   `charts/`: Composants spécifiques aux graphiques.
    *   `context/`: Fournisseurs de contexte React (par exemple, `AuthContext`, `ThemeContext`).
    *   `data/`: Ce dossier contenait auparavant des données mock. Il contient maintenant principalement des fichiers de configuration ou des données statiques non liées à l'API.
    *   `pages/`: Composants de haut niveau représentant différentes vues/pages de l'application (par exemple, `LoginPage`, `Dashboard`).
    *   `services/`: (Actuellement vide, mais pourrait être utilisé pour des abstractions de services API).
    *   `index.css`: Styles CSS globaux (probablement des imports Tailwind).
    *   `main.jsx`: Point d'entrée de l'application, configure le routage et les fournisseurs de contexte.
*   **`.gitignore`**: Spécifie les fichiers et dossiers à ignorer par Git.
*   **`eslint.config.js`**: Configuration pour ESLint, l'outil d'analyse statique de code.
*   **`index.html`**: Le fichier HTML principal de l'application.
*   **`package-lock.json`**: Enregistre les versions exactes des dépendances installées.
*   **`package.json`**: Contient les métadonnées du projet et la liste des dépendances.
*   **`README.md`**: Ce fichier, fournissant un aperçu du projet.
*   **`tailwind.config.js`**: Configuration pour Tailwind CSS.
*   **`vite.config.js`**: Configuration pour Vite, l'outil de build.

## Flux d'Authentification
L'application utilise un flux d'authentification basé sur JWT et interagit avec le backend FastAPI :
*   **`AuthContext.jsx`**: Gère l'état d'authentification de l'utilisateur, y compris la connexion, l'inscription, la déconnexion et le stockage du token dans `localStorage`. Il gère également la récupération des détails de l'utilisateur (`/api/v1/users/me`) après connexion.
*   **`LoginPage.jsx`**: Fournit l'interface utilisateur pour se connecter. Il interagit avec la fonction `login` de `AuthContext`.
*   **`RegisterPage.jsx`**: Fournit l'interface utilisateur pour créer un nouveau compte. Il interagit avec la fonction `register` de `AuthContext`.
*   **`ProtectedRoute.jsx`**: S'assure que seules les routes protégées sont accessibles aux utilisateurs authentifiés.

## Style
L'application est stylisée à l'aide de [Tailwind CSS](https://tailwindcss.com/), un framework CSS utilitaire.

## Intégration API
Le frontend communique avec l'API backend Media-Scan, qui doit être en cours d'exécution sur `http://localhost:8000`. Toutes les requêtes de données sont effectuées à l'aide de l'API `fetch` native directement vers les endpoints du backend.

## Scripts Disponibles

Dans le répertoire du projet (`frontend/media-scan`), vous pouvez exécuter :

### `npm install`
Installe toutes les dépendances nécessaires pour l'application frontend.

### `npm run dev`
Lance l'application en mode développement.
Ouvrez [http://localhost:5173](http://localhost:5173) pour la visualiser dans le navigateur.
La page se rechargera si vous effectuez des modifications. Vous verrez également les erreurs de lint dans la console.

### `npm run build`
Construit l'application pour la production dans le dossier `dist`.
Il regroupe correctement React en mode production et optimise la construction pour les meilleures performances.

### `npm run lint`
Exécute ESLint pour vérifier la qualité du code et les problèmes de style.

### `npm run preview`
Sert la version de production localement pour la prévisualisation.

## Comment Exécuter le Projet
1.  **Assurez-vous que le Backend est en cours d'exécution :** Le serveur backend doit être lancé et accessible sur `http://localhost:8000`. Référez-vous au `README.md` du dossier `backend/` pour les instructions.
2.  **Naviguez vers le répertoire frontend :**
    ```bash
    cd frontend/media-scan
    ```
3.  **Installez les dépendances (si ce n'est pas déjà fait) :**
    ```bash
    npm install
    ```
4.  **Démarrez le serveur de développement :**
    ```bash
    npm run dev
    ```
    L'application s'ouvrira dans votre navigateur à l'adresse `http://localhost:5173`.

---
