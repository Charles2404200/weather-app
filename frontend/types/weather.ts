export interface WeatherData {
  city: string;
  temperature: number;
  weather_code: number;
  humidity: number;
  wind_speed: number;
  description: string;
  updated_at: string;
}

export interface ForecastItem {
  date: string;
  max_temp: number;
  min_temp: number;
  weather_code: number;
  description: string;
  precipitation: number;
  wind_speed: number;
}

export interface Forecast {
  city: string;
  forecasts: ForecastItem[];
}

export interface Location {
  name: string;
  latitude: number;
  longitude: number;
}
