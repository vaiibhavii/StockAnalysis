// frontend/src/components/Header.jsx

import React from 'react';
import { Menu, Sun, Moon, TrendingUp, Search, User } from 'lucide-react';

// Status Indicator Component
const StatusIndicator = ({ isLive }) => {
    const color = isLive ? '#10b981' : '#ef4444'; // Green or Red

    return (
        <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: color,
            boxShadow: isLive ? `0 0 5px 2px ${color}80` : 'none', // Subtle glow for live
            transition: 'all 0.3s ease',
            marginRight: '8px' // Space to the right of the indicator
        }} />
    );
};

// Ensure all props are correctly destructured here, including the new handleSearch
export default function Header({ 
  isDark, 
  styles, 
  searchQuery, 
  setSearchQuery, 
  toggleTheme, 
  toggleSidebar, 
  isLive, 
  handleSearch // <-- MUST BE PRESENT
}) {
  const hoverStyle = isDark ? '#374151' : '#f3f4f6';

  const Button = ({ children, onClick, style = {} }) => (
    <button
      onClick={onClick}
      style={{ ...styles.iconButton, ...style }}
      onMouseEnter={(e) => e.target.style.backgroundColor = hoverStyle}
      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
    >
      {children}
    </button>
  );

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  };

  return (
    <header style={styles.header}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Button onClick={toggleSidebar}>
          <Menu size={20} />
        </Button>
        <div style={styles.logo}>
          <TrendingUp size={32} color="#3b82f6" />
          <span>StockPulse</span>
        </div>
      </div>

      <div style={styles.headerRight}>
        <div style={styles.searchContainer}>
          <Search size={16} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search stocks (e.g., TCS or AAPL)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress} 
            style={styles.searchInput}
          />
        </div>
        
        {/* STATUS INDICATOR BUTTON */}
        <Button style={{ display: 'flex', alignItems: 'center', padding: '8px 12px' }}>
          <StatusIndicator isLive={isLive} />
          <span style={{ fontSize: '14px', fontWeight: '600', color: isLive ? styles.positive.color : styles.negative.color }}>
            {isLive ? 'LIVE' : 'MOCK'}
          </span>
        </Button>
        
        <Button onClick={toggleTheme}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
        
        <Button>
          <User size={20} />
        </Button>
      </div>
    </header>
  );
}