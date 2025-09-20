import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import GraphSection from "./GraphSection";
import RightPanel from "./RightPanel";
import "../styles/Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-main">
        <Sidebar />
        <div className="dashboard-content">
          {/* Row 1: Mini stock cards */}
          <div className="mini-cards-row">
            <div className="mini-card">Nifty 50</div>
            <div className="mini-card">Sensex</div>
            <div className="mini-card">Nifty Bank 25</div>
            <div className="mini-card">BSE 500</div>
          </div>

          {/* Row 2: Cards */}
          <div className="cards-row">
            <div className="card">Top Gainers</div>
            <div className="card">Top Losers</div>
            <div className="card">Most Active</div>
          </div>

          {/* Row 3: Graph + Right panel */}
          <div className="bottom-section">
            <GraphSection />
            <RightPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
