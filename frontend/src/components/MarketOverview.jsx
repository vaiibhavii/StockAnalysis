// frontend/src/components/MarketOverview.jsx
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

// Helper component for a single market index card
const MarketIndexCard = ({ index, styles }) => {
  // Ensure the index object has the basic properties before rendering
  if (!index || typeof index.value === 'undefined') {
    return <div style={styles.card}><p style={styles.indexName}>---</p><p>Data Error</p></div>;
  }
    
  const hoverStyle = { transform: 'translateY(-2px)', boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.15)' };
  const baseStyle = { transform: 'translateY(0)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' };

  return (
    <div
      style={styles.card}
      onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
      onMouseLeave={(e) => Object.assign(e.currentTarget.style, baseStyle)}
    >
      <p style={styles.indexName}>{index.name}</p>
      <p style={styles.indexValue}>{index.value}</p>
      <div style={styles.changeContainer}>
        {index.isPositive ? (
          <ArrowUp size={16} color={styles.positive.color} />
        ) : (
          <ArrowDown size={16} color={styles.negative.color} />
        )}
        <span style={{
          ...styles.changeText,
          color: index.isPositive ? styles.positive.color : styles.negative.color
        }}>
          {index.change} ({index.percentage})
        </span>
      </div>
    </div>
  );
};


export default function MarketOverview({ isDark, styles, marketIndices, loading }) {
  if (loading) {
    return (
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Market Overview</h2>
        <p>Loading market data...</p>
      </section>
    );
  }

  // If loading is false and we still have no data (i.e., data is missing)
  if (marketIndices.length === 0) {
     return (
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Market Overview</h2>
        <p style={{ color: styles.negative.color }}>Failed to load market data. Check backend console.</p>
      </section>
    );
  }

  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>Market Overview</h2>
      <div style={styles.cardGrid}>
        {marketIndices.map((index, i) => (
          <MarketIndexCard key={index.symbol || i} index={index} styles={styles} />
        ))}
      </div>
    </section>
  );
}