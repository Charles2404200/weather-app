from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.services.weather_service import WeatherService
from app.schemas.weather import (
    WeatherResponse,
    CurrentWeatherResponse,
    ForecastResponse,
    ErrorResponse
)

router = APIRouter(prefix="/weather", tags=["weather"])


@router.get("/current", response_model=CurrentWeatherResponse)
async def get_current_weather(
    latitude: float = Query(..., description="Latitude coordinate"),
    longitude: float = Query(..., description="Longitude coordinate"),
) -> CurrentWeatherResponse:
    """
    Get current weather information for a location.
    
    Example: /api/v1/weather/current?latitude=21.03&longitude=105.78
    """
    try:
        weather_data = await WeatherService.get_current_weather(latitude, longitude)
        
        return CurrentWeatherResponse(
            city=f"{latitude}, {longitude}",
            **weather_data
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch current weather: {str(e)}"
        )


@router.get("/forecast", response_model=ForecastResponse)
async def get_forecast(
    latitude: float = Query(..., description="Latitude coordinate"),
    longitude: float = Query(..., description="Longitude coordinate"),
    days: int = Query(7, ge=1, le=30, description="Number of days to forecast"),
) -> ForecastResponse:
    """
    Get weather forecast for a location.
    
    Example: /api/v1/weather/forecast?latitude=21.03&longitude=105.78&days=7
    """
    try:
        forecasts = await WeatherService.get_forecast(latitude, longitude, days)
        
        return ForecastResponse(
            city=f"{latitude}, {longitude}",
            forecasts=forecasts
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch forecast: {str(e)}"
        )


@router.get("/", response_model=WeatherResponse)
async def get_full_weather(
    latitude: float = Query(..., description="Latitude coordinate"),
    longitude: float = Query(..., description="Longitude coordinate"),
) -> WeatherResponse:
    """
    Get complete weather data including hourly and daily information.
    
    Example: /api/v1/weather?latitude=21.03&longitude=105.78
    """
    try:
        data = await WeatherService.get_weather_by_coordinates(latitude, longitude)
        return WeatherResponse(**data)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch weather data: {str(e)}"
        )


@router.get("/health", tags=["health"])
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "message": "Weather API is running"}
