import React, { useState, useEffect } from 'react';
import './App.css'; 
import Dashboard from './Dashboard';

function App() {
  // Default to Dark Mode (true)
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Apply the data-theme attribute to the <html> tag
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <div className="App">
      <Dashboard toggleTheme={toggleTheme} isDark={isDark} />
    </div>
  );
}

export default App;