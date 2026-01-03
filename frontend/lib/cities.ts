export interface City {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

export const WORLD_CITIES: City[] = [
  // Asia
  { name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, country: 'Japan' },
  { name: 'Beijing', latitude: 39.9042, longitude: 116.4074, country: 'China' },
  { name: 'Shanghai', latitude: 31.2304, longitude: 121.4737, country: 'China' },
  { name: 'Mumbai', latitude: 19.0760, longitude: 72.8777, country: 'India' },
  { name: 'Delhi', latitude: 28.6139, longitude: 77.2090, country: 'India' },
  { name: 'Bangkok', latitude: 13.7563, longitude: 100.5018, country: 'Thailand' },
  { name: 'Singapore', latitude: 1.3521, longitude: 103.8198, country: 'Singapore' },
  { name: 'Hong Kong', latitude: 22.2783, longitude: 114.1747, country: 'Hong Kong' },
  { name: 'Seoul', latitude: 37.5665, longitude: 126.9780, country: 'South Korea' },
  { name: 'Hanoi', latitude: 21.0285, longitude: 105.8542, country: 'Vietnam' },
  { name: 'Ho Chi Minh City', latitude: 10.8231, longitude: 106.6297, country: 'Vietnam' },
  { name: 'Manila', latitude: 14.5995, longitude: 120.9842, country: 'Philippines' },
  { name: 'Jakarta', latitude: -6.1751, longitude: 106.8274, country: 'Indonesia' },
  { name: 'Kuala Lumpur', latitude: 3.1390, longitude: 101.6869, country: 'Malaysia' },

  // Europe
  { name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'United Kingdom' },
  { name: 'Paris', latitude: 48.8566, longitude: 2.3522, country: 'France' },
  { name: 'Berlin', latitude: 52.5200, longitude: 13.4050, country: 'Germany' },
  { name: 'Rome', latitude: 41.9028, longitude: 12.4964, country: 'Italy' },
  { name: 'Madrid', latitude: 40.4168, longitude: -3.7038, country: 'Spain' },
  { name: 'Moscow', latitude: 55.7558, longitude: 37.6173, country: 'Russia' },
  { name: 'Amsterdam', latitude: 52.3676, longitude: 4.9041, country: 'Netherlands' },
  { name: 'Vienna', latitude: 48.2082, longitude: 16.3738, country: 'Austria' },
  { name: 'Prague', latitude: 50.0755, longitude: 14.4378, country: 'Czech Republic' },
  { name: 'Istanbul', latitude: 41.0082, longitude: 28.9784, country: 'Turkey' },

  // Americas
  { name: 'New York', latitude: 40.7128, longitude: -74.0060, country: 'USA' },
  { name: 'Los Angeles', latitude: 34.0522, longitude: -118.2437, country: 'USA' },
  { name: 'Chicago', latitude: 41.8781, longitude: -87.6298, country: 'USA' },
  { name: 'Toronto', latitude: 43.6532, longitude: -79.3832, country: 'Canada' },
  { name: 'Mexico City', latitude: 19.4326, longitude: -99.1332, country: 'Mexico' },
  { name: 'São Paulo', latitude: -23.5505, longitude: -46.6333, country: 'Brazil' },
  { name: 'Rio de Janeiro', latitude: -22.9068, longitude: -43.1729, country: 'Brazil' },
  { name: 'Buenos Aires', latitude: -34.6037, longitude: -58.3816, country: 'Argentina' },
  { name: 'Santiago', latitude: -33.8688, longitude: -51.2093, country: 'Chile' },
  { name: 'Bogotá', latitude: 4.7110, longitude: -74.0721, country: 'Colombia' },

  // Africa
  { name: 'Cairo', latitude: 30.0444, longitude: 31.2357, country: 'Egypt' },
  { name: 'Lagos', latitude: 6.5244, longitude: 3.3792, country: 'Nigeria' },
  { name: 'Nairobi', latitude: -1.2865, longitude: 36.8172, country: 'Kenya' },
  { name: 'Johannesburg', latitude: -26.1924, longitude: 28.0456, country: 'South Africa' },
  { name: 'Cape Town', latitude: -33.9249, longitude: 18.4241, country: 'South Africa' },

  // Oceania
  { name: 'Sydney', latitude: -33.8688, longitude: 151.2093, country: 'Australia' },
  { name: 'Melbourne', latitude: -37.8136, longitude: 144.9631, country: 'Australia' },
  { name: 'Auckland', latitude: -37.0882, longitude: 174.1870, country: 'New Zealand' },
];
