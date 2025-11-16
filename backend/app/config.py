from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    mongo_connection_string: str
    nlp_api_url: str = "http://ADRESSE_API_IA_DE_TES_COLLEGUES"

    class Config:
        env_file = ".env"

settings = Settings()
