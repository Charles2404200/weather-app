from fastapi import APIRouter, HTTPException, Query, WebSocket, WebSocketDisconnect
from typing import List, Optional
import json
from app.schemas.weather import ErrorResponse
from app.services.geocoding_service import GeocodingService
from pydantic import BaseModel

router = APIRouter(prefix="/geocoding", tags=["geocoding"])


class CityResponse(BaseModel):
    name: str
    country: str
    latitude: float
    longitude: float
    admin1: Optional[str] = None


@router.get("/search", response_model=List[CityResponse])
async def search_cities(
    query: str = Query(..., min_length=1, description="City name to search"),
    count: int = Query(10, ge=1, le=50, description="Number of results"),
    language: str = Query("en", description="Language for results"),
) -> List[CityResponse]:
    """
    Search for cities using Open-Meteo Geocoding API.
    
    Example: /api/v1/geocoding/search?query=Paris&count=10
    """
    try:
        cities = await GeocodingService.search_cities(query, count, language)
        return [CityResponse(**city) for city in cities]
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to search cities: {str(e)}"
        )


@router.get("/major-cities", response_model=List[CityResponse])
async def get_major_cities() -> List[CityResponse]:
    """
    Get a curated list of major cities worldwide for the globe.
    
    Example: /api/v1/geocoding/major-cities
    """
    try:
        cities = await GeocodingService.get_major_cities()
        return [CityResponse(**city) for city in cities]
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch major cities: {str(e)}"
        )


@router.websocket("/ws/cities")
async def websocket_cities(websocket: WebSocket):
    """
    WebSocket endpoint for real-time city streaming.
    Streams major cities one by one for real-time globe population.
    
    Example: ws://localhost:8000/api/v1/geocoding/ws/cities
    """
    await websocket.accept()
    try:
        cities = await GeocodingService.get_major_cities()
        
        # Send cities one by one with slight delay for animation effect
        for i, city in enumerate(cities):
            try:
                city_data = {
                    "type": "city",
                    "data": CityResponse(**city).dict(),
                    "index": i,
                    "total": len(cities)
                }
                await websocket.send_json(city_data)
                
                # Small delay for visual effect
                import asyncio
                await asyncio.sleep(0.05)
            except Exception as e:
                print(f"Error sending city {city['name']}: {str(e)}")
                continue
        
        # Send completion message
        await websocket.send_json({
            "type": "complete",
            "message": f"Loaded {len(cities)} cities",
            "total": len(cities)
        })
        
    except WebSocketDisconnect:
        print("WebSocket client disconnected")
    except Exception as e:
        print(f"WebSocket error: {str(e)}")
        await websocket.send_json({
            "type": "error",
            "message": str(e)
        })
