# Media-Scan Application

## Description
Le projet Media-Scan est une application complète conçue pour l'analyse et le monitoring des médias. Il offre une interface utilisateur intuitive pour visualiser les scores d'influence des médias, les alertes de contenu, les tendances de publication, et des informations détaillées sur chaque média. L'application est structurée en deux parties principales : un frontend React pour l'interface utilisateur et un backend FastAPI pour la logique métier et la gestion des données.

## Fonctionnalités Clés
*   **Authentification Utilisateur :** Inscription et connexion sécurisées.
*   **Tableau de Bord (Dashboard) :** Vue d'ensemble des statistiques clés, distribution des thèmes.
*   **Tous les Médias :** Liste complète des médias avec leurs scores d'influence.
*   **Alertes :** Notifications sur les pics d'engagement, l'inactivité et le contenu sensible/toxique.
*   **Historique (Tendances) :** Graphiques montrant l'évolution des publications par média.
*   **Détails des Médias :** Informations approfondies sur chaque média (scores, thèmes).
*   **Comparaison de Médias :** Outil pour comparer les performances de plusieurs médias.
*   **Gestion des Sources :** Liste des sources de médias surveillées.

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
