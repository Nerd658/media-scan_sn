# Media-Scan Backend Application

## Description
Ceci est l'application backend pour le projet Media-Scan, construite avec FastAPI. Elle fournit les services d'authentification pour les utilisateurs (connexion et inscription) et sert de base pour d'éventuelles extensions futures liées à l'analyse et au monitoring des médias.

## Technologies Clés Utilisées
*   **Framework:** FastAPI
*   **Serveur ASGI:** Uvicorn
*   **Base de Données:** PostgreSQL
*   **ORM (Object-Relational Mapper):** SQLAlchemy (avec extension AsyncIO)
*   **Hachage de Mots de Passe:** `bcrypt`
*   **Tokens JWT:** `python-jose`
*   **Validation de Données/Paramètres:** Pydantic
*   **Gestion des Variables d'Environnement:** Pydantic-Settings
*   **Client HTTP Asynchrone:** `httpx` (actuellement non utilisé après nettoyage, mais utile pour les services externes)

## Aperçu de la Structure du Projet
Le projet backend est organisé de manière modulaire :

*   **`app/`**: Le répertoire principal du code source de l'application FastAPI.
    *   **`api/`**: Contient les définitions des routes (endpoints) de l'API.
        *   `auth.py`: Gère les routes d'authentification (inscription, connexion, informations utilisateur).
    *   **`core/`**: Contient les fonctionnalités de base et les utilitaires.
        *   `security.py`: Fonctions pour le hachage des mots de passe et la création/vérification des tokens JWT.
    *   **`db/`**: Gère la connexion à la base de données.
        *   `db.py`: Configuration de SQLAlchemy, moteur de base de données, session et gestion du cycle de vie (lifespan) pour la création des tables.
    *   **`models/`**: Définit les modèles de données SQLAlchemy qui correspondent aux tables de la base de données.
        *   `user.py`: Modèle SQLAlchemy pour la table `users`.
    *   **`schemas/`**: Définit les schémas de données Pydantic pour la validation des requêtes et des réponses de l'API.
        *   `user.py`: Schémas Pydantic pour les utilisateurs (création, en base de données, token).
    *   **`services/`**: Destiné à contenir des modules pour l'abstraction des appels à des services externes (par exemple, `ai_service.py` qui a été retiré selon la demande).
    *   **`config.py`**: Gère la configuration de l'application, charge les variables d'environnement.
    *   **`main.py`**: Le point d'entrée principal de l'application FastAPI, où l'application est initialisée et les routeurs API sont inclus.
*   **`venv/`**: Environnement virtuel Python pour isoler les dépendances du projet.
*   **`.env`**: Fichier pour stocker les variables d'environnement sensibles (chaîne de connexion à la base de données, clé secrète JWT).
*   **`requirements.txt`**: Liste des dépendances Python du projet.

## Flux d'Authentification en Profondeur

Le backend implémente un flux d'authentification basé sur les tokens JWT (JSON Web Tokens) et le standard OAuth2 (via `OAuth2PasswordBearer` de FastAPI).

