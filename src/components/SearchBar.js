import React, { useState } from 'react';
import './SearchBar.css';

export default function SearchBar({ onSearch, loading }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) onSearch(input.trim());
  };

  return (
    <form className="search-wrapper fade-up fade-up-1" onSubmit={handleSubmit}>
      <div className="search-bar">
        <span className="search-icon">⌕</span>
        <input
          className="search-input"
          type="text"
          placeholder="Enter city name — e.g. Mumbai, Tokyo, Berlin..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
          autoFocus
        />
        <button className="search-btn" type="submit" disabled={loading || !input.trim()}>
          {loading ? <span className="btn-spinner" /> : 'SEARCH'}
        </button>
      </div>
    </form>
  );
}
