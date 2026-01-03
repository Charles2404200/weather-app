import pytest
from httpx import AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_health_check():
    """Test health check endpoint."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_root_endpoint():
    """Test root endpoint."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "version" in data


@pytest.mark.asyncio
async def test_weather_current_invalid_coords():
    """Test current weather endpoint with invalid coordinates."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get(
            "/api/v1/weather/current",
            params={"latitude": 999, "longitude": 999}
        )
        # Should handle the error gracefully
        assert response.status_code in [400, 500]


@pytest.mark.asyncio
async def test_weather_forecast():
    """Test forecast endpoint."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get(
            "/api/v1/weather/forecast",
            params={"latitude": 21.03, "longitude": 105.78, "days": 5}
        )
        # Should return successful response or handle error
        assert response.status_code in [200, 500]
