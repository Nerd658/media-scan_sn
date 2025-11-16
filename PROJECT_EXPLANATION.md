# Explication du Projet Media-Scan (Backend)

Ce document explique l'architecture, le fonctionnement et la manière de lancer le backend du projet Media-Scan.

## 1. Objectif du Projet

Le backend est une application développée en **Python** avec le framework **FastAPI**. Son rôle principal est de servir d'intermédiaire (ou de "proxy") entre une future interface utilisateur (frontend) et une API externe d'analyse de langage naturel (NLP).

Ses responsabilités sont :
-   Recevoir des requêtes de texte à analyser depuis le frontend.
-   Appeler une API externe (l'API "IA" de vos collègues) pour effectuer l'analyse.
-   Sauvegarder le résultat de chaque analyse (succès ou échec) dans une base de données **MongoDB**.
-   Fournir des endpoints pour consulter l'historique des analyses, vérifier l'état de l'API externe et obtenir des statistiques.

## 2. Structure du Projet

Le projet a été refactorisé pour être plus modulaire et maintenable. Voici la nouvelle structure dans le dossier `backend/` :

```
backend/
├── app/
│   ├── api/
│   │   ├── analysis.py       # Endpoint pour l'analyse de texte
│   │   ├── history.py        # Endpoint pour l'historique
│   │   ├── monitoring.py     # Endpoint pour le monitoring
│   │   └── stats.py          # Endpoint pour les statistiques
│   ├── db.py                 # Connexion à la base de données MongoDB
│   ├── main.py               # Point d'entrée principal de l'application
│   ├── models/
│   │   └── analysis.py       # Modèles de données Pydantic
│   ├── services/
│   │   ├── database_service.py # Logique d'interaction avec la BDD
│   │   └── nlp_service.py      # Logique d'appel à l'API NLP externe
│   └── config.py             # Gestion de la configuration (variables d'environnement)
├── .env                      # Fichier pour les variables d'environnement (secrets)
└── venv/                     # Environnement virtuel Python
```

### Description des composants :

-   **`app/main.py`** : C'est le cœur de l'application. Il initialise FastAPI et inclut les différents "routeurs" (groupes d'endpoints) définis dans le dossier `app/api/`.
-   **`app/api/`** : Chaque fichier dans ce dossier définit un groupe d'endpoints liés. Par exemple, `analysis.py` gère tout ce qui est lié à l'analyse de texte.
-   **`app/services/`** : Contient la logique métier.
    -   `nlp_service.py` est responsable de toute la communication avec l'API NLP externe.
    -   `database_service.py` gère les opérations sur la base de données (sauvegarder, lire).
-   **`app/models/`** : Définit la structure des données que l'API attend en entrée (`TexteAAnalyser`) et qu'elle renvoie en sortie, en utilisant Pydantic pour la validation.
-   **`app/db.py`** : Gère le cycle de vie de la connexion à la base de données MongoDB.
-   **`app/config.py`** : Charge les variables d'environnement (comme les clés d'API ou les chaînes de connexion) depuis le fichier `.env`.

## 3. Configuration

Le projet nécessite deux variables d'environnement pour fonctionner, à placer dans le fichier `backend/.env` :

1.  **`MONGO_CONNECTION_STRING`** : La chaîne de connexion complète pour votre base de données MongoDB Atlas.
    ```
    MONGO_CONNECTION_STRING="mongodb+srv://user:password@cluster.mongodb.net/..."
    ```
2.  **`NLP_API_URL`** : L'URL de base de l'API de vos collègues.
    ```
    NLP_API_URL="http://adresse-de-l-api-de-vos-collegues"
    ```

## 4. Lancement du Projet

Pour lancer le serveur backend, suivez ces étapes :

1.  **Activez l'environnement virtuel** (si ce n'est pas déjà fait) :
    ```bash
    source backend/venv/bin/activate
    ```
2.  **Placez-vous dans le dossier `backend`** :
    ```bash
    cd backend
    ```
3.  **Lancez le serveur avec Uvicorn** :
    ```bash
    uvicorn app.main:app --reload
    ```
    -   `app.main:app` indique à Uvicorn de trouver l'objet `app` dans le fichier `app/main.py`.
    -   `--reload` redémarre automatiquement le serveur à chaque modification du code.

Le serveur sera alors accessible à l'adresse `http://localhost:8000`.

## 5. Documentation de l'API pour le Frontend

Une fois le serveur lancé, la documentation de l'API est **automatiquement générée** et accessible via le navigateur. C'est la source de vérité pour l'équipe frontend.

-   **Interface Interactive (Swagger UI)** : [http://localhost:8000/docs](http://localhost:8000/docs)
    -   Permet de voir tous les endpoints, les données attendues et de les tester en direct.

-   **Documentation Alternative (ReDoc)** : [http://localhost:8000/redoc](http://localhost:8000/redoc)
    -   Offre une vue plus claire et plus lisible de la documentation.

-   **Fichier de Spécification (OpenAPI JSON)** : [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)
    -   Le fichier brut que les outils peuvent utiliser pour générer des clients API.
