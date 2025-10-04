import React, { useState } from 'react'; // <-- This line has been fixed
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import GraphSection from "./GraphSection";
import RightPanel from "./RightPanel";
import StockMiniCard from './StockMiniCard';
import "../styles/Dashboard.css";

const indices = [
  { name: 'S&P 500', value: '4,567.18', change: '+45.82', percent: '+1.01%', positive: true },
  { name: 'Dow Jones', value: '35,431.23', change: '+212.45', percent: '+0.60%', positive: true },
  { name: 'NASDAQ', value: '14,258.49', change: '-89.54', percent: '-0.62%', positive: false },
  { name: 'Russell 2000', value: '2,034.56', change: '+18.32', percent: '+0.91%', positive: true },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const theme = {
    bg: darkMode ? '#0a0a0a' : 'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)',
    cardBg: darkMode ? '#1a1a1a' : 'rgba(255, 255, 255, 0.95)',
    text: darkMode ? '#e5e7eb' : 'white',
    textSecondary: darkMode ? '#9ca3af' : 'rgba(255, 255, 255, 0.9)',
  };

  return (
    <div className="dashboard-container" style={{ background: theme.bg }}>
      <Navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
        isLiveData={false}
      />
      <div className="dashboard-main">
        <Sidebar
          sidebarOpen={sidebarOpen}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
        <main className="dashboard-content">
          <div className="header">
            <h2 style={{ color: theme.text }}>Market Overview</h2>
            <p style={{ color: theme.textSecondary }}>
              Real-time insights and performance metrics
            </p>
          </div>
          <div className="mini-cards-row">
            {indices.map(index => (
              <StockMiniCard key={index.name} {...index} darkMode={darkMode} />
            ))}
          </div>
          <div className="bottom-section">
            <GraphSection darkMode={darkMode} />
            <RightPanel darkMode={darkMode} />
          </div>
        </main>
      </div>
    </div>
  );
}