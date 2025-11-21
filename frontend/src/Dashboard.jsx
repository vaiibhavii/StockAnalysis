import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChartWidget from './components/ChartWidget';
import VolumeWidget from './components/VolumeWidget';
import ComparisonWidget from './components/ComparisonWidget';
import ReportWidget from './components/ReportWidget';

const Dashboard = ({ toggleTheme, isDark }) => {
  // --- LAYOUT STATE ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // --- DATA STATE ---
  const [allTickers, setAllTickers] = useState([]);
  const [allYears, setAllYears] = useState([]);
  
  // Global Selections (Driven by Search or Defaults)
  const [selectedTicker, setSelectedTicker] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // --- METRICS STATE (For Top Cards) ---
  const [stats, setStats] = useState({ 
    name: 'Loading...', 
    year: '-', 
    high: 0, 
    low: 0, 
    return: 0, 
    isPositive: true 
  });

  // 1. INITIAL DATA LOAD
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
        
        // --- SET DEFAULTS ---
        // Default to HDFC if available, else Nifty, else First available
        if(sTickers.includes('HDFC')) setSelectedTicker('HDFC');
        else if(sTickers.includes('NIFTY50')) setSelectedTicker('NIFTY50');
        else setSelectedTicker(sTickers[0]);
        
        // Default to latest year (24_25)
        if(sYears.includes('24_25')) setSelectedYear('24_25');
        else setSelectedYear(sYears[sYears.length-1]);
      })
      .catch(err => console.error("Failed to load file list:", err));
  }, []);

  // 2. STATS CALCULATOR (Wrapped in useCallback to stop glitching)
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

  return (
    <div className="dashboard-grid" style={{ 
      gridTemplateColumns: isSidebarOpen ? '260px 1fr' : '80px 1fr', 
      transition: '0.3s ease' 
    }}>
      
      {/* --- SIDEBAR --- */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        toggleTheme={toggleTheme} 
        isDark={isDark}
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <div className="main-content">
        {/* --- HEADER (Handles Search) --- */}
        <Header tickerList={allTickers} onSearch={setSelectedTicker} />
        
        {/* --- TOP STATS CARDS --- */}
        <div className="top-row">
          
          {/* Card 1: Asset Info & Year Selection */}
          <div className="card">
            <div style={{color:'var(--text-muted)', fontSize:'14px'}}>Selected Asset</div>
            <h2 style={{margin:'8px 0', fontSize:'26px'}}>{stats.name}</h2>
            
            {/* THEMED YEAR DROPDOWN */}
            <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)} 
                style={{
                    padding: '6px 10px', 
                    borderRadius: '6px', 
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-color)', // Matches Theme
                    color: 'var(--text-main)',          // Matches Theme
                    outline: 'none',
                    cursor: 'pointer',
                    fontSize: '14px'
                }}
            >
                {allYears.map(y => <option key={y} value={y}>FY {y.replace('_','-')}</option>)}
            </select>
          </div>

          {/* Card 2: Yearly Return */}
          <div className="card">
             <div style={{color:'var(--text-muted)', fontSize:'14px'}}>Yearly Return</div>
             <h2 style={{margin:'10px 0', fontSize:'32px', color: stats.isPositive ? '#10b981' : '#ef4444'}}>
               {stats.isPositive ? '+' : ''}{stats.return}%
             </h2>
             <span style={{fontSize:'12px', color:'var(--text-muted)'}}>Open vs Close</span>
          </div>

          {/* Card 3: High/Low Range */}
          <div className="card">
             <div style={{display:'flex', justifyContent:'space-between', marginBottom:'5px'}}>
                <span style={{color:'var(--text-muted)'}}>High</span> 
                <b style={{color:'#10b981'}}>₹{stats.high}</b>
             </div>
             
             {/* Visual Bar */}
             <div style={{width:'100%', height:'6px', background:'var(--bg-color)', borderRadius:'3px', margin:'10px 0'}}>
                <div style={{width:'100%', height:'100%', background:'linear-gradient(90deg, #ef4444, #10b981)', opacity:0.8, borderRadius:'3px'}}></div>
             </div>

             <div style={{display:'flex', justifyContent:'space-between'}}>
                <span style={{color:'var(--text-muted)'}}>Low</span> 
                <b style={{color:'#ef4444'}}>₹{stats.low}</b>
             </div>
          </div>
        </div>

        {/* --- MAIN WIDGET AREA (Dynamic Tabs) --- */}
        <div className="widgets-grid" style={{ display: 'block' }}>
          
          {activeTab === 'overview' && (
             <ChartWidget 
                isDark={isDark} 
                forcedTicker={selectedTicker} 
                forcedYear={selectedYear} 
                onDataUpdate={handleDataUpdate} 
             />
          )}
          
          {activeTab === 'volume' && (
             <VolumeWidget 
                ticker={selectedTicker} 
                year={selectedYear} 
                isDark={isDark} 
             />
          )}

          {activeTab === 'compare' && (
             <ComparisonWidget 
                ticker={selectedTicker} 
                year={selectedYear} 
                isDark={isDark} 
                allTickers={allTickers} // Passing list for dropdowns
             />
          )}

          {activeTab === 'reports' && (
             <ReportWidget 
                ticker={selectedTicker} 
                year={selectedYear} 
                isDark={isDark} 
             />
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;