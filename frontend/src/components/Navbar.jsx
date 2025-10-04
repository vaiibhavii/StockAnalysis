import { Activity } from 'lucide-react';
import "../styles/Navbar.css";

export default function Navbar({ sidebarOpen, setSidebarOpen, darkMode, isLiveData }) {
  const theme = {
    navBg: darkMode ? 'rgba(10, 10, 10, 0.8)' : 'rgba(99, 91, 255, 0.95)',
    border: darkMode ? '#2a2a2a' : 'rgba(255, 255, 255, 0.2)',
    text: darkMode ? '#e5e7eb' : 'white',
    purpleBg: darkMode ? 'rgba(99, 91, 255, 0.1)' : 'rgba(255, 255, 255, 0.1)',
  };

  return (
    <nav className="navbar" style={{ background: theme.navBg, borderBottom: `1px solid ${theme.border}` }}>
      <div className="navbar-content">
        {/* Changed this from a button to a div for cleaner styling */}
        <div className="navbar-title-section" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Activity size={24} color={theme.text} strokeWidth={2.5} />
          <h1 className="navbar-title" style={{ color: theme.text }}>
            StockFlow
          </h1>
        </div>

        <div className="navbar-right">
          <div className={`status-dot ${isLiveData ? 'live' : 'mock'}`} />
          <div className="navbar-user" style={{ background: theme.purpleBg, border: `1px solid ${theme.border}`, color: theme.text }}>
            Account
          </div>
        </div>
      </div>
    </nav>
  );
}