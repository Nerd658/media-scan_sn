from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    sqlite_database_url: str
    mongo_connection_string: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int

    class Config:
        env_file = ".env"

settings = Settings()
