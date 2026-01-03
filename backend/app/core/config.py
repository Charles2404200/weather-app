import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings and configuration."""
    
    # API Configuration
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "Weather App API"
    PROJECT_VERSION: str = "1.0.0"
    
    # Server
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # CORS
    CORS_ORIGINS: list = ["*"]  # In production, specify allowed origins
    
    # Weather API
    WEATHER_API_KEY: str = os.getenv("WEATHER_API_KEY", "")
    WEATHER_API_BASE_URL: str = "https://api.open-meteo.com/v1"
    
    # Cache
    CACHE_TTL_SECONDS: int = 600  # 10 minutes
    ENABLE_CACHE: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
