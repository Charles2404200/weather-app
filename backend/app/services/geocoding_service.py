import openmeteo_requests
import requests_cache
from retry_requests import retry

class GeocodingService:
    """Service for geocoding and location search using Open-Meteo API"""
    
    _client = None
    
    @classmethod
    def _get_client(cls):
        """Lazy initialize the OpenMeteo client"""
        if cls._client is None:
            cache_session = requests_cache.CachedSession('geocode_cache', expire_after=3600)
            retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
            cls._client = openmeteo_requests.Client(session=retry_session)
        return cls._client
    
    @staticmethod
    async def search_cities(query: str, count: int = 10, language: str = "en") -> list:
        """
        Search for cities/locations using Open-Meteo Geocoding API.
        
        Args:
            query: Search query (city name)
            count: Number of results to return (default 10)
            language: Language for results (default "en")
        
        Returns:
            List of cities with name, country, latitude, longitude
        """
        try:
            client = GeocodingService._get_client()
            
            url = "https://geocoding-api.open-meteo.com/v1/search"
            params = {
                "name": query,
                "count": count,
                "language": language,
                "format": "json"
            }
            
            response = client.get(url, params=params)
            
            if not response or not hasattr(response, 'json'):
                return []
            
            data = response.json()
            cities = []
            
            # Parse results
            if "results" in data:
                for result in data["results"]:
                    city_data = {
                        "name": result.get("name", ""),
                        "country": result.get("country", ""),
                        "latitude": result.get("latitude", 0),
                        "longitude": result.get("longitude", 0),
                        "admin1": result.get("admin1", None),
                    }
                    cities.append(city_data)
            
            return cities
        except Exception as e:
            print(f"Error searching cities: {str(e)}")
            return []
    
    @staticmethod
    async def get_major_cities() -> list:
        """
        Get a curated list of major cities worldwide.
        These are pre-selected cities that are most relevant for weather.
        """
        major_cities = [
            # Asia
            {"name": "Tokyo", "country": "Japan", "latitude": 35.6762, "longitude": 139.6503},
            {"name": "Beijing", "country": "China", "latitude": 39.9042, "longitude": 116.4074},
            {"name": "Shanghai", "country": "China", "latitude": 31.2304, "longitude": 121.4737},
            {"name": "Mumbai", "country": "India", "latitude": 19.0760, "longitude": 72.8777},
            {"name": "Delhi", "country": "India", "latitude": 28.6139, "longitude": 77.2090},
            {"name": "Bangkok", "country": "Thailand", "latitude": 13.7563, "longitude": 100.5018},
            {"name": "Singapore", "country": "Singapore", "latitude": 1.3521, "longitude": 103.8198},
            {"name": "Hong Kong", "country": "Hong Kong", "latitude": 22.2783, "longitude": 114.1747},
            {"name": "Seoul", "country": "South Korea", "latitude": 37.5665, "longitude": 126.9780},
            {"name": "Hanoi", "country": "Vietnam", "latitude": 21.0285, "longitude": 105.8542},
            {"name": "Ho Chi Minh City", "country": "Vietnam", "latitude": 10.8231, "longitude": 106.6297},
            {"name": "Manila", "country": "Philippines", "latitude": 14.5995, "longitude": 120.9842},
            {"name": "Jakarta", "country": "Indonesia", "latitude": -6.1751, "longitude": 106.8274},
            {"name": "Kuala Lumpur", "country": "Malaysia", "latitude": 3.1390, "longitude": 101.6869},
            {"name": "Phuket", "country": "Thailand", "latitude": 7.8804, "longitude": 98.3923},
            {"name": "Chiang Mai", "country": "Thailand", "latitude": 18.7883, "longitude": 98.9853},
            
            # Europe
            {"name": "London", "country": "United Kingdom", "latitude": 51.5074, "longitude": -0.1278},
            {"name": "Paris", "country": "France", "latitude": 48.8566, "longitude": 2.3522},
            {"name": "Berlin", "country": "Germany", "latitude": 52.5200, "longitude": 13.4050},
            {"name": "Rome", "country": "Italy", "latitude": 41.9028, "longitude": 12.4964},
            {"name": "Madrid", "country": "Spain", "latitude": 40.4168, "longitude": -3.7038},
            {"name": "Moscow", "country": "Russia", "latitude": 55.7558, "longitude": 37.6173},
            {"name": "Amsterdam", "country": "Netherlands", "latitude": 52.3676, "longitude": 4.9041},
            {"name": "Vienna", "country": "Austria", "latitude": 48.2082, "longitude": 16.3738},
            {"name": "Prague", "country": "Czech Republic", "latitude": 50.0755, "longitude": 14.4378},
            {"name": "Istanbul", "country": "Turkey", "latitude": 41.0082, "longitude": 28.9784},
            {"name": "Barcelona", "country": "Spain", "latitude": 41.3851, "longitude": 2.1734},
            {"name": "Milan", "country": "Italy", "latitude": 45.4642, "longitude": 9.1900},
            
            # Americas
            {"name": "New York", "country": "USA", "latitude": 40.7128, "longitude": -74.0060},
            {"name": "Los Angeles", "country": "USA", "latitude": 34.0522, "longitude": -118.2437},
            {"name": "Chicago", "country": "USA", "latitude": 41.8781, "longitude": -87.6298},
            {"name": "Houston", "country": "USA", "latitude": 29.7604, "longitude": -95.3698},
            {"name": "Miami", "country": "USA", "latitude": 25.7617, "longitude": -80.1918},
            {"name": "Toronto", "country": "Canada", "latitude": 43.6532, "longitude": -79.3832},
            {"name": "Vancouver", "country": "Canada", "latitude": 49.2827, "longitude": -123.1207},
            {"name": "Mexico City", "country": "Mexico", "latitude": 19.4326, "longitude": -99.1332},
            {"name": "Cancún", "country": "Mexico", "latitude": 21.1619, "longitude": -86.8515},
            {"name": "São Paulo", "country": "Brazil", "latitude": -23.5505, "longitude": -46.6333},
            {"name": "Rio de Janeiro", "country": "Brazil", "latitude": -22.9068, "longitude": -43.1729},
            {"name": "Buenos Aires", "country": "Argentina", "latitude": -34.6037, "longitude": -58.3816},
            {"name": "Santiago", "country": "Chile", "latitude": -33.8688, "longitude": -51.2093},
            {"name": "Bogotá", "country": "Colombia", "latitude": 4.7110, "longitude": -74.0721},
            
            # Africa
            {"name": "Cairo", "country": "Egypt", "latitude": 30.0444, "longitude": 31.2357},
            {"name": "Lagos", "country": "Nigeria", "latitude": 6.5244, "longitude": 3.3792},
            {"name": "Nairobi", "country": "Kenya", "latitude": -1.2865, "longitude": 36.8172},
            {"name": "Johannesburg", "country": "South Africa", "latitude": -26.1924, "longitude": 28.0456},
            {"name": "Cape Town", "country": "South Africa", "latitude": -33.9249, "longitude": 18.4241},
            {"name": "Casablanca", "country": "Morocco", "latitude": 33.5731, "longitude": -7.5898},
            {"name": "Dubai", "country": "UAE", "latitude": 25.2048, "longitude": 55.2708},
            
            # Oceania
            {"name": "Sydney", "country": "Australia", "latitude": -33.8688, "longitude": 151.2093},
            {"name": "Melbourne", "country": "Australia", "latitude": -37.8136, "longitude": 144.9631},
            {"name": "Auckland", "country": "New Zealand", "latitude": -37.0882, "longitude": 174.1870},
        ]
        
        return major_cities
