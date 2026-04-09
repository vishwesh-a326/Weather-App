import React, { useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import './WeatherDashboard.css';
import { generateReport } from '../utils/reportGenerator';
import SafetyDashboard from './SafetyDashboard';

const WMO_ICONS = {
  '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '🌥️',
  '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
};

const CustomTooltip = ({ active, payload, label, unit = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="tt-label">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: <strong>{p.value}{unit}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function WeatherDashboard({ weather, forecast }) {
  const icon = WMO_ICONS[weather.weather[0].icon] || '🌡️';
  const sunriseTime = new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const sunsetTime  = new Date(weather.sys.sunset  * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Process forecast into chart data
  const hourlyData = useMemo(() =>
    forecast.list.slice(0, 16).map(item => ({
      time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temp: Math.round(item.main.temp),
      feelsLike: Math.round(item.main.feels_like),
      humidity: item.main.humidity,
      wind: Math.round(item.wind.speed * 3.6),
    })), [forecast]);

  const dailyData = useMemo(() => {
    const days = {};
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const key = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      if (!days[key]) days[key] = { temps: [], humidity: [], wind: [], label: key };
      days[key].temps.push(item.main.temp);
      days[key].humidity.push(item.main.humidity);
      days[key].wind.push(item.wind.speed * 3.6);
    });
    return Object.values(days).slice(0, 5).map(d => ({
      day: d.label,
      high: Math.round(Math.max(...d.temps)),
      low: Math.round(Math.min(...d.temps)),
      avgHumidity: Math.round(d.humidity.reduce((a,b) => a+b,0) / d.humidity.length),
      avgWind: Math.round(d.wind.reduce((a,b) => a+b,0) / d.wind.length),
    }));
  }, [forecast]);

  const handleDownload = () => {
    generateReport(weather, forecast, hourlyData, dailyData);
  };

  return (
    <div className="dashboard">
      {/* HERO CARD */}
      <div className="hero-card fade-up fade-up-1">
        <div className="hero-left">
          <div className="city-name">
            {weather.name}
            <span className="country-badge">{weather.sys.country}</span>
          </div>
          <div className="weather-desc">{weather.weather[0].description}</div>
          <div className="temp-main">{Math.round(weather.main.temp)}<span className="deg">°C</span></div>
          <div className="feels-like">Feels like {Math.round(weather.main.feels_like)}°C</div>
          <div className="temp-range">
            <span className="range-high">▲ {Math.round(weather.main.temp_max)}°</span>
            <span className="range-sep">·</span>
            <span className="range-low">▼ {Math.round(weather.main.temp_min)}°</span>
          </div>
        </div>
        <div className="hero-right">
          <div className="weather-icon-main">{icon}</div>
          <button className="report-btn" onClick={handleDownload}>
            <span>↓</span> DOWNLOAD REPORT
          </button>
        </div>
      </div>

      {/* STAT GRID */}
      <div className="stats-grid fade-up fade-up-2">
        {[
          { label: 'Humidity',     value: `${weather.main.humidity}%`,             icon: '💧', accent: 'blue' },
          { label: 'Wind Speed',   value: `${Math.round(weather.wind.speed * 3.6)} km/h`, icon: '💨', accent: 'cyan' },
          { label: 'Pressure',     value: `${weather.main.pressure} hPa`,          icon: '⬆', accent: 'orange' },
          { label: 'Visibility',   value: `${((weather.visibility || 0) / 1000).toFixed(1)} km`, icon: '👁', accent: 'green' },
          { label: 'Sunrise',      value: sunriseTime,                              icon: '🌅', accent: 'yellow' },
          { label: 'Sunset',       value: sunsetTime,                               icon: '🌇', accent: 'red' },
          { label: 'Cloud Cover',  value: `${weather.clouds.all}%`,                icon: '☁', accent: 'gray' },
          { label: 'Sea Level',    value: `${weather.main.sea_level || weather.main.pressure} hPa`, icon: '🌊', accent: 'teal' },
        ].map(({ label, value, icon: si, accent }) => (
          <div key={label} className={`stat-card accent-${accent}`}>
            <span className="stat-icon">{si}</span>
            <span className="stat-value">{value}</span>
            <span className="stat-label">{label}</span>
          </div>
        ))}
      </div>

      {/* SAFETY ADVISORY */}
      <SafetyDashboard weatherData={weather} />

      {/* CHARTS */}
      <div className="charts-section">
        {/* Temperature Chart */}
        <div className="chart-card wide fade-up fade-up-3">
          <div className="chart-header">
            <h3 className="chart-title">Temperature Trend</h3>
            <span className="chart-sub">Next 48 hours (°C)</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="feelGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ff6b35" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ff6b35" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2430" />
              <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip unit="°C" />} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3b0' }} />
              <Area type="monotone" dataKey="temp" name="Temperature" stroke="#00d4ff" strokeWidth={2} fill="url(#tempGrad)" dot={false} />
              <Area type="monotone" dataKey="feelsLike" name="Feels Like" stroke="#ff6b35" strokeWidth={2} fill="url(#feelGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Humidity Chart */}
        <div className="chart-card fade-up fade-up-3">
          <div className="chart-header">
            <h3 className="chart-title">Humidity</h3>
            <span className="chart-sub">48h trend (%)</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2430" />
              <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip unit="%" />} />
              <Bar dataKey="humidity" name="Humidity" fill="#00d4ff" radius={[3,3,0,0]} opacity={0.75} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Wind Chart */}
        <div className="chart-card fade-up fade-up-4">
          <div className="chart-header">
            <h3 className="chart-title">Wind Speed</h3>
            <span className="chart-sub">48h trend (km/h)</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2430" />
              <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip unit=" km/h" />} />
              <Line type="monotone" dataKey="wind" name="Wind" stroke="#7fff6b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 5-Day Forecast */}
        <div className="chart-card wide fade-up fade-up-4">
          <div className="chart-header">
            <h3 className="chart-title">5-Day Forecast</h3>
            <span className="chart-sub">High / Low temperatures (°C)</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2430" />
              <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip unit="°C" />} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3b0' }} />
              <Bar dataKey="high" name="High" fill="#ff6b35" radius={[3,3,0,0]} />
              <Bar dataKey="low"  name="Low"  fill="#00d4ff" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Daily humidity + wind table */}
        <div className="chart-card wide fade-up fade-up-5">
          <div className="chart-header">
            <h3 className="chart-title">Daily Summary</h3>
            <span className="chart-sub">Avg humidity & wind per day</span>
          </div>
          <div className="forecast-table-wrap">
            <table className="forecast-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>High</th>
                  <th>Low</th>
                  <th>Humidity</th>
                  <th>Wind</th>
                </tr>
              </thead>
              <tbody>
                {dailyData.map(d => (
                  <tr key={d.day}>
                    <td>{d.day}</td>
                    <td className="val-hot">{d.high}°C</td>
                    <td className="val-cold">{d.low}°C</td>
                    <td>{d.avgHumidity}%</td>
                    <td>{d.avgWind} km/h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
