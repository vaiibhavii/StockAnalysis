import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import Papa from 'papaparse';

const VolumeWidget = ({ ticker, year, isDark }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ticker || !year) return;
    setLoading(true);
    
    Papa.parse(`http://localhost:8000/api/data/${year}_${ticker}.csv`, {
      download: true, header: true, skipEmptyLines: true,
      complete: (res) => {
        const d = res.data;
        if(!d || d.length === 0) {
             setChartData([]);
             setLoading(false);
             return;
        }
        
        const colors = d.map(r => (parseFloat(r.close) >= parseFloat(r.open) ? '#10b981' : '#ef4444'));
        setChartData([{
          x: d.map(r => r.date),
          y: d.map(r => r.volume),
          type: 'bar',
          marker: { color: colors }
        }]);
        setLoading(false);
      },
      error: () => {
          setChartData([]);
          setLoading(false);
      }
    });
  }, [ticker, year]);

  const emptyStyle = {
    display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px',
    color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: '8px'
  };

  return (
    <div className="card" style={{ height: '100%' }}>
      <h3>Volume Trends: {ticker}</h3>
      {loading ? (
        <p style={{textAlign:'center', marginTop:'50px'}}>Loading...</p>
      ) : chartData.length > 0 ? (
        <Plot
          data={chartData}
          layout={{
            autosize: true,
            margin: { l: 50, r: 20, t: 20, b: 40 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: isDark ? '#a8c8e8' : '#1f2937' },
            xaxis: { gridcolor: isDark ? '#2e6e9b' : '#e5e7eb' },
            yaxis: { gridcolor: isDark ? '#2e6e9b' : '#e5e7eb', title: 'Volume' }
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '400px' }}
          config={{ displayModeBar: false }}
        />
      ) : (
        <div style={emptyStyle}>
           📉 No Volume Data Found
        </div>
      )}
    </div>
  );
};
export default VolumeWidget;