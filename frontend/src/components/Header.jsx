// frontend/src/components/Header.jsx
import React from 'react';
import { Menu, Sun, Moon, TrendingUp, Search, Bell, User } from 'lucide-react';

export default function Header({ isDark, styles, searchQuery, setSearchQuery, toggleTheme, toggleSidebar }) {
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
            placeholder="Search stocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        
        <Button>
          <Bell size={20} />
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