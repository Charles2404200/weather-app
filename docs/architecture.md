# Weather App Architecture

## System Overview

The Weather App is a full-stack application with the following architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                          │
└──────────────┬──────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js Frontend (Port 3000)                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Pages & Components                                 │   │
│  │  - SearchBox (city search)                         │   │
│  │  - WeatherCard (current weather)                   │   │
│  │  - ForecastList (7-day forecast)                   │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────┬──────────────────────────────────────────────┘
               │ HTTP Requests
               │ (REST API)
               ▼
┌─────────────────────────────────────────────────────────────┐
│               FastAPI Backend (Port 8000)                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  API Routes (/api/v1/weather)                       │   │
│  │  - GET /current                                    │   │
│  │  - GET /forecast                                   │   │
│  │  - GET /                                           │   │
│  └──────────────┬──────────────────────────────────────┘   │
│                 │                                            │
│  ┌──────────────▼──────────────────────────────────────┐   │
│  │  Services Layer                                      │   │
│  │  - WeatherService (business logic)                 │   │
│  │  - Data processing & caching                       │   │
│  └──────────────┬──────────────────────────────────────┘   │
│                 │                                            │
│  ┌──────────────▼──────────────────────────────────────┐   │
│  │  Utilities                                           │   │
│  │  - SimpleCache (in-memory TTL cache)               │   │
│  │  - Configuration management                         │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────┬──────────────────────────────────────────────┘
               │ HTTP Requests
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│           Open-Meteo Weather API                            │
│           (Free, no authentication required)                │
└─────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend (Next.js 14 + React 18 + TypeScript)

**Key Features:**
- App Router (next/app directory)
- Type-safe with TypeScript
- Responsive CSS styling
- Client-side state management with React hooks
- Error boundary and loading states

**Main Components:**
- `SearchBox`: City search with autocomplete
- `WeatherCard`: Current weather display
- `ForecastList`: 7-day forecast grid

**Key Files:**
- `app/page.tsx`: Main page with state management
- `lib/weatherApi.ts`: API client functions
- `types/weather.ts`: TypeScript interfaces
- `styles/globals.css`: Responsive design

### Backend (FastAPI + Python)

**Architecture Layers:**

1. **API Layer** (`app/api/`)
   - HTTP endpoint handlers
   - Request validation
   - Response formatting

2. **Service Layer** (`app/services/`)
   - Business logic
   - Data transformation
   - Weather calculations

3. **Data Layer** (`app/schemas/`)
   - Pydantic models for validation
   - Request/response schemas
   - Type definitions

4. **Core** (`app/core/`)
   - Configuration management
   - Settings from environment

5. **Utils** (`app/utils/`)
   - Helper functions
   - Caching mechanism
   - Common utilities

**Key Features:**
- Async/await for non-blocking operations
- Request validation with Pydantic
- Automatic API documentation (Swagger/ReDoc)
- CORS enabled for cross-origin requests
- Error handling and logging

## Data Flow

### Get Current Weather

```
Frontend (SearchBox)
  │
  ├─> Emit search event
  │
  └─> JavaScript fetch()
        │
        ▼
      Backend GET /api/v1/weather/current
        │
        ├─> Route handler (api/weather.py)
        │
        ├─> WeatherService.get_current_weather()
        │
        ├─> Check cache (SimpleCache)
        │
        ├─> If miss: Call Open-Meteo API
        │
        ├─> Cache response (TTL: 10 min)
        │
        └─> Return JSON response
            │
            ▼
        Frontend (WeatherCard)
        Display temperature, humidity, wind speed
```

### Get Forecast

Similar flow but calls `get_forecast()` which returns 7-day forecast data.

## Caching Strategy

**SimpleCache Implementation:**
- In-memory cache with TTL (Time-To-Live)
- Default TTL: 600 seconds (10 minutes)
- Automatic cleanup of expired entries
- Per-location caching: `weather_{latitude}_{longitude}`

**Benefits:**
- Reduced API calls to Open-Meteo
- Faster response times
- Reduced bandwidth usage

## API Response Examples

### Current Weather
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

### Forecast
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

## Environment Configuration

### Backend (.env)
```
HOST=0.0.0.0
PORT=8000
DEBUG=False
WEATHER_API_BASE_URL=https://api.open-meteo.com/v1
CACHE_TTL_SECONDS=600
ENABLE_CACHE=True
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Deployment Options

### Docker Compose
All services in containers with proper networking and volume mounting.

### Production Deployment
- Backend: Use Gunicorn/Uvicorn
- Frontend: Build static assets, use Node.js or static hosting
- Reverse proxy: Nginx for routing

## Performance Considerations

1. **Caching**: Reduces redundant API calls
2. **Async Operations**: Non-blocking I/O in backend
3. **Lazy Loading**: Components load on demand
4. **Code Splitting**: Next.js automatic code splitting
5. **Minimal Dependencies**: Lean tech stack

## Security

- CORS configured (adjust origins in production)
- Input validation with Pydantic
- Environment variable protection
- No sensitive data in frontend
- API rate limiting (can be added with middleware)

## Monitoring & Logging

- Backend logging for API calls
- Error tracking and reporting
- Health check endpoints
- Development/production modes

## Future Enhancements

- Add weather alerts
- User location via geolocation
- Favorites/bookmarks
- Multiple language support
- Theme switcher (dark/light mode)
- Advanced analytics
- Real-time weather updates (WebSocket)
- Historical weather data
