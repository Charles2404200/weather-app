import httpx
import logging
from typing import Optional, Dict, Any
from datetime import datetime
from app.core.config import settings
from app.utils.cache import cache

logger = logging.getLogger(__name__)


class WeatherService:
    """Service for fetching and processing weather data."""
    
    # WMO Weather Code interpretation
    WEATHER_CODES = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Foggy",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Slight snow",
        73: "Moderate snow",
        75: "Heavy snow",
        77: "Snow grains",
        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        85: "Slight snow showers",
        86: "Heavy snow showers",
        95: "Thunderstorm",
        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail",
    }
    
    @staticmethod
    def get_weather_description(code: int) -> str:
        """Get weather description from WMO code."""
        return WeatherService.WEATHER_CODES.get(code, "Unknown")
    
    @staticmethod
    async def get_weather_by_coordinates(
        latitude: float,
        longitude: float,
        timezone: str = "auto"
    ) -> Dict[str, Any]:
        """
        Fetch weather data from Open-Meteo API.
        
        Args:
            latitude: Latitude coordinate
            longitude: Longitude coordinate
            timezone: Timezone for the location
            
        Returns:
            Weather data dictionary
        """
        # Check cache first
        cache_key = f"weather_{latitude}_{longitude}"
        cached_data = cache.get(cache_key)
        if cached_data:
            logger.info(f"Cache hit for coordinates {latitude}, {longitude}")
            return cached_data
        
        try:
            async with httpx.AsyncClient() as client:
                url = f"{settings.WEATHER_API_BASE_URL}/forecast"
                params = {
                    "latitude": latitude,
                    "longitude": longitude,
                    "hourly": "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m",
                    "daily": "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max",
                    "timezone": timezone,
                }
                
                response = await client.get(url, params=params, timeout=10.0)
                response.raise_for_status()
                
                data = response.json()
                
                # Cache the result
                if settings.ENABLE_CACHE:
                    cache.set(cache_key, data, settings.CACHE_TTL_SECONDS)
                
                logger.info(f"Successfully fetched weather data for {latitude}, {longitude}")
                return data
                
        except httpx.HTTPError as e:
            logger.error(f"HTTP error while fetching weather: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error while fetching weather: {str(e)}")
            raise
    
    @staticmethod
    async def get_current_weather(
        latitude: float,
        longitude: float
    ) -> Dict[str, Any]:
        """
        Get current weather information.
        
        Args:
            latitude: Latitude coordinate
            longitude: Longitude coordinate
            
        Returns:
            Current weather data
        """
        data = await WeatherService.get_weather_by_coordinates(latitude, longitude)
        
        # Extract current hour data
        hourly = data.get("hourly", {})
        current_index = 0
        
        current_weather = {
            "temperature": hourly.get("temperature_2m", [0])[current_index],
            "weather_code": hourly.get("weather_code", [0])[current_index],
            "humidity": hourly.get("relative_humidity_2m", [0])[current_index],
            "wind_speed": hourly.get("wind_speed_10m", [0])[current_index],
            "description": WeatherService.get_weather_description(
                hourly.get("weather_code", [0])[current_index]
            ),
            "updated_at": datetime.now().isoformat()
        }
        
        return current_weather
    
    @staticmethod
    async def get_forecast(
        latitude: float,
        longitude: float,
        days: int = 7
    ) -> list:
        """
        Get weather forecast for upcoming days.
        
        Args:
            latitude: Latitude coordinate
            longitude: Longitude coordinate
            days: Number of days to forecast
            
        Returns:
            List of daily forecasts
        """
        data = await WeatherService.get_weather_by_coordinates(latitude, longitude)
        
        daily = data.get("daily", {})
        times = daily.get("time", [])
        forecasts = []
        
        for i in range(min(days, len(times))):
            forecast = {
                "date": times[i],
                "max_temp": daily.get("temperature_2m_max", [])[i],
                "min_temp": daily.get("temperature_2m_min", [])[i],
                "weather_code": daily.get("weather_code", [])[i],
                "description": WeatherService.get_weather_description(
                    daily.get("weather_code", [])[i]
                ),
                "precipitation": daily.get("precipitation_sum", [])[i],
                "wind_speed": daily.get("wind_speed_10m_max", [])[i],
            }
            forecasts.append(forecast)
        
        return forecasts
