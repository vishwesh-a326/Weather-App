# ◈ WeatherScope — City Weather Dashboard

A production-grade React weather application with real-time data, interactive charts, and downloadable HTML reports.

## Features
- 🔍 **City Search** with recent search history
- 🌡️ **Real-time weather** via OpenWeatherMap API
- 📊 **4 interactive charts** (Temperature trend, Humidity, Wind Speed, 5-Day Forecast)
- 📋 **Daily Summary Table** with high/low/humidity/wind
- 📥 **Download Report** — styled HTML report with full data
- 💅 Dark industrial aesthetic with animations

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

## Project Structure

```
weather-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── SearchBar.js / .css
│   │   ├── RecentSearches.js / .css
│   │   └── WeatherDashboard.js / .css
│   ├── utils/
│   │   └── reportGenerator.js
│   ├── App.js / App.css
│   ├── index.js
│   └── index.css
└── package.json
```

## API Key
The app uses OpenWeatherMap API. The key is pre-configured in `src/App.js`.
To use your own key, replace the value of `API_KEY` in `src/App.js`.

## Tech Stack
- **React 18**
- **Recharts** — charts & graphs
- **OpenWeatherMap API** — weather data
- **CSS custom properties** — theming
- **Bebas Neue + DM Sans + JetBrains Mono** — typography