1.  **Inscription (`POST /api/v1/auth/register`)**:
    *   Un utilisateur envoie son `email` et `password`.
    *   Le mot de passe est haché en utilisant `bcrypt` (avec troncature à 72 octets pour respecter les contraintes de l'algorithme).
    *   Un nouvel utilisateur est créé dans la table `users` de la base de données PostgreSQL.
    *   Retourne les informations de l'utilisateur enregistré (sans le mot de passe haché).

2.  **Connexion (`POST /api/v1/auth/login`)**:
    *   Un utilisateur envoie son `username` (qui est l'email) et `password` via un formulaire `OAuth2PasswordRequestForm`.
    *   Le backend vérifie l'email dans la base de données.
    *   Le mot de passe fourni est vérifié par rapport au mot de passe haché stocké en utilisant `bcrypt`.
    *   Si les identifiants sont corrects, un token JWT est créé avec l'email de l'utilisateur comme sujet et une date d'expiration.
    *   Retourne le `access_token` et le `token_type` ("bearer").

3.  **Informations Utilisateur (`GET /api/v1/auth/me`)**:
    *   Cette route est protégée et nécessite un token JWT valide dans l'en-tête `Authorization: Bearer <token>`.
    *   Le token est décodé et vérifié.
    *   L'email de l'utilisateur est extrait du token.
    *   Les informations de l'utilisateur sont récupérées de la base de données.
    *   Retourne les informations de l'utilisateur actuellement authentifié.

## Endpoints API

Tous les endpoints sont préfixés par `/api/v1`.

### Authentification (`/api/v1/auth`)
*   **`POST /api/v1/auth/register`**: Enregistre un nouvel utilisateur.
    *   **Requête:** `UserCreate` (email, password)
    *   **Réponse:** `UserInDB` (id, email)
    *   **Erreurs:** `400 Bad Request` si l'email est déjà enregistré.
*   **`POST /api/v1/auth/login`**: Connecte un utilisateur et retourne un token d'accès.
    *   **Requête:** `OAuth2PasswordRequestForm` (username=email, password)
    *   **Réponse:** `Token` (access_token, token_type)
    *   **Erreurs:** `401 Unauthorized` si les identifiants sont incorrects.
*   **`GET /api/v1/auth/me`**: Récupère les informations de l'utilisateur actuellement authentifié.
    *   **Requête:** Nécessite un en-tête `Authorization: Bearer <token>`
    *   **Réponse:** `UserInDB` (id, email)
    *   **Erreurs:** `401 Unauthorized` si le token est invalide ou manquant.

## Schéma de Base de Données

Le backend utilise une base de données PostgreSQL avec la table suivante :

### `users`
| Colonne         | Type      | Description                               |
| :-------------- | :-------- | :---------------------------------------- |
| `id`            | `SERIAL`  | Clé primaire, auto-incrémentée            |
| `email`         | `VARCHAR` | Adresse email de l'utilisateur, unique, indexée |
| `hashed_password` | `VARCHAR` | Mot de passe haché de l'utilisateur       |

## Comment Exécuter le Projet

### Prérequis
*   Python 3.9+
*   PostgreSQL en cours d'exécution et accessible.
*   Un environnement virtuel Python (recommandé).

### Étapes d'Installation et d'Exécution

1.  **Naviguez vers le répertoire backend :**
    ```bash
    cd backend
    ```
2.  **Créez et activez un environnement virtuel (si ce n'est pas déjà fait) :**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```
3.  **Installez les dépendances Python :**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Configurez les variables d'environnement :**
    Créez un fichier `.env` à la racine du répertoire `backend` avec les informations suivantes.
    *   **`POSTGRES_CONNECTION_STRING`**: La chaîne de connexion à votre base de données PostgreSQL.
        *   Exemple : `postgresql+asyncpg://user:password@localhost:5432/your_database_name`
    *   **`SECRET_KEY`**: Une clé secrète forte et aléatoire utilisée pour signer les tokens JWT.
        *   Exemple : `SECRET_KEY="votre_super_cle_secrete_aleatoire_et_longue"`
        *   Vous pouvez générer une clé avec `python -c "import secrets; print(secrets.token_urlsafe(32))"`

    Exemple de fichier `.env` :
    ```
    POSTGRES_CONNECTION_STRING="postgresql+asyncpg://mediascan_user:bik123san@localhost:5432/mediascan_db"
    SECRET_KEY="votre_super_cle_secrete_aleatoire_et_longue"
    ```
5.  **Démarrez le serveur Uvicorn :**
    ```bash
    uvicorn app.main:app --reload
    ```
    Le serveur sera accessible à `http://127.0.0.1:8000`.

### Documentation Interactive de l'API
Une fois le serveur en cours d'exécution, vous pouvez accéder à la documentation interactive de l'API (Swagger UI) à l'adresse :
[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

Ceci vous permettra de tester les endpoints d'authentification directement depuis votre navigateur.
