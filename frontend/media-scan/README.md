# Application Frontend Media-Scan

## Description
Ceci est l'application frontend pour le projet Media-Scan, construite avec React. Elle fournit une interface utilisateur pour l'authentification (connexion et inscription), un tableau de bord, et diverses autres fonctionnalités pour l'analyse et le monitoring des médias.

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

*   `public/`: Assets statiques.
*   `src/`: Code source principal de l'application.
    *   `assets/`: Images et autres assets.
    *   `components/`: Composants UI réutilisables (par exemple, `Layout`, `Sidebar`, `ProtectedRoute`).
        *   `charts/`: Composants spécifiques aux graphiques.
    *   `context/`: Fournisseurs de contexte React (par exemple, `AuthContext`, `ThemeContext`).
    *   `data/`: Données mock ou données statiques.
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
L'application utilise un flux d'authentification basé sur JWT :
*   **`AuthContext.jsx`**: Gère l'état d'authentification de l'utilisateur, y compris la connexion, l'inscription, la déconnexion et le stockage du token dans `localStorage`. Il gère également la récupération des détails de l'utilisateur (`/api/v1/auth/me`) au chargement de l'application.
*   **`LoginPage.jsx`**: Fournit l'interface utilisateur pour se connecter. Il interagit avec la fonction `login` de `AuthContext`.
*   **`RegisterPage.jsx`**: Fournit l'interface utilisateur pour créer un nouveau compte. Il interagit avec la fonction `register` de `AuthContext`.
*   **`ProtectedRoute.jsx`**: S'assure que seuls les utilisateurs authentifiés peuvent accéder à certaines routes.

## Style
L'application est stylisée à l'aide de [Tailwind CSS](https://tailwindcss.com/), un framework CSS utilitaire. Cela permet un développement rapide de l'interface utilisateur directement au sein des composants JSX.

## Intégration API
Le frontend communique avec une API backend. Les requêtes API sont effectuées à l'aide de l'API `fetch` native.
*   **Configuration du Proxy**: `vite.config.js` est configuré pour proxifier les requêtes commençant par `/api/v1` vers le serveur backend (par exemple, `http://127.0.0.1:8000`). Ceci est crucial pour le développement afin d'éviter les problèmes de CORS.

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
1.  **Naviguez vers le répertoire frontend :**
    ```bash
    cd frontend/media-scan
    ```
2.  **Installez les dépendances :**
    ```bash
    npm install
    ```
3.  **Assurez-vous que le Backend est en cours d'exécution :** Assurez-vous que votre serveur backend est en cours d'exécution (par exemple, sur `http://127.0.0.1:8000`).
4.  **Démarrez le serveur de développement :**
    ```bash
    npm run dev
    ```
    L'application s'ouvrira dans votre navigateur à l'adresse `http://localhost:5173`.

---

# Utilisation des Données Mock (src/data)

Ce répertoire contient des fichiers de données mock (fausses données) qui sont utilisés par l'application frontend pour le développement et les tests. Ces données simulent les réponses que l'application recevrait normalement d'une API backend.

## Fichiers de Données Mock et Leur Utilisation

Voici une description des fichiers de données mock présents dans ce répertoire et leur rôle probable :

*   **`alerts.js`**: Contient des données simulant des alertes ou des notifications. Utilisé pour afficher des listes d'alertes dans l'interface utilisateur.
    ```javascript
    export const alerts = [
      {
        id: "alert1",
        type: "Toxicité Élevée",
        message: "Contenu avec un score de toxicité anormalement élevé détecté.",
        media: "Le Pays",
        date: "2025-11-16T14:30:00Z",
        severity: "Haute",
        details: "L'article 'Titre de l'article toxique' contient des propos haineux.",
      },
      // ... autres alertes
    ];
    ```
*   **`allMedia.js`**: Représente une collection de toutes les entrées média disponibles. Peut être utilisé pour afficher une liste complète de médias.
*   **`history.js`**: Contient des données pour l'historique des actions ou des analyses effectuées. Utilisé pour peupler les tableaux d'historique.
*   **`mediaDetails.js`**: Fournit des données détaillées pour un média spécifique. Utilisé pour afficher les informations détaillées d'un média.
*   **`mockAnalyses.js`**: Simule les résultats d'analyses effectuées par l'IA (par exemple, sentiment, toxicité, etc.). Ces données peuvent être utilisées pour les graphiques et les affichages d'analyse.
*   **`sources.js`**: Contient des informations sur les sources de médias (par exemple, noms, URLs). Utilisé pour la gestion ou l'affichage des sources.
*   **`stats.js`**: Fournit des données statistiques globales ou agrégées. Utilisé pour les tableaux de bord et les graphiques de résumé.

## Comment ces Données Sont Utilisées

Ces fichiers sont généralement importés directement dans les composants React (pages ou composants) qui ont besoin de données. Par exemple, un composant de tableau de bord pourrait importer `stats.js` pour afficher des graphiques, ou une page d'historique pourrait importer `history.js`.

**Exemple d'utilisation (conceptuel) :**

```javascript
// Dans un composant React, par exemple Dashboard.jsx
import { statsData } from '../../data/stats'; // Supposons que stats.js exporte 'statsData'

function Dashboard() {
  // Utiliser statsData pour afficher des graphiques ou des indicateurs
  return (
    <div>
      <h1>Tableau de Bord</h1>
      <p>Statistiques : {statsData.totalRequests}</p>
      {/* ... */}
    </div>
  );
}
```

## Objectif

L'objectif principal de ces données mock est de permettre le développement et le test de l'interface utilisateur **indépendamment de la disponibilité du backend**. Cela signifie que les développeurs frontend peuvent travailler sur l'UI/UX sans attendre que l'API backend soit entièrement fonctionnelle ou sans avoir besoin d'une connexion active à la base de données.

Une fois le backend opérationnel, ces imports de données mock sont généralement remplacés par des appels à l'API backend réelle.