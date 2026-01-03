# Weather App 🌤️

A modern, full-stack weather application built with **Next.js** (frontend) and **FastAPI** (backend).

## Features

- 🌍 Real-time weather data from Open-Meteo API
- 🔍 Search weather by city name
- 📍 Support for 10+ popular cities worldwide
- 📅 7-day weather forecast
- 📊 Detailed weather metrics (temperature, humidity, wind speed)
- 🎨 Beautiful, responsive UI
- ⚡ Fast API with caching
- 🐳 Docker support for easy deployment

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Pydantic** - Data validation
- **HTTPX** - Async HTTP client
- **Python 3.8+**

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **CSS3** - Modern styling
- **React 18+**

### Data Source
- **Open-Meteo API** - Free weather data (no API key required!)

## Quick Start

### Prerequisites
- Python 3.8+ (for backend)
- Node.js 18+ (for frontend)
- Docker & Docker Compose (optional)

### Option 1: Local Development

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python -m uvicorn app.main:app --reload --port 8000
```

Backend will be available at: `http://localhost:8000`

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

Frontend will be available at: `http://localhost:3000`

### Option 2: Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d
```

Access:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

## Project Structure

```
weather-app/
├── backend/                    # FastAPI application
│   ├── app/
│   │   ├── main.py            # Entry point
│   │   ├── api/               # Routes
│   │   ├── services/          # Business logic
│   │   ├── schemas/           # Data models
│   │   ├── core/              # Configuration
│   │   └── utils/             # Utilities
│   ├── tests/                 # Unit tests
│   ├── requirements.txt
│   ├── .env
│   └── README.md
│
├── frontend/                   # Next.js application
│   ├── app/                   # App Router
│   ├── components/            # React components
│   ├── lib/                   # API client & helpers
│   ├── types/                 # TypeScript types
│   ├── styles/                # Global styles
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.local
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

## API Endpoints

### Current Weather
```
GET /api/v1/weather/current?latitude=21.03&longitude=105.78
```

**Response:**
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

### Full Weather Data
```
GET /api/v1/weather?latitude=21.03&longitude=105.78
```

### Health Check
```
GET /health
```

## Supported Cities

Pre-configured cities with quick search:
- 🇻🇳 Hanoi, Ho Chi Minh City, Da Nang, Hai Phong, Can Tho
- 🇹🇭 Bangkok
- 🇸🇬 Singapore
- 🇯🇵 Tokyo
- 🇺🇸 New York
- 🇬🇧 London

Add more cities by editing [frontend/lib/weatherApi.ts](frontend/lib/weatherApi.ts)

## Configuration

### Backend (.env)
```env
HOST=0.0.0.0
PORT=8000
DEBUG=True
WEATHER_API_BASE_URL=https://api.open-meteo.com/v1
CACHE_TTL_SECONDS=600
ENABLE_CACHE=True
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Development

### Running Tests (Backend)
```bash
cd backend
pytest tests/
```

### Building for Production

Backend:
```bash
cd backend
gunicorn -w 4 -b 0.0.0.0:8000 app.main:app
```

Frontend:
```bash
cd frontend
npm run build
npm start
```

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Performance

-  **Caching**: 10-minute cache for weather data
-  **Async**: All API calls are asynchronous
-  **Optimized**: Minimal dependencies, fast load times

## Weather Codes

The app uses WMO Weather Codes:
- 0: Clear sky 
- 1-2: Mostly cloudy 
- 3: Overcast 
- 45-48: Foggy 
- 51-67: Rain 
- 71-86: Snow 
- 95-99: Thunderstorm 

## Troubleshooting

### Backend fails to start
```bash
# Check if port 8000 is already in use
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows
```

### Frontend can't connect to backend
- Check if backend is running on `http://localhost:8000`
- Update `NEXT_PUBLIC_API_URL` in `.env.local`

### Docker issues
```bash
# Clean up and rebuild
docker-compose down
docker-compose up --build --no-cache
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Open-Meteo API](https://open-meteo.com/)
- [WMO Weather Codes](https://www.noaa.gov/)

## Support

For questions or issues, please open an issue on GitHub.

Happy weather forecasting! 
