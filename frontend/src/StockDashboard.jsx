import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import Papa from 'papaparse';

const StockDashboard = () => {
  // State for dropdown options
  const [years, setYears] = useState([]);
  const [tickers, setTickers] = useState([]);
  
  // State for selections
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedTicker, setSelectedTicker] = useState('');
  
  // State for chart
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Fetch the file list from your Python Backend
  useEffect(() => {
    fetch('http://localhost:8000/api/files')
      .then(response => response.json())
      .then(files => {
        processFilesForDropdowns(files);
      })
      .catch(err => {
        console.error("API Error:", err);
        setError("Could not connect to backend. Is it running?");
      });
  }, []);

  // 2. Process filenames (e.g., "22_23_RELIANCE.csv") into "22_23" and "RELIANCE"
  const processFilesForDropdowns = (files) => {
    const uniqueYears = new Set();
    const uniqueTickers = new Set();

    files.forEach(filename => {
      if (!filename.endsWith('.csv')) return;
      
      const raw = filename.replace('.csv', '');
      const parts = raw.split('_');
      
      // Assuming format: YY_YY_TICKER (e.g., 22_23_RELIANCE)
      if (parts.length >= 3) {
        const yearStr = `${parts[0]}_${parts[1]}`; // "22_23"
        const tickerStr = parts.slice(2).join('_'); // "RELIANCE"
        
        uniqueYears.add(yearStr);
        uniqueTickers.add(tickerStr);
      }
    });

    setYears([...uniqueYears].sort());
    setTickers([...uniqueTickers].sort());
  };

  // 3. Fetch and Parse the CSV when "Analyze" is clicked
  const handleLoadData = () => {
    if (!selectedYear || !selectedTicker) return;

    setLoading(true);
    setError('');
    const filename = `${selectedYear}_${selectedTicker}.csv`;
    
    Papa.parse(`http://localhost:8000/api/data/${filename}`, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data;
        
        if (parsedData.length === 0) {
          setError("File is empty or could not be parsed.");
          setLoading(false);
          return;
        }

        // Map CSV columns to Plotly arrays
        const dates = parsedData.map(row => row.date);
        const close = parsedData.map(row => row.close);
        const high = parsedData.map(row => row.high);
        const low = parsedData.map(row => row.low);
        const open = parsedData.map(row => row.open);

        // Create the Candlestick chart object
        setChartData([{
          x: dates,
          close: close,
          decreasing: { line: { color: '#ff4d4d' } }, // Red for down
          high: high,
          increasing: { line: { color: '#2ecc71' } }, // Green for up
          line: { color: 'rgba(31,119,180,1)' },
          low: low,
          open: open,
          type: 'candlestick',
          xaxis: 'x',
          yaxis: 'y'
        }]);
        setLoading(false);
      },
      error: (err) => {
        setError("Failed to load CSV data.");
        setLoading(false);
      }
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>📊 Historical Stock Dashboard</h2>
      
      {/* Error Message */}
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>⚠️ {error}</div>}

      {/* Controls */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
        
        {/* Year Selector */}
        <select 
          style={{ padding: '8px', fontSize: '16px' }}
          onChange={(e) => setSelectedYear(e.target.value)} 
          value={selectedYear}
        >
          <option value="">Select Year</option>
          {years.map(y => (
            <option key={y} value={y}>FY {y.replace('_', '-')}</option>
          ))}
        </select>

        {/* Ticker Selector */}
        <select 
          style={{ padding: '8px', fontSize: '16px' }}
          onChange={(e) => setSelectedTicker(e.target.value)} 
          value={selectedTicker}
        >
          <option value="">Select Stock</option>
          {tickers.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {/* Action Button */}
        <button 
          onClick={handleLoadData} 
          disabled={!selectedYear || !selectedTicker || loading}
          style={{ 
            padding: '8px 16px', 
            fontSize: '16px', 
            cursor: 'pointer', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px' 
          }}
        >
          {loading ? 'Loading...' : 'Analyze Stock'}
        </button>
      </div>

      {/* Chart Display */}
      {chartData.length > 0 ? (
        <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
          <Plot
            data={chartData}
            layout={{
              width: 1000, 
              height: 600, 
              title: `${selectedTicker} (${selectedYear.replace('_', '-')})`,
              xaxis: { 
                rangeslider: { visible: false },
                title: 'Date'
              },
              yaxis: { 
                title: 'Price (INR)',
                autorange: true 
              }
            }}
          />
        </div>
      ) : (
        <p style={{ color: '#666' }}>Select a Year and Stock to view the chart.</p>
      )}
    </div>
  );
};

export default StockDashboard;