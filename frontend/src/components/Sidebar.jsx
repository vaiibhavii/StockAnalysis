import React from 'react';

const Sidebar = ({ isOpen, toggleSidebar, toggleTheme, isDark, activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'volume', icon: '📉', label: 'Volume Trends' },
    { id: 'compare', icon: '⚖️', label: 'Comparisons' },
    { id: 'reports', icon: '📑', label: 'Yearly Reports' },
  ];

  return (
    <div style={{ 
      backgroundColor: 'var(--sidebar-bg)', 
      borderRight: '1px solid var(--border-color)', 
      padding: '20px', 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%', 
      height: '100vh', 
      boxSizing: 'border-box',
      transition: 'width 0.3s ease',
      overflow: 'hidden',
      color: 'var(--text-main)' // Ensure text inherits theme color
    }}>
      
      {/* --- Header & Collapse --- */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: isOpen ? 'space-between' : 'center', marginBottom: '40px' }}>
        {isOpen && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             {/* Small Logo Circle */}
             <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}></div>
             <h2 style={{ margin: 0, fontSize: '18px', whiteSpace: 'nowrap' }}>Market Intel</h2>
          </div>
        )}
        <button onClick={toggleSidebar} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize: '18px' }}>
          {isOpen ? '◀' : '▶'}
        </button>
      </div>

      {/* --- Menu Items --- */}
      <ul style={{ listStyle: 'none', padding: 0, flex: 1 }}>
        {menuItems.map((item) => (
          <li key={item.id} 
            onClick={() => setActiveTab(item.id)}
            style={{ 
              padding: '12px', 
              cursor: 'pointer', 
              color: activeTab === item.id ? 'var(--text-main)' : 'var(--text-muted)',
              fontWeight: activeTab === item.id ? 'bold' : 'normal',
              backgroundColor: activeTab === item.id ? 'var(--bg-color)' : 'transparent',
              marginBottom: '8px', 
              borderRadius: '8px',
              display: 'flex', 
              gap: '12px', 
              justifyContent: isOpen ? 'flex-start' : 'center',
              alignItems: 'center',
              whiteSpace: 'nowrap'
          }}>
            <span style={{ fontSize: '18px' }}>{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </li>
        ))}
      </ul>

      {/* --- Bottom: Theme Toggle --- */}
      <div style={{ 
          borderTop: '1px solid var(--border-color)', 
          paddingTop: '20px',
          display: 'flex',
          flexDirection: isOpen ? 'row' : 'column', // Stack if closed
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '10px',
          whiteSpace: 'nowrap' // Prevent text wrapping
      }}>
        {isOpen && (
           <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>
             {isDark ? 'Dark Mode' : 'Light Mode'}
           </span>
        )}
        
        <label className="theme-switch">
          <input type="checkbox" checked={isDark} onChange={toggleTheme} />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  );
};

export default Sidebar;