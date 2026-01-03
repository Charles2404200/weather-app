const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function getCurrentWeather(latitude: number, longitude: number) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/weather/current?latitude=${latitude}&longitude=${longitude}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch current weather:', error);
    throw error;
  }
}

export async function getForecast(latitude: number, longitude: number, days: number = 7) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/weather/forecast?latitude=${latitude}&longitude=${longitude}&days=${days}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch forecast:', error);
    throw error;
  }
}

export async function getWeatherData(latitude: number, longitude: number) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/weather?latitude=${latitude}&longitude=${longitude}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    throw error;
  }
}

// Common cities with coordinates
export const POPULAR_CITIES = {
  'Hanoi': { latitude: 21.0285, longitude: 105.8542 },
  'Ho Chi Minh City': { latitude: 10.8231, longitude: 106.6297 },
  'Da Nang': { latitude: 16.0544, longitude: 108.2022 },
  'Hai Phong': { latitude: 20.8449, longitude: 106.6881 },
  'Can Tho': { latitude: 10.0379, longitude: 105.7869 },
  'Bangkok': { latitude: 13.7563, longitude: 100.5018 },
  'Singapore': { latitude: 1.3521, longitude: 103.8198 },
  'Tokyo': { latitude: 35.6762, longitude: 139.6503 },
  'New York': { latitude: 40.7128, longitude: -74.0060 },
  'London': { latitude: 51.5074, longitude: -0.1278 },
};
