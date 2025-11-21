import React, { useState } from 'react';

const Header = ({ tickerList, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const val = e.target.value.toUpperCase();
    setSearchTerm(val);
    // If user types a valid ticker exactly, select it
    if (tickerList.includes(val)) {
      onSearch(val);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
      <div>
        <h1 style={{ fontSize: '28px', margin: '0 0 5px 0' }}>Market Intel</h1>
        <span style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Historical Analysis Console</span>
      </div>
      
      <div style={{ position: 'relative' }}>
         <input 
            type="text" 
            list="tickers" 
            placeholder="Search Ticker (e.g. RELIANCE)..." 
            value={searchTerm}
            onChange={handleSearch}
            style={{
                padding: '10px 15px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--card-bg)',
                color: 'var(--text-main)',
                width: '250px',
                outline: 'none'
            }}
         />
         {/* Autocomplete Datalist */}
         <datalist id="tickers">
            {tickerList.map(t => <option key={t} value={t} />)}
         </datalist>
      </div>
    </div>
  );
};
export default Header;