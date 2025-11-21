import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// This finds the <div id="root"> in your index.html and puts the App inside it
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);