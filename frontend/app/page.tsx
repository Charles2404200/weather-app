'use client';

import { useState, useRef } from 'react';
import Globe from '@/components/Globe';
import SearchBox from '@/components/SearchBox';
import WeatherCard from '@/components/WeatherCard';
import ForecastList from '@/components/ForecastList';
import { getCurrentWeather, getForecast } from '@/lib/weatherApi';
import { City } from '@/lib/cities';
import { WeatherData, Forecast } from '@/types/weather';
import styles from '@/styles/home.module.css';

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const globeRef = useRef<any>(null);

  const handleCitySelect = async (city: City) => {
    setSelectedCity(city);
    setIsLoading(true);
    setError(null);

    try {
      const [weatherData, forecastData] = await Promise.all([
        getCurrentWeather(city.latitude, city.longitude),
        getForecast(city.latitude, city.longitude, 7)
      ]);

      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRotateToCity = (city: City) => {
    if (globeRef.current) {
      globeRef.current.rotateTo(city);
    }
  };

  return (
    <div className={styles.page}>
      <Globe 
        ref={globeRef}
        onCitySelect={handleCitySelect} 
        selectedCity={selectedCity}
      />
      
      <SearchBox 
        onCitySelect={handleCitySelect}
        onRotateToCity={handleRotateToCity}
      />
      
      {selectedCity && (
        <div className={styles.weatherPanel}>
          <div className={styles.panelHeader}>
            <h1>{selectedCity.name}</h1>
            <span className={styles.country}>{selectedCity.country}</span>
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          {isLoading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading weather data...</p>
            </div>
          )}

          {!isLoading && weather && (
            <>
              <WeatherCard data={weather} />
              {forecast && <ForecastList forecasts={forecast.forecasts} />}
            </>
          )}
        </div>
      )}
    </div>
  );
}
