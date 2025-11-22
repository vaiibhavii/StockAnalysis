import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChartWidget from './components/ChartWidget';
import VolumeWidget from './components/VolumeWidget';
import ComparisonWidget from './components/ComparisonWidget';
import ReportWidget from './components/ReportWidget';

const Dashboard = ({ toggleTheme, isDark }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [allTickers, setAllTickers] = useState([]);
  const [allYears, setAllYears] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [stats, setStats] = useState({ name: '-', year: '-', high: 0, low: 0, return: 0, isPositive: true });

  useEffect(() => {
    fetch('http://localhost:8000/api/files')
      .then(res => res.json())
      .then(files => {
        const yearsSet = new Set();
        const tickersSet = new Set();
        files.forEach(f => {
          if(!f.endsWith('.csv')) return;
          const p = f.replace('.csv','').split('_');
          if(p.length >= 3) {
            yearsSet.add(`${p[0]}_${p[1]}`);
            tickersSet.add(p.slice(2).join('_'));
          }
        });
        const sTickers = [...tickersSet].sort();
        const sYears = [...yearsSet].sort();
        setAllTickers(sTickers);
        setAllYears(sYears);
        
        if(sTickers.includes('HDFC')) setSelectedTicker('HDFC');
        else if(sTickers.includes('NIFTY50')) setSelectedTicker('NIFTY50');
        else setSelectedTicker(sTickers[0]);
        
        if(sYears.includes('24_25')) setSelectedYear('24_25');
        else setSelectedYear(sYears[sYears.length-1]);
      })
      .catch(err => console.error(err));
  }, []);

  const handleDataUpdate = useCallback((data, ticker, year) => {
    if (!data || data.length === 0) return;
    const highs = data.map(row => parseFloat(row.high || 0));
    const lows = data.map(row => parseFloat(row.low || 0));
    const first = parseFloat(data[0].open || 0);
    const last = parseFloat(data[data.length-1].close || 0);
    const diff = last - first;
    setStats({
      name: ticker,
      year: year.replace('_','-'),
      high: Math.max(...highs).toFixed(2),
      low: Math.min(...lows).toFixed(2),
      return: first !== 0 ? ((diff/first)*100).toFixed(2) : "0.00",
      isPositive: diff >= 0
    });
  }, []);

  const handleExport = () => {
    if (!selectedTicker || !selectedYear) return;
    const filename = `${selectedYear}_${selectedTicker}.csv`;
    const fileUrl = `http://localhost:8000/api/data/${filename}`;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="dashboard-grid" style={{ 
      gridTemplateColumns: isSidebarOpen ? '260px 1fr' : '80px 1fr', 
      transition: '0.3s ease' 
    }}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        toggleTheme={toggleTheme} isDark={isDark}
        activeTab={activeTab} setActiveTab={setActiveTab} 
      />
      
      <div className="main-content">
        <Header tickerList={allTickers} onSearch={setSelectedTicker} />
        
        <div className="top-row">
          <div className="card">
            <div style={{color:'var(--text-muted)', fontSize:'14px'}}>Selected Asset</div>
            <h2 style={{margin:'8px 0', fontSize:'26px'}}>{stats.name}</h2>
            <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)} 
                style={{
                    padding: '6px 10px', borderRadius: '6px', 
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', 
                    outline: 'none', cursor: 'pointer', fontSize: '14px'
                }}
            >
                {allYears.map(y => <option key={y} value={y}>FY {y.replace('_','-')}</option>)}
            </select>
          </div>
          <div className="card">
             <div style={{color:'var(--text-muted)', fontSize:'14px'}}>Yearly Return</div>
             <h2 style={{margin:'10px 0', fontSize:'32px', color: stats.isPositive ? '#10b981' : '#ef4444'}}>
               {stats.isPositive ? '+' : ''}{stats.return}%
             </h2>
             <span style={{fontSize:'12px', color:'var(--text-muted)'}}>Open vs Close</span>
          </div>
          <div className="card">
             <div style={{display:'flex', justifyContent:'space-between', marginBottom:'5px'}}>
                <span style={{color:'var(--text-muted)'}}>High</span> <b style={{color:'#10b981'}}>₹{stats.high}</b>
             </div>
             <div style={{width:'100%', height:'6px', background:'var(--bg-color)', borderRadius:'3px', margin:'10px 0'}}>
                <div style={{width:'100%', height:'100%', background:'linear-gradient(90deg, #ef4444, #10b981)', opacity:0.8, borderRadius:'3px'}}></div>
             </div>
             <div style={{display:'flex', justifyContent:'space-between'}}>
                <span style={{color:'var(--text-muted)'}}>Low</span> <b style={{color:'#ef4444'}}>₹{stats.low}</b>
             </div>
          </div>
        </div>

        <div className="widgets-grid" style={{ 
             display: activeTab === 'reports' ? 'block' : 'grid',
             gridTemplateColumns: activeTab === 'reports' ? '1fr' : 'minmax(0, 2fr) minmax(0, 1fr)',
             gap: '24px'
        }}>
          
          <div style={{ minWidth: 0 }}>
            {activeTab === 'overview' && (
               <ChartWidget 
                 isDark={isDark} 
                 forcedTicker={selectedTicker} 
                 forcedYear={selectedYear} 
                 onDataUpdate={handleDataUpdate}
                 isSidebarOpen={isSidebarOpen} // <--- PASSED PROP HERE
               />
            )}
            {activeTab === 'volume' && (
               <VolumeWidget ticker={selectedTicker} year={selectedYear} isDark={isDark} />
            )}
            {activeTab === 'compare' && (
               <ComparisonWidget ticker={selectedTicker} year={selectedYear} isDark={isDark} allTickers={allTickers} />
            )}
            {activeTab === 'reports' && (
               <ReportWidget ticker={selectedTicker} year={selectedYear} isDark={isDark} />
            )}
          </div>

          {activeTab !== 'reports' && (
             <div className="card">
                <h3>Analysis</h3>
                <div style={{ marginTop: '20px', color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '14px' }}>
                   <p>
                     Historical performance for <b>{stats.name}</b> during fiscal year <b>{stats.year}</b>.
                   </p>
                   <ul style={{ paddingLeft: '20px', marginTop: '15px' }}>
                      <li style={{ marginBottom: '10px' }}>
                         Trend: <b style={{ color: stats.isPositive ? '#10b981' : '#ef4444' }}>{stats.isPositive ? 'Bullish ▲' : 'Bearish ▼'}</b>
                      </li>
                      <li style={{ marginBottom: '10px' }}>Peak Value: <b>₹{stats.high}</b></li>
                      <li style={{ marginBottom: '10px' }}>Lowest Dip: <b>₹{stats.low}</b></li>
                   </ul>
                </div>

                <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
                    <h4 style={{ margin: '0 0 15px 0' }}>Quick Actions</h4>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={handleExport} style={{ flex: 1, padding: '10px', background: 'var(--accent-blue)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Export CSV</button>
                        <button onClick={handlePrint} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--accent-blue)', color: 'var(--accent-blue)', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Print</button>
                    </div>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;