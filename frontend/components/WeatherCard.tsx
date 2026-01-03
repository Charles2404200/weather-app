'use client';

import { WeatherData } from '@/types/weather';
import { getWeatherIcon } from '@/lib/weatherApi';

interface WeatherCardProps {
  data: WeatherData;
}

export default function WeatherCard({ data }: WeatherCardProps) {
  return (
    <div className="weather-card">
      <div className="weather-card-header">
        <h2 className="city-name">{data.city}</h2>
        <p className="updated-time">Updated: {new Date(data.updated_at).toLocaleTimeString()}</p>
      </div>

      <div className="weather-card-content">
        <div className="temperature-section">
          <div className="temperature-display">
            <span className="temperature">{Math.round(data.temperature)}°C</span>
            <span className="description">{data.description}</span>
          </div>
          <div className="weather-icon">
            {getWeatherEmoji(data.weather_code)}
          </div>
        </div>

        <div className="weather-details">
          <div className="detail-item">
            <span className="detail-label">💧 Humidity</span>
            <span className="detail-value">{data.humidity}%</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">💨 Wind Speed</span>
            <span className="detail-value">{data.wind_speed.toFixed(1)} km/h</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">🌡️ Weather Code</span>
            <span className="detail-value">{data.weather_code}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getWeatherEmoji(code: number): string {
  // WMO Weather Code to emoji mapping
  if (code === 0) return '☀️';
  if (code === 1 || code === 2) return '🌤️';
  if (code === 3) return '☁️';
  if (code === 45 || code === 48) return '🌫️';
  if (code >= 51 && code <= 55) return '🌧️';
  if (code >= 61 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌧️';
  if (code >= 85 && code <= 86) return '❄️';
  if (code >= 95 && code <= 99) return '⛈️';
  return '🌦️';
}
