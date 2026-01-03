from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class HourlyData(BaseModel):
    """Hourly weather data."""
    time: List[str]
    temperature_2m: List[float]
    relative_humidity_2m: List[int]
    weather_code: List[int]
    wind_speed_10m: List[float]


class DailyData(BaseModel):
    """Daily weather data."""
    time: List[str]
    weather_code: List[int]
    temperature_2m_max: List[float]
    temperature_2m_min: List[float]
    precipitation_sum: List[float]
    wind_speed_10m_max: List[float]


class WeatherResponse(BaseModel):
    """Weather response model."""
    latitude: float
    longitude: float
    timezone: str
    current_time: str
    hourly: HourlyData
    daily: DailyData
    
    class Config:
        json_schema_extra = {
            "example": {
                "latitude": 21.03,
                "longitude": 105.78,
                "timezone": "Asia/Ho_Chi_Minh",
                "current_time": "2024-01-04T10:30:00",
                "hourly": {
                    "time": ["2024-01-04T00:00", "2024-01-04T01:00"],
                    "temperature_2m": [20.5, 19.8],
                    "relative_humidity_2m": [65, 70],
                    "weather_code": [0, 1],
                    "wind_speed_10m": [5.2, 4.8]
                },
                "daily": {
                    "time": ["2024-01-04"],
                    "weather_code": [1],
                    "temperature_2m_max": [28.5],
                    "temperature_2m_min": [18.2],
                    "precipitation_sum": [0.0],
                    "wind_speed_10m_max": [12.5]
                }
            }
        }


class LocationRequest(BaseModel):
    """Location request model."""
    city: str = Field(..., description="City name")
    latitude: Optional[float] = Field(None, description="Latitude coordinate")
    longitude: Optional[float] = Field(None, description="Longitude coordinate")


class CurrentWeatherResponse(BaseModel):
    """Current weather response."""
    city: str
    temperature: float
    weather_code: int
    humidity: int
    wind_speed: float
    description: str
    updated_at: datetime
    
    class Config:
        json_schema_extra = {
            "example": {
                "city": "Hanoi",
                "temperature": 22.5,
                "weather_code": 1,
                "humidity": 65,
                "wind_speed": 5.2,
                "description": "Mostly Cloudy",
                "updated_at": "2024-01-04T10:30:00"
            }
        }


class ForecastResponse(BaseModel):
    """Forecast response model."""
    city: str
    forecasts: List[dict]
    
    class Config:
        json_schema_extra = {
            "example": {
                "city": "Hanoi",
                "forecasts": [
                    {
                        "date": "2024-01-04",
                        "max_temp": 28.5,
                        "min_temp": 18.2,
                        "weather_code": 1,
                        "description": "Mostly Cloudy",
                        "precipitation": 0.0
                    }
                ]
            }
        }


class ErrorResponse(BaseModel):
    """Error response model."""
    detail: str
    error_code: Optional[str] = None
