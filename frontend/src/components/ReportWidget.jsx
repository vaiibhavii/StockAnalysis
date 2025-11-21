import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

const ReportWidget = ({ ticker, year, isDark }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ticker || !year) return;
    setLoading(true);

    Papa.parse(`http://localhost:8000/api/data/${year}_${ticker}.csv`, {
      download: true, header: true, skipEmptyLines: true,
      complete: (res) => {
        if(res.data && res.data.length > 0) {
            setRows(res.data.slice(-10).reverse());
        } else {
            setRows([]);
        }
        setLoading(false);
      },
      error: () => {
          setRows([]);
          setLoading(false);
      }
    });
  }, [ticker, year]);

  return (
    <div className="card">
      <h3>Yearly Report: Last 10 Days</h3>
      <div style={{ overflowX: 'auto', marginTop: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: isDark ? '#a8c8e8' : '#1f2937' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
              <th style={{ padding: '10px' }}>Date</th>
              <th style={{ padding: '10px' }}>Open</th>
              <th style={{ padding: '10px' }}>Close</th>
              <th style={{ padding: '10px' }}>High</th>
              <th style={{ padding: '10px' }}>Low</th>
              <th style={{ padding: '10px' }}>Volume</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
               <tr><td colSpan="6" style={{padding:'20px', textAlign:'center'}}>Loading...</td></tr>
            ) : rows.length > 0 ? (
               rows.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px' }}>{row.date}</td>
                    <td style={{ padding: '10px' }}>{parseFloat(row.open).toFixed(2)}</td>
                    <td style={{ padding: '10px', fontWeight: 'bold', color: row.close >= row.open ? '#10b981' : '#ef4444' }}>
                    {parseFloat(row.close).toFixed(2)}
                    </td>
                    <td style={{ padding: '10px' }}>{parseFloat(row.high).toFixed(2)}</td>
                    <td style={{ padding: '10px' }}>{parseFloat(row.low).toFixed(2)}</td>
                    <td style={{ padding: '10px' }}>{parseInt(row.volume).toLocaleString()}</td>
                </tr>
               ))
            ) : (
               <tr>
                  <td colSpan="6" style={{padding:'30px', textAlign:'center', color:'var(--text-muted)'}}>
                     ❌ No records found for this period.
                  </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ReportWidget;