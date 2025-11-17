# Media-Scan Backend

## Description
Ceci est l'application backend pour le projet Media-Scan. Construite avec FastAPI, elle a deux rôles principaux :
1.  **Fournir les services d'authentification** pour les utilisateurs (inscription, connexion) via une base de données **SQLite**.
2.  **Servir les données d'analyse des médias** (scores d'influence, alertes, tendances, etc.) depuis une base de données **MongoDB**.

L'API est conçue pour être consommée par le frontend React de Media-Scan.

## Technologies Clés
*   **Framework**: FastAPI
*   **Serveur ASGI**: Uvicorn
*   **Bases de Données**:
    *   **SQLite** pour l'authentification des utilisateurs (via SQLAlchemy).
    *   **MongoDB** pour les données de l'application (via Motor).
*   **ORM / ODM**: SQLAlchemy (AsyncIO) et Motor (AsyncIO).
*   **Validation de Données**: Pydantic.
*   **Authentification**: Tokens JWT (via `python-jose`) avec `OAuth2PasswordBearer`.
*   **Gestion de l'Environnement**: Pydantic-Settings.

## Structure du Projet
*   **`app/`**: Cœur de l'application FastAPI.
    *   **`api/`**: Contient les routeurs et les endpoints de l'API (`auth.py`, `dashboard.py`).
    *   **`core/`**: Fonctions de base comme la gestion des mots de passe et des tokens JWT (`security.py`).
    *   **`db.py`**: Configuration de la connexion à la base de données **SQLite** avec SQLAlchemy.
    *   **`mongodb.py`**: Configuration de la connexion à la base de données **MongoDB** avec Motor.
    *   **`models/`**: Modèles de tables SQLAlchemy (ex: `user.py`).
    *   **`schemas/`**: Schémas Pydantic pour la validation des données (`user.py`, `dashboard.py`).
    *   **`config.py`**: Chargement de la configuration depuis les variables d'environnement.
    *   **`main.py`**: Point d'entrée de l'application, initialise FastAPI et les connexions aux bases de données.
*   **`scripts/`**: Contient des scripts utilitaires.
    *   **`seed_db.py`**: Script pour peupler la base de données MongoDB à partir des fichiers JSON statiques.
*   **`venv/`**: Environnement virtuel Python.
*   **`.env`**: Fichier de configuration local (ignoré par Git).
*   **`.env.example`**: Fichier d'exemple pour la configuration.
*   **`requirements.txt`**: Dépendances Python du projet.

## Installation et Utilisation

### 1. Prérequis
*   Python 3.9+
*   Un accès à un cluster MongoDB (par exemple, un compte gratuit sur MongoDB Atlas).

### 2. Installation
a. **Clonez le projet** et naviguez dans le dossier du backend :
   ```bash
   cd backend
   ```

b. **Créez et activez un environnement virtuel** :
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   # Sur Windows, utilisez : venv\Scripts\activate
   ```

c. **Installez les dépendances** :
   ```bash
   pip install -r requirements.txt
   ```

d. **Configurez votre environnement** :
   Créez un fichier nommé `.env` à la racine du dossier `backend/` en vous basant sur le modèle `.env.example`.
   ```bash
   cp .env.example .env
   ```
   Ouvrez le fichier `.env` et **modifiez les valeurs suivantes** :
   *   `MONGO_CONNECTION_STRING`: Remplacez la valeur par votre propre chaîne de connexion MongoDB Atlas.
   *   `SECRET_KEY`: Remplacez la valeur par une nouvelle clé secrète. Vous pouvez en générer une avec la commande : `python -c "import secrets; print(secrets.token_urlsafe(32))"`

### 3. Remplissage de la Base de Données (Première Utilisation)
Avant de lancer le serveur, vous devez peupler la base de données MongoDB avec les données d'analyse.

**Important :** Exécutez cette commande depuis la **racine du projet Media-Scan** (le dossier qui contient `frontend/` et `backend/`), et non depuis le dossier `backend/`.
```bash
python backend/scripts/seed_db.py
```
Ce script va lire les fichiers JSON dans `frontend/media-scan/public/data/` et les insérer dans votre base de données MongoDB.

### 4. Lancement du Serveur
a. **Assurez-vous d'être dans le dossier `backend/`** et que votre environnement virtuel est activé.

b. **Lancez le serveur Uvicorn** :
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   *   Le serveur sera accessible à `http://localhost:8000`.
   *   La base de données d'authentification `media_scan_auth.db` sera automatiquement créée dans le dossier `backend/`.

c. **Créez votre premier compte utilisateur** :
   Comme la base de données d'authentification est nouvelle, vous devez vous créer un compte via la page "Register" du frontend.

## Endpoints de l'API

Une fois le serveur lancé, la documentation interactive (Swagger UI) est disponible à l'adresse [http://localhost:8000/docs](http://localhost:8000/docs).

### Authentification (`/api/v1`)
*   `POST /register`: Enregistre un nouvel utilisateur.
*   `POST /token`: Connecte un utilisateur et retourne un token JWT.
*   `GET /users/me`: Récupère les informations de l'utilisateur connecté.

### Dashboard (`/api/v1/dashboard`)
*   `GET /influence-ranking`: Retourne la liste des médias classés par score d'influence.
*   `GET /alerts`: Retourne une liste combinée des alertes de monitoring et de contenu sensible.
*   `GET /alerts/sensitive`: Retourne les alertes de contenu sensible, avec un filtre optionnel par catégorie (ex: `?category=toxic`).
*   `GET /trends`: Retourne les tendances de publication pour tous les médias.
*   `GET /themes`: Retourne la distribution globale et par média des thèmes.
*   `GET /media/{media_name}`: Retourne les informations détaillées pour un média spécifique.
*   `GET /media/compare`: Retourne les informations détaillées pour une liste de médias à comparer (ex: `?media_names=Media1&media_names=Media2`).