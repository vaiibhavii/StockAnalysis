import { TrendingUp, TrendingDown } from 'lucide-react';
import "../styles/RightPanel.css";

const topMovers = {
   gainers: [
     { name: 'Tesla Inc.', price: '264.35', change: '+8.5%' },
     { name: 'NVIDIA Corp.', price: '485.92', change: '+6.8%' },
     { name: 'Apple Inc.', price: '178.45', change: '+4.2%' },
   ],
   losers: [
     { name: 'Meta Platforms', price: '298.60', change: '-4.2%' },
     { name: 'Amazon.com', price: '134.25', change: '-3.1%' },
     { name: 'Microsoft Corp.', price: '356.80', change: '-2.4%' },
   ],
};

export default function RightPanel({ darkMode }) {
  const theme = {
    cardBg: darkMode ? '#1a1a1a' : 'rgba(255, 255, 255, 0.95)',
    border: darkMode ? '#2a2a2a' : 'rgba(255, 255, 255, 0.2)',
    cardText: darkMode ? '#e5e7eb' : '#1a1a2e',
    cardTextSecondary: darkMode ? '#9ca3af' : '#4a4a6a',
    purpleBg: darkMode ? 'rgba(99, 91, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)',
  };

  return (
    <div className="right-panel" style={{ background: theme.cardBg, border: `1px solid ${theme.border}` }}>
      <h3 style={{ color: theme.cardText }}>Market Movers</h3>
      <div className="movers-section">
        <div className="movers-title" style={{ color: theme.cardTextSecondary }}>Top Gainers</div>
        {topMovers.gainers.map((stock, i) => (
          <div key={stock.name} className="mover-item">
            <div>
              <div className="mover-name" style={{ color: theme.cardText }}>{stock.name}</div>
              <div className="mover-price" style={{ color: theme.cardTextSecondary }}>${stock.price}</div>
            </div>
            <div className="mover-change positive">{stock.change}</div>
          </div>
        ))}
      </div>
      <div className="movers-section">
        <div className="movers-title" style={{ color: theme.cardTextSecondary, marginTop: '1.25rem' }}>Top Losers</div>
        {topMovers.losers.map((stock, i) => (
          <div key={stock.name} className="mover-item">
            <div>
              <div className="mover-name" style={{ color: theme.cardText }}>{stock.name}</div>
              <div className="mover-price" style={{ color: theme.cardTextSecondary }}>${stock.price}</div>
            </div>
            <div className="mover-change negative">{stock.change}</div>
          </div>
        ))}
      </div>
    </div>
  );
}