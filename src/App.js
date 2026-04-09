import React, { useState, useCallback } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import WeatherDashboard from './components/WeatherDashboard';
import RecentSearches from './components/RecentSearches';

const API_KEY = 'b1693ed7ad181ad79817cc99d0523aa3';

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const fetchWeather = useCallback(async (city) => {
    if (!city.trim()) return;
    setLoading(true);
    setError('');
    setWeatherData(null);
    setForecastData(null);

    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&cnt=40`)
      ]);

      if (!weatherRes.ok) {
        const err = await weatherRes.json();
        throw new Error(err.message || 'City not found');
      }

      const weather = await weatherRes.json();
      const forecast = await forecastRes.json();

      setWeatherData(weather);
      setForecastData(forecast);
      setHistory(prev => {
        const filtered = prev.filter(c => c.toLowerCase() !== city.toLowerCase());
        return [city, ...filtered].slice(0, 6);
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header fade-up">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">◈</span>
            <span className="logo-text">WEATHERSCOPE</span>
          </div>
          <p className="header-tagline">Real-time city intelligence</p>
        </div>
        <div className="header-deco">
          <span className="deco-line" />
          <span className="deco-dot" />
          <span className="deco-line" />
        </div>
      </header>

      {/* Search */}
      <main className="app-main">
        <SearchBar onSearch={fetchWeather} loading={loading} />

        {history.length > 0 && (
          <RecentSearches cities={history} onSelect={fetchWeather} />
        )}

        {error && (
          <div className="error-box fade-up">
            <span className="error-icon">⚠</span>
            <span>{error}. Please check the city name and try again.</span>
          </div>
        )}

        {loading && (
          <div className="loading-screen fade-up">
            <div className="loader-ring" />
            <p className="loading-text">Fetching atmospheric data<span className="dots">...</span></p>
          </div>
        )}

        {weatherData && forecastData && !loading && (
          <WeatherDashboard weather={weatherData} forecast={forecastData} />
        )}

        {!weatherData && !loading && !error && (
          <div className="empty-state fade-up fade-up-2">
            <div className="empty-globe">◎</div>
            <h2>Search any city worldwide</h2>
            <p>Get real-time weather data, charts & downloadable reports</p>
            <div className="example-cities">
              {['Mumbai', 'Tokyo', 'London', 'New York', 'Sydney'].map(c => (
                <button key={c} className="example-chip" onClick={() => fetchWeather(c)}>{c}</button>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <span>Powered by OpenWeatherMap API</span>
        <span className="footer-sep">◆</span>
        <span>WeatherScope v1.0</span>
      </footer>
    </div>
  );
}
