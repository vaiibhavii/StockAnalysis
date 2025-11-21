import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import Papa from 'papaparse';

const ComparisonWidget = ({ ticker, year, isDark, allTickers }) => {
  // Local state for the two stocks being compared
  // Default Stock A to the global selection, Stock B to NIFTY50
  const [stockA, setStockA] = useState(ticker);
  const [stockB, setStockB] = useState('NIFTY50');
  
  const [traces, setTraces] = useState([]);

  // Sync local state if the global ticker changes
  useEffect(() => {
    setStockA(ticker);
  }, [ticker]);

  useEffect(() => {
    if (!stockA || !stockB || !year) return;

    const fetchCsv = (symbol) => {
      return new Promise((resolve) => {
        Papa.parse(`http://localhost:8000/api/data/${year}_${symbol}.csv`, {
          download: true, header: true, skipEmptyLines: true,
          complete: (res) => resolve(res.data),
          error: () => resolve([])
        });
      });
    };

    Promise.all([fetchCsv(stockA), fetchCsv(stockB)]).then(([dataA, dataB]) => {
      if (!dataA.length || !dataB.length) {
          setTraces([]); 
          return;
      }

      // Normalize function: (Current - Start) / Start * 100
      const normalize = (data) => {
        const startPrice = parseFloat(data[0].close);
        return data.map(r => ((parseFloat(r.close) - startPrice) / startPrice) * 100);
      };

      setTraces([
        {
          x: dataA.map(r => r.date),
          y: normalize(dataA),
          type: 'scatter', mode: 'lines', name: stockA,
          line: { color: '#3b82f6', width: 3 } // Blue for Stock A
        },
        {
          x: dataB.map(r => r.date),
          y: normalize(dataB),
          type: 'scatter', mode: 'lines', name: stockB,
          line: { color: '#fbbf24', width: 3, dash: 'dot' } // Yellow/Gold for Stock B
        }
      ]);
    });
  }, [stockA, stockB, year]);

  // Shared Style for the Dropdowns
  const dropdownStyle = {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-color)', // <--- THEMED BACKGROUND
    color: 'var(--text-main)',          // <--- THEMED TEXT
    cursor: 'pointer',
    outline: 'none',
    fontWeight: '500'
  };

  return (
    <div className="card" style={{ height: '100%' }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px'}}>
          <h3 style={{margin: 0}}>Compare Assets</h3>
          
          {/* --- COMPARISON CONTROLS --- */}
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <select 
                value={stockA} 
                onChange={(e) => setStockA(e.target.value)}
                style={dropdownStyle}
            >
                {allTickers && allTickers.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            
            <span style={{color: 'var(--text-muted)', fontWeight: 'bold'}}>VS</span>

            <select 
                value={stockB} 
                onChange={(e) => setStockB(e.target.value)}
                style={dropdownStyle}
            >
                <option value="NIFTY50">NIFTY 50 (Benchmark)</option>
                {allTickers && allTickers.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
      </div>

      <p style={{color: 'var(--text-muted)', fontSize: '12px', marginTop: '10px'}}>
         Comparison based on % Return for FY {year.replace('_', '-')}
      </p>

      {traces.length > 0 ? (
        <Plot
          data={traces}
          layout={{
            autosize: true,
            margin: { l: 40, r: 20, t: 20, b: 40 },
            paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: isDark ? '#a8c8e8' : '#1f2937' },
            xaxis: { gridcolor: isDark ? '#2e6e9b' : '#e5e7eb' },
            yaxis: { gridcolor: isDark ? '#2e6e9b' : '#e5e7eb', title: '% Return' },
            legend: { orientation: 'h', y: 1.1, font: { size: 14 } }
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '400px' }}
          config={{ displayModeBar: false }}
        />
      ) : (
        <div style={{height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)'}}>
            Loading or No Data Match...
        </div>
      )}
    </div>
  );
};
export default ComparisonWidget;