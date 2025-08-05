import React from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StockWidget from "./components/widgets/StockWidget";
import TrendsWidget from "./components/widgets/TrendsWidget";
import WatchlistWidget from "./components/widgets/WatchlistWidget";

function App() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Header />
        <div className="widgets">
          <StockWidget />
          <TrendsWidget />
          <WatchlistWidget />
        </div>
      </div>
    </div>
  );
}

export default App;
