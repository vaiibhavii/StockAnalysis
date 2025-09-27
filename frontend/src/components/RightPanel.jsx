

// frontend/src/components/RightPanel.jsx
import React from 'react';
import { Newspaper, Star } from 'lucide-react';

export default function RightPanel({ isDark, styles, newsItems }) {
  const newsHoverStyle = isDark ? '#374151' : '#f9fafb';

  return (
    <div style={styles.rightPanel}>
      {/* Market News */}
      <div style={styles.card}>
        <h3 style={{ ...styles.sectionTitle, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Newspaper size={20} />
          Market News
        </h3>
        <div>
          {newsItems.map((item, i) => (
            <div 
              key={i} 
              style={styles.newsItem}
              onMouseEnter={(e) => e.target.style.backgroundColor = newsHoverStyle}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <p style={styles.newsTitle}>{item.title}</p>
              <p style={styles.newsTime}>{item.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div style={styles.card}>
        <h3 style={{ ...styles.sectionTitle, fontSize: '18px' }}>Quick Stats</h3>
        <div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Market Cap</span>
            <span style={styles.statValue}>₹285.7T</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Volume</span>
            <span style={styles.statValue}>4.2B</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Advances</span>
            <span style={{ ...styles.statValue, color: '#10b981' }}>1,547</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Declines</span>
            <span style={{ ...styles.statValue, color: '#ef4444' }}>892</span>
          </div>
        </div>
      </div>

      {/* Watchlist Preview */}
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ ...styles.sectionTitle, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Star size={20} />
            Watchlist
          </h3>
          <button style={{ color: '#3b82f6', fontSize: '14px', border: 'none', background: 'none', cursor: 'pointer' }}>
            View All
          </button>
        </div>
        <div>
          {['RELIANCE', 'TCS', 'INFY'].map((symbol, i) => (
            <div key={i} style={styles.statItem}>
              <span style={styles.statValue}>{symbol}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={styles.statLabel}>
                  ₹{(Math.random() * 3000 + 1000).toFixed(2)}
                </span>
                <span style={{
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: Math.random() > 0.5 ? '#dcfce7' : '#fee2e2',
                  color: Math.random() > 0.5 ? '#166534' : '#991b1b'
                }}>
                  {Math.random() > 0.5 ? '+' : '-'}{(Math.random() * 3).toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// import "../styles/RightPanel.css";

// export default function RightPanel() {
//   return (
//     <div className="right-panel">
//       <h2>Trending Indices</h2>
//       <ul>
//         <li>Nifty 50</li>
//         <li>Sensex</li>
//         <li>Nifty Bank 25</li>
//         <li>BSE 500</li>
//       </ul>
//     </div>
//   );
// }