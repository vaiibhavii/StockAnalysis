import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import "../styles/StockMiniCard.css";

const miniData = [
   { v: 100 }, { v: 110 }, { v: 105 }, { v: 120 }, { v: 115 }, { v: 130 }, { v: 125 }
];

export default function StockMiniCard({ name, value, change, percent, positive, darkMode }) {
  const theme = {
    cardBg: darkMode ? '#1a1a1a' : 'rgba(255, 255, 255, 0.95)',
    border: darkMode ? '#2a2a2a' : 'rgba(255, 255, 255, 0.2)',
    cardText: darkMode ? '#e5e7eb' : '#1a1a2e',
    cardTextSecondary: darkMode ? '#9ca3af' : '#4a4a6a',
    purple: '#635bff',
  };

  const chartColor = positive ? '#10b981' : '#ef4444';

  return (
    <div
      className="stock-mini-card"
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
      }}
    >
      <div className="card-top-bar" style={{ background: `linear-gradient(90deg, ${theme.purple} 0%, ${theme.purple} 100%)` }} />
      <div className="card-content">
        <div className="card-header">
          <div className="card-info">
            <div className="card-title" style={{ color: theme.cardTextSecondary }}>{name}</div>
            <div className="card-value" style={{ color: theme.cardText }}>{value}</div>
          </div>
          <div className={`card-percent ${positive ? 'positive' : 'negative'}`}>
            {positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {percent}
          </div>
        </div>
        <div className={`card-change ${positive ? 'positive' : 'negative'}`}>{change}</div>
        <div className="sparkline">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={miniData}>
              <defs>
                <linearGradient id={`gradient-${name.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={chartColor}
                strokeWidth={2}
                fill={`url(#gradient-${name.replace(/\s+/g, '-')})`}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}