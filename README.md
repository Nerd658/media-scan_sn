# Media-Scan Application

## Description
Le projet Media-Scan est une application complète conçue pour l'analyse et le monitoring des médias. Il offre une interface utilisateur intuitive pour visualiser les scores d'influence des médias, les alertes de contenu, les tendances de publication, et des informations détaillées sur chaque média. L'application est structurée en deux parties principales : un frontend React pour l'interface utilisateur et un backend FastAPI pour la logique métier et la gestion des données.
<img width="1796" height="987" alt="image" src="https://github.com/user-attachments/assets/c175dc9f-5e92-4152-bd77-785308d395da" />

## Fonctionnalités Clés
*   **Authentification Utilisateur :** Inscription et connexion sécurisées.
*   <img width="1796" height="987" alt="image" src="https://github.com/user-attachments/assets/bb73c12c-523e-4c37-851a-e727fd0c4a85" />

*   **Tableau de Bord (Dashboard) :** Vue d'ensemble des statistiques clés, distribution des thèmes.
*   
*   **Tous les Médias :** Liste complète des médias avec leurs scores d'influence.
*   <img width="1600" height="858" alt="image" src="https://github.com/user-attachments/assets/6e3edbd2-25f3-4d85-8b04-f76fb7a0ebe1" />

*   **Alertes :** Notifications sur les pics d'engagement, l'inactivité et le contenu sensible/toxique.
*   <img width="1600" height="858" alt="image" src="https://github.com/user-attachments/assets/0e8b728a-966b-4318-b60d-60a9a901949b" />

<img width="1600" height="858" alt="image" src="https://github.com/user-attachments/assets/8d0c22c3-5c14-4c99-848c-74d3a5fb0155" />



*   **Historique (Tendances) :** Graphiques montrant l'évolution des publications par média.
*   <img width="1600" height="858" alt="image" src="https://github.com/user-attachments/assets/78ae65f8-a9ac-4c36-a5e4-709e55df8f79" />

*   **Détails des Médias :** Informations approfondies sur chaque média (scores, thèmes).
*   <img width="1600" height="858" alt="image" src="https://github.com/user-attachments/assets/ce2116a6-eda3-426a-8b61-3e75de885214" />

*   
*   **Comparaison de Médias :** Outil pour comparer les performances de plusieurs médias.
*   <img width="1600" height="858" alt="image" src="https://github.com/user-attachments/assets/88e1765e-4e3f-4034-82e1-f01de6d5f510" />

*   
*   **Gestion des Sources :** Liste des sources de médias surveillées.
*   <img width="1600" height="858" alt="image" src="https://github.com/user-attachments/assets/a0a8dc27-cac4-428c-91c2-9ef0843b52d3" />
*   **Gestion des contenus toxique **
*   contenu toxique
<img width="1600" height="858" alt="image" src="https://github.com/user-attachments/assets/a6ddbc52-bcb1-4cf1-b51a-ce65279cc051" />
contenue sensible
<img width="1600" height="858" alt="image" src="https://github.com/user-attachments/assets/bb1d2c7e-64ce-49f4-b763-f1ea803dadfe" />



 


## Architecture
L'application Media-Scan suit une architecture client-serveur avec une séparation claire des responsabilités :

*   **Frontend (Client) :** Développé avec React, il fournit l'interface utilisateur et communique avec le backend via des appels API.
*   **Backend (Serveur) :** Construit avec FastAPI (Python), il expose une API RESTful pour gérer l'authentification des utilisateurs et servir les données d'analyse des médias.
*   **Base de Données d'Authentification :** SQLite est utilisé pour stocker les informations des utilisateurs (email, mot de passe haché).
*   **Base de Données de Données :** MongoDB est utilisé pour stocker toutes les données d'analyse des médias (scores, alertes, tendances, thèmes).

## Démarrage Rapide

Pour faire fonctionner l'application, vous devez configurer et lancer le backend, puis le frontend.

### Prérequis Généraux
*   **Python 3.9+**
*   **Node.js et npm** (ou Yarn)
*   **Accès à un cluster MongoDB** (par exemple, un compte gratuit sur MongoDB Atlas)
*   **Git**

### 1. Configuration et Lancement du Backend
Le backend gère l'authentification et sert toutes les données à l'application frontend.

*   **Instructions Détaillées :** Veuillez consulter le fichier `backend/README.md` pour toutes les étapes de configuration, d'installation des dépendances, de configuration des variables d'environnement et de lancement du serveur backend.

### 2. Configuration et Lancement du Frontend
Le frontend est l'interface utilisateur de l'application.

*   **Instructions Détaillées :** Veuillez consulter le fichier `frontend/media-scan/README.md` pour toutes les étapes de configuration, d'installation des dépendances et de lancement du serveur de développement frontend.

### Ordre de Lancement
1.  **Lancez le Backend en premier.**
2.  **Lancez le Frontend ensuite.**

Une fois les deux serveurs en cours d'exécution, l'application frontend sera accessible via votre navigateur (généralement sur `http://localhost:5173`).

## Technologies Principales Utilisées
*   **Frontend :** React, Vite, Tailwind CSS, React Router DOM, Recharts.
*   **Backend :** FastAPI, Uvicorn, SQLAlchemy (pour SQLite), Motor (pour MongoDB), Pydantic, python-jose.
*   **Bases de Données :** SQLite, MongoDB.
