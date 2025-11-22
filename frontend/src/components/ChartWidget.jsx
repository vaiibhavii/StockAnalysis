import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import Papa from 'papaparse';

// Added isSidebarOpen to props
const ChartWidget = ({ isDark, forcedTicker, forcedYear, onDataUpdate, isSidebarOpen }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(!forcedTicker || !forcedYear) return;
    
    setLoading(true);
    setChartData([]); 

    Papa.parse(`http://localhost:8000/api/data/${forcedYear}_${forcedTicker}.csv`, {
        download: true, header: true, skipEmptyLines: true,
        complete: (res) => {
            const d = res.data;
            if (!d || d.length === 0) {
                setLoading(false);
                return;
            }

            if (onDataUpdate) onDataUpdate(d, forcedTicker, forcedYear);

            setChartData([{
                x: d.map(r => r.date),
                close: d.map(r => r.close),
                high: d.map(r => r.high),
                low: d.map(r => r.low),
                open: d.map(r => r.open),
                decreasing: { line: { color: '#ef4444' } },
                increasing: { line: { color: '#10b981' } },
                type: 'candlestick'
            }]);
            setLoading(false);
        },
        error: () => setLoading(false)
    });
  }, [forcedTicker, forcedYear, onDataUpdate]);

  // --- FIXED RESIZE LOGIC ---
  useEffect(() => {
    // 1. Trigger immediately in case it's a data load
    window.dispatchEvent(new Event('resize'));

    // 2. Set a timeout to trigger AGAIN after the sidebar animation (300ms) finishes
    const timer = setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 350); // 350ms to be safe

    return () => clearTimeout(timer);
  }, [chartData, isSidebarOpen]); // Runs when data changes OR sidebar toggles

  const emptyStateStyle = {
    display: 'flex', justifyContent: 'center', alignItems: 'center', 
    height: '100%', color: 'var(--text-muted)', fontSize: '14px', 
    background: 'rgba(0,0,0,0.02)', borderRadius: '8px'
  };

  return (
    <div className="card" style={{height: '500px', position: 'relative'}}>
      <h3>Price History: {forcedTicker}</h3>
      
      <div style={{ height: '90%', width: '100%' }}>
        {loading ? (
           <div style={emptyStateStyle}>Loading Chart...</div>
        ) : chartData.length > 0 ? (
           <Plot
              data={chartData}
              layout={{
                  autosize: true,
                  paper_bgcolor: 'rgba(0,0,0,0)', 
                  plot_bgcolor: 'rgba(0,0,0,0)',
                  font: { color: isDark ? '#a8c8e8' : '#1f2937' },
                  xaxis: { 
                    gridcolor: isDark ? '#2e6e9b' : '#e5e7eb', 
                    rangeslider: { visible: false },
                    fixedrange: true,
                    automargin: true
                  },
                  yaxis: { 
                    gridcolor: isDark ? '#2e6e9b' : '#e5e7eb',
                    fixedrange: true,
                    automargin: true
                  },
                  margin: { l: 50, r: 20, t: 30, b: 40 },
              }}
              useResizeHandler={true}
              style={{ width: '100%', height: '100%' }}
              config={{ displayModeBar: false, scrollZoom: false }}
           />
        ) : (
           <div style={emptyStateStyle}>
              ❌ No Price Data Available for {forcedYear}
           </div>
        )}
      </div>
    </div>
  );
};
export default ChartWidget;