import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StockWidget from "../components/widgets/StockWidget";
import WatchlistWidget from "../components/widgets/WatchlistWidget";
import TrendsWidget from "../components/widgets/TrendsWidget";

import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="widgets-grid">
          <StockWidget />
          <WatchlistWidget />
          <TrendsWidget />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;