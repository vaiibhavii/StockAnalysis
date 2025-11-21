import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import Papa from 'papaparse';

const ChartWidget = ({ isDark }) => {
  const [years, setYears] = useState([]);
  const [tickers, setTickers] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedTicker, setSelectedTicker] = useState('');
  const [chartData, setChartData] = useState([]);

  // 1. Load File List on Mount
  useEffect(() => {
    fetch('http://localhost:8000/api/files')
      .then(res => res.json())
      .then(files => {
        const uniqueYears = new Set();
        const uniqueTickers = new Set();

        files.forEach(f => {
            if(!f.endsWith('.csv')) return;
            const p = f.replace('.csv','').split('_');
            if(p.length >= 3) {
                uniqueYears.add(`${p[0]}_${p[1]}`);
                uniqueTickers.add(p.slice(2).join('_'));
            }
        });

        const sYears = [...uniqueYears].sort();
        const sTickers = [...uniqueTickers].sort();
        setYears(sYears);
        setTickers(sTickers);

        // Auto-Select Defaults
        if(sYears.includes('24_25')) setSelectedYear('24_25');
        else setSelectedYear(sYears[sYears.length-1]);

        if(sTickers.includes('NIFTY50')) setSelectedTicker('NIFTY50');
        else setSelectedTicker(sTickers[0]);
      })
      .catch(err => console.error(err));
  }, []);

  // 2. Instant Fetch when Year or Ticker changes
  useEffect(() => {
    if(!selectedYear || !selectedTicker) return;

    const filename = `${selectedYear}_${selectedTicker}.csv`;
    Papa.parse(`http://localhost:8000/api/data/${filename}`, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (res) => {
            const d = res.data;
            if (!d.length) return;

            setChartData([{
                x: d.map(r => r.date),
                close: d.map(r => r.close),
                high: d.map(r => r.high),
                low: d.map(r => r.low),
                open: d.map(r => r.open),
                decreasing: { line: { color: '#ef4444' } },
                increasing: { line: { color: '#10b981' } },
                line: { color: '#3b82f6' },
                type: 'candlestick'
            }]);
        }
    });
  }, [selectedYear, selectedTicker]);

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Market Chart</h3>
        
        {/* Controls inside the card */}
        <div style={{ display: 'flex', gap: '10px' }}>
            <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
                style={{ 
                    padding: '8px', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-color)',
                    color: 'var(--text-main)'
                }}
            >
                {years.map(y => <option key={y} value={y}>FY {y.replace('_','-')}</option>)}
            </select>

            <select 
                value={selectedTicker} 
                onChange={(e) => setSelectedTicker(e.target.value)}
                style={{ 
                    padding: '8px', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-color)',
                    color: 'var(--text-main)'
                }}
            >
                {tickers.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
        </div>
      </div>
      
      {/* The Chart */}
      <div style={{ height: '85%', width: '100%' }}>
      {chartData.length > 0 ? (
        <Plot
            data={chartData}
            layout={{
                autosize: true,
                margin: { l: 50, r: 20, t: 20, b: 40 },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                font: { color: isDark ? '#a8c8e8' : '#1f2937' },
                xaxis: { 
                    gridcolor: isDark ? '#2e6e9b' : '#e5e7eb', 
                    rangeslider: { visible: false } 
                },
                yaxis: { 
                    gridcolor: isDark ? '#2e6e9b' : '#e5e7eb',
                    zerolinecolor: isDark ? '#2e6e9b' : '#e5e7eb'
                }
            }}
            useResizeHandler={true}
            style={{ width: '100%', height: '100%' }}
            config={{ displayModeBar: false }} // Hides the annoying Plotly toolbar
        />
      ) : (
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%'}}>
            Loading Data...
        </div>
      )}
      </div>
    </div>
  );
};
export default ChartWidget;