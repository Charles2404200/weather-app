# Weather App Backend

FastAPI-based weather API service that provides current weather and forecast data.

## Features

- 🌦️ Current weather data
- 📅 7-day forecast
- 🗺️ Location-based queries using coordinates
- ⚡ Fast caching system
- 📊 Detailed hourly and daily weather data
- 🔧 Easy configuration

## Quick Start

### Prerequisites
- Python 3.8+
- pip

### Installation

```bash
# Install dependencies
pip install -r requirements.txt

# Copy environment file and configure if needed
cp .env.example .env
```

### Running the Server

```bash
# Development mode with auto-reload
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or use the run script
python app/main.py
```

The API will be available at `http://localhost:8000`

### API Documentation

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## API Endpoints

### Current Weather
```
GET /api/v1/weather/current?latitude=21.03&longitude=105.78
```

Response:
```json
{
  "city": "21.03, 105.78",
  "temperature": 22.5,
  "weather_code": 1,
  "humidity": 65,
  "wind_speed": 5.2,
  "description": "Mostly Cloudy",
  "updated_at": "2024-01-04T10:30:00"
}
```

### Weather Forecast
```
GET /api/v1/weather/forecast?latitude=21.03&longitude=105.78&days=7
```

Response:
```json
{
  "city": "21.03, 105.78",
  "forecasts": [
    {
      "date": "2024-01-04",
      "max_temp": 28.5,
      "min_temp": 18.2,
      "weather_code": 1,
      "description": "Mostly Cloudy",
      "precipitation": 0.0,
      "wind_speed": 12.5
    }
  ]
}
```

### Full Weather Data
```
GET /api/v1/weather?latitude=21.03&longitude=105.78
```

### Health Check
```
GET /health
```

## Testing

```bash
pytest tests/
```

## Environment Variables

- `HOST`: Server host (default: 0.0.0.0)
- `PORT`: Server port (default: 8000)
- `DEBUG`: Debug mode (default: False)
- `WEATHER_API_BASE_URL`: Weather API base URL
- `CACHE_TTL_SECONDS`: Cache time-to-live in seconds (default: 600)
- `ENABLE_CACHE`: Enable caching (default: True)

## Architecture

- **api/**: API routes and endpoints
- **services/**: Business logic layer
- **schemas/**: Pydantic models for validation
- **core/**: Configuration and settings
- **utils/**: Helper functions and utilities

## Data Source

This API uses the free [Open-Meteo API](https://open-meteo.com/) for weather data.
No authentication required!

## License

MIT
