import { Activity, Menu, X } from 'lucide-react';
import "../styles/Navbar.css";

export default function Navbar({ sidebarOpen, setSidebarOpen, darkMode }) {
  const theme = {
     navBg: darkMode ? 'rgba(10, 10, 10, 0.8)' : 'rgba(99, 91, 255, 0.95)',
     border: darkMode ? '#2a2a2a' : 'rgba(255, 255, 255, 0.2)',
     text: darkMode ? '#e5e7eb' : 'white',
    purpleBg: darkMode ? 'rgba(99, 91, 255, 0.1)' : 'rgba(255, 255, 255, 0.1)',
  };

  return (
    <nav className="navbar" style={{ background: theme.navBg, borderBottom: `1px solid ${theme.border}` }}>
      <div className="navbar-content">
        <div className="navbar-left">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="sidebar-toggle"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="navbar-title-section">
            <Activity size={24} color={theme.text} strokeWidth={2.5} />
            <h1 className="navbar-title" style={{ color: theme.text }}>
              StockFlow
            </h1>
          </div>
        </div>
        <div className="navbar-user" style={{ background: theme.purpleBg, border: `1px solid ${theme.border}`, color: theme.text }}>
          Account
        </div>
      </div>
    </nav>
  );
}