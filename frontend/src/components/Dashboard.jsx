import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import GraphSection from "./GraphSection";
import RightPanel from "./RightPanel";
import StockMiniCard from "./StockMiniCard";
import Card from "./Card";
import "../styles/Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-main">
        <Sidebar />
        <div className="dashboard-content">
          <div className="mini-cards-row">
            <StockMiniCard name="Nifty 50" />
            <StockMiniCard name="Sensex" />
            <StockMiniCard name="Nifty Bank" />
            <StockMiniCard name="BSE 500" />
          </div>
          <div className="cards-row">
            <Card title="Top Gainers" />
            <Card title="Top Losers" />
            <Card title="Most Active" />
          </div>
          <div className="bottom-section">
            <GraphSection />
            <RightPanel />
          </div>
        </div>
      </div>
    </div>
  );
}