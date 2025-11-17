from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    postgres_connection_string: str = "postgresql+asyncpg://mediascan_user:bik123san@localhost:5432/mediascan_db"
    secret_key: str = "your-super-secret-key"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    nlp_api_url: str = "http://localhost:8001" # Placeholder for AI API URL

settings = Settings()
