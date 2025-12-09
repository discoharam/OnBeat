import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "OnBeat API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Paths (Windows/Linux safe)
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    MEDIA_DIR: str = os.path.join(BASE_DIR, "media")
    DB_URL: str = "sqlite:///./onbeat.db"

    class Config:
        case_sensitive = True

settings = Settings()
# Ensure media dir exists
os.makedirs(settings.MEDIA_DIR, exist_ok=True)
