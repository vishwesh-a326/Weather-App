export function generateReport(weather, forecast, hourlyData, dailyData) {
  const city      = weather.name;
  const country   = weather.sys.country;
  const desc      = weather.weather[0].description;
  const temp      = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const humidity  = weather.main.humidity;
  const pressure  = weather.main.pressure;
  const windSpeed = Math.round(weather.wind.speed * 3.6);
  const visibility = ((weather.visibility || 0) / 1000).toFixed(1);
  const clouds    = weather.clouds.all;
  const sunrise   = new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const sunset    = new Date(weather.sys.sunset  * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const genTime   = new Date().toLocaleString();

  const dailyRows = dailyData.map(d => `
    <tr>
      <td>${d.day}</td>
      <td style="color:#ff6b35;font-weight:600">${d.high}°C</td>
      <td style="color:#00d4ff;font-weight:600">${d.low}°C</td>
      <td>${d.avgHumidity}%</td>
      <td>${d.avgWind} km/h</td>
    </tr>`).join('');

  const hourlyRows = hourlyData.map(h => `
    <tr>
      <td>${h.time}</td>
      <td>${h.temp}°C</td>
      <td>${h.feelsLike}°C</td>
      <td>${h.humidity}%</td>
      <td>${h.wind} km/h</td>
    </tr>`).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>WeatherScope Report — ${city}, ${country}</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet"/>
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{background:#0a0c10;color:#e8eaf0;font-family:'DM Sans',sans-serif;padding:40px;min-height:100vh}
  .report{max-width:860px;margin:0 auto}
  .header{border-bottom:2px solid #00d4ff;padding-bottom:24px;margin-bottom:32px}
  .header-top{display:flex;justify-content:space-between;align-items:flex-start}
  .brand{font-family:'Bebas Neue',sans-serif;font-size:42px;letter-spacing:5px;color:#00d4ff}
  .meta{text-align:right;font-family:'JetBrains Mono',monospace;font-size:11px;color:#6b7280;line-height:1.8}
  .city-block{margin-top:20px}
  .city-title{font-family:'Bebas Neue',sans-serif;font-size:56px;letter-spacing:3px;line-height:1}
  .country-tag{display:inline-block;font-family:'JetBrains Mono',monospace;font-size:12px;
    background:rgba(0,212,255,0.12);border:1px solid rgba(0,212,255,0.3);color:#00d4ff;
    padding:3px 10px;border-radius:4px;letter-spacing:2px;margin-left:12px;vertical-align:middle}
  .weather-desc{font-family:'JetBrains Mono',monospace;font-size:13px;color:#6b7280;
    text-transform:capitalize;letter-spacing:2px;margin-top:8px}
  .temp-display{margin-top:12px}
  .temp-big{font-family:'Bebas Neue',sans-serif;font-size:80px;line-height:1;color:#fff}
  .temp-deg{color:#00d4ff;font-size:42px}
  .temp-feels{font-family:'JetBrains Mono',monospace;font-size:13px;color:#9ca3b0;margin-top:6px}

  .section{margin-bottom:36px}
  .section-title{font-family:'Bebas Neue',sans-serif;font-size:26px;letter-spacing:2px;
    color:#e8eaf0;border-left:3px solid #00d4ff;padding-left:14px;margin-bottom:18px}

  .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
  .stat{background:#111318;border:1px solid #1f2430;border-radius:8px;padding:16px}
  .stat-icon{font-size:20px;margin-bottom:6px}
  .stat-val{font-family:'JetBrains Mono',monospace;font-size:18px;font-weight:600;color:#e8eaf0}
  .stat-lbl{font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-top:4px}

  table{width:100%;border-collapse:collapse;font-family:'JetBrains Mono',monospace;font-size:12px}
  th{text-align:left;color:#6b7280;font-size:10px;letter-spacing:1px;text-transform:uppercase;
    padding:10px 14px;border-bottom:1px solid #1f2430}
  td{padding:12px 14px;border-bottom:1px solid rgba(31,36,48,0.5);color:#9ca3b0}
  tr:last-child td{border-bottom:none}

  .footer{margin-top:48px;padding-top:20px;border-top:1px solid #1f2430;
    font-family:'JetBrains Mono',monospace;font-size:11px;color:#6b7280;
    display:flex;justify-content:space-between}
  @media print{body{padding:20px}@page{margin:0.5in}}
</style>
</head>
<body>
<div class="report">
  <div class="header">
    <div class="header-top">
      <div class="brand">◈ WEATHERSCOPE</div>
      <div class="meta">
        <div>Generated: ${genTime}</div>
        <div>Source: OpenWeatherMap API</div>
        <div>Format: Real-time snapshot</div>
      </div>
    </div>
    <div class="city-block">
      <div class="city-title">${city} <span class="country-tag">${country}</span></div>
      <div class="weather-desc">${desc}</div>
      <div class="temp-display">
        <div class="temp-big">${temp}<span class="temp-deg">°C</span></div>
        <div class="temp-feels">Feels like ${feelsLike}°C</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Current Conditions</div>
    <div class="stats-grid">
      <div class="stat"><div class="stat-icon">💧</div><div class="stat-val">${humidity}%</div><div class="stat-lbl">Humidity</div></div>
      <div class="stat"><div class="stat-icon">💨</div><div class="stat-val">${windSpeed} km/h</div><div class="stat-lbl">Wind Speed</div></div>
      <div class="stat"><div class="stat-icon">⬆</div><div class="stat-val">${pressure} hPa</div><div class="stat-lbl">Pressure</div></div>
      <div class="stat"><div class="stat-icon">👁</div><div class="stat-val">${visibility} km</div><div class="stat-lbl">Visibility</div></div>
      <div class="stat"><div class="stat-icon">🌅</div><div class="stat-val">${sunrise}</div><div class="stat-lbl">Sunrise</div></div>
      <div class="stat"><div class="stat-icon">🌇</div><div class="stat-val">${sunset}</div><div class="stat-lbl">Sunset</div></div>
      <div class="stat"><div class="stat-icon">☁</div><div class="stat-val">${clouds}%</div><div class="stat-lbl">Cloud Cover</div></div>
      <div class="stat"><div class="stat-icon">🌊</div><div class="stat-val">${weather.main.sea_level || pressure} hPa</div><div class="stat-lbl">Sea Level</div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">5-Day Forecast</div>
    <table>
      <thead><tr><th>Day</th><th>High</th><th>Low</th><th>Humidity</th><th>Avg Wind</th></tr></thead>
      <tbody>${dailyRows}</tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">Hourly Breakdown (Next 48h)</div>
    <table>
      <thead><tr><th>Time</th><th>Temp</th><th>Feels Like</th><th>Humidity</th><th>Wind</th></tr></thead>
      <tbody>${hourlyRows}</tbody>
    </table>
  </div>

  <div class="footer">
    <span>WeatherScope — City Weather Intelligence</span>
    <span>${city}, ${country} · ${genTime}</span>
  </div>
</div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `WeatherReport_${city}_${country}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
