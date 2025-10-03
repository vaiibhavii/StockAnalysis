import React from "react";
import "../styles/Sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li className="active">🏠 Dashboard</li>
        <li>📈 Indices</li>
        <li>📊 Stocks</li>
        <li>⚙️ Settings</li>
      </ul>
    </div>
  );
}