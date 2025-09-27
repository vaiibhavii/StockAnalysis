// frontend/src/components/TopMovers.jsx
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MoverCard = ({ title, data, isGainer, styles }) => (
  <div style={styles.card}>
    <h3 style={{ ...styles.sectionTitle, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      {isGainer ? (
        <TrendingUp size={20} color="#10b981" />
      ) : (
        <TrendingDown size={20} color="#ef4444" />
      )}
      {title}
    </h3>
    <div>
      {data.map((stock, i) => (
        <div key={i} style={styles.moverItem}>
          <div style={styles.stockInfo}>
            <span style={styles.stockSymbol}>{stock.symbol}</span>
            <span style={styles.stockName}>{stock.name}</span>
          </div>
          <div style={styles.priceInfo}>
            <div style={styles.price}>₹{stock.price}</div>
            <div style={{ ...styles.changeText, color: isGainer ? '#10b981' : '#ef4444' }}>
              {stock.change}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function TopMovers({ isDark, styles, topMovers }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>Top Movers</h2>
      <div style={styles.moversGrid}>
        <MoverCard 
          title="Top Gainers" 
          data={topMovers.gainers} 
          isGainer={true} 
          styles={styles} 
        />
        <MoverCard 
          title="Top Losers" 
          data={topMovers.losers} 
          isGainer={false} 
          styles={styles} 
        />
      </div>
    </section>
  );
}