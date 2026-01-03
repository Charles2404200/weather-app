'use client';

import { ForecastItem } from '@/types/weather';

interface ForecastListProps {
  forecasts: ForecastItem[];
}

export default function ForecastList({ forecasts }: ForecastListProps) {
  return (
    <div className="forecast-list">
      <h3>7-Day Forecast</h3>
      <div className="forecast-items">
        {forecasts.map((item, index) => (
          <div key={index} className="forecast-item">
            <p className="forecast-date">
              {new Date(item.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
            </p>
            <div className="forecast-icon">
              {getWeatherEmoji(item.weather_code)}
            </div>
            <p className="forecast-description">{item.description}</p>
            <div className="forecast-temps">
              <span className="temp-high">{Math.round(item.max_temp)}°</span>
              <span className="temp-low">{Math.round(item.min_temp)}°</span>
            </div>
            <div className="forecast-details">
              <div className="forecast-detail">
                <span className="label">💧</span>
                <span className="value">{Math.round(item.precipitation)}mm</span>
              </div>
              <div className="forecast-detail">
                <span className="label">💨</span>
                <span className="value">{Math.round(item.wind_speed)}km/h</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getWeatherEmoji(code: number): string {
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
