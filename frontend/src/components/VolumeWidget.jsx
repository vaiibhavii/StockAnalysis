import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import Papa from 'papaparse';

const VolumeWidget = ({ ticker, year, isDark }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!ticker || !year) return;
    const filename = `${year}_${ticker}.csv`;
    
    Papa.parse(`http://localhost:8000/api/data/${filename}`, {
      download: true, header: true, skipEmptyLines: true,
      complete: (res) => {
        const d = res.data;
        if(!d.length) return;
        
        const colors = d.map(r => (parseFloat(r.close) >= parseFloat(r.open) ? '#10b981' : '#ef4444'));

        setChartData([{
          x: d.map(r => r.date),
          y: d.map(r => r.volume),
          type: 'bar',
          marker: { color: colors }
        }]);
      }
    });
  }, [ticker, year]);

  return (
    <div className="card" style={{ height: '100%' }}>
      <h3>Volume Trends: {ticker}</h3>
      {chartData.length > 0 ? (
        <Plot
          data={chartData}
          layout={{
            autosize: true,
            margin: { l: 60, r: 20, t: 20, b: 40 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: isDark ? '#a8c8e8' : '#1f2937' },
            xaxis: { 
                gridcolor: isDark ? '#2e6e9b' : '#e5e7eb',
                fixedrange: true // <--- LOCKS ZOOM
            },
            yaxis: { 
                gridcolor: isDark ? '#2e6e9b' : '#e5e7eb', 
                title: 'Volume',
                fixedrange: true // <--- LOCKS ZOOM
            }
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '400px' }}
          config={{ displayModeBar: false, scrollZoom: false }}
        />
      ) : <p>Loading Volume Data...</p>}
    </div>
  );
};
export default VolumeWidget;