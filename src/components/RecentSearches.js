import React from 'react';
import './RecentSearches.css';

export default function RecentSearches({ cities, onSelect }) {
  return (
    <div className="recent fade-up">
      <span className="recent-label">Recent:</span>
      {cities.map(city => (
        <button key={city} className="recent-chip" onClick={() => onSelect(city)}>
          {city}
        </button>
      ))}
    </div>
  );
}
