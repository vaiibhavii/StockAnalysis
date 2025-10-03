import { Home, BarChart3, PieChart, Settings, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import "../styles/Sidebar.css";

export default function Sidebar({ sidebarOpen, darkMode, setDarkMode }) {
  const [activeSidebar, setActiveSidebar] = useState('dashboard');

  const theme = {
     border: darkMode ? '#2a2a2a' : 'rgba(255, 255, 255, 0.2)',
     text: darkMode ? '#778bb2ff' : 'white',
     textMuted: darkMode ? '#6b7280' : 'rgba(255, 255, 255, 0.7)',
     sidebarBg: darkMode ? '#1a1a1a' : 'rgba(255, 255, 255, 0.1)',
     hoverBg: darkMode ? '#2a2a2a' : 'rgba(255, 255, 255, 0.15)',
     purple: '#635bff',
     purpleBg: darkMode ? 'rgba(99, 91, 255, 0.1)' : 'rgba(255, 255, 255, 0.1)',
  };

  const handleSettingsClick = () => {
     if (activeSidebar === 'settings') {
       setActiveSidebar('dashboard');
     } else {
       setActiveSidebar('settings');
     }
  };

  return (
    <aside
      className="sidebar"
      style={{
        width: sidebarOpen ? '240px' : '0',
        padding: sidebarOpen ? '2rem 1rem' : '0',
        borderRight: sidebarOpen ? `1px solid ${theme.border}` : 'none',
        background: theme.sidebarBg,
      }}
    >
      {sidebarOpen && (
        <nav>
          {[
            { id: 'dashboard', icon: Home, label: 'Dashboard' },
            { id: 'indices', icon: BarChart3, label: 'Indices' },
            { id: 'stocks', icon: PieChart, label: 'Stocks' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => item.id === 'settings' ? handleSettingsClick() : setActiveSidebar(item.id)}
              className="sidebar-button"
              style={{
                background: activeSidebar === item.id ? theme.purpleBg : 'transparent',
                border: activeSidebar === item.id ? `1px solid ${theme.border}` : '1px solid transparent',
                color: activeSidebar === item.id ? theme.text : theme.textMuted,
              }}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}

          {activeSidebar === 'settings' && (
            <div className="settings-panel" style={{ background: theme.purpleBg, border: `1px solid ${theme.border}` }}>
              <div className="settings-title" style={{ color: theme.textMuted }}>
                Preferences
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="dark-mode-toggle"
                style={{
                  background: darkMode ? theme.purple : 'rgba(255, 255, 255, 0.2)',
                  border: `1px solid ${darkMode ? theme.purple : theme.border}`,
                  color: theme.text,
                }}
              >
                <span>
                  {darkMode ? <Moon size={16} /> : <Sun size={16} />}
                  Dark Mode
                </span>
                <div className="toggle-switch" style={{ background: darkMode ? theme.purple : 'rgba(255, 255, 255, 0.3)' }}>
                  <div className="toggle-indicator" style={{ left: darkMode ? '20px' : '2px' }} />
                </div>
              </button>
            </div>
          )}
        </nav>
      )}
    </aside>
  );
}