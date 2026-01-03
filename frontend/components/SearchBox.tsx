'use client';

import React, { useState, useRef, useEffect } from 'react';
import { City, WORLD_CITIES } from '@/lib/cities';
import styles from './SearchBox.module.css';

interface SearchBoxProps {
  onCitySelect: (city: City) => void;
  onRotateToCity: (city: City) => void;
}

export default function SearchBox({ onCitySelect, onRotateToCity }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);

    if (value.length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = WORLD_CITIES.filter(
      (city) =>
        city.name.toLowerCase().includes(value.toLowerCase()) ||
        city.country.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 8);

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  const handleSelectCity = (city: City) => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    onCitySelect(city);
    
    // Auto-rotate to the selected city
    setTimeout(() => {
      onRotateToCity(city);
    }, 100);
  };

  return (
    <div ref={containerRef} className={styles.searchContainer}>
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Search city or country..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.length > 0 && setShowSuggestions(true)}
          className={styles.input}
        />
        <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className={styles.suggestions}>
          {suggestions.map((city, idx) => (
            <div
              key={idx}
              className={styles.suggestionItem}
              onClick={() => handleSelectCity(city)}
            >
              <div className={styles.cityName}>{city.name}</div>
              <div className={styles.country}>{city.country}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
