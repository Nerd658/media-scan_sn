# Utilisation des Données Mock (src/data)

Ce répertoire contient des fichiers de données mock (fausses données) qui sont utilisés par l'application frontend pour le développement et les tests. Ces données simulent les réponses que l'application recevrait normalement d'une API backend.

## Fichiers de Données Mock et Leur Utilisation

Voici une description des fichiers de données mock présents dans ce répertoire et leur rôle probable :

*   **`alerts.js`**: Contient des données simulant des alertes ou des notifications. Utilisé pour afficher des listes d'alertes dans l'interface utilisateur.
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
