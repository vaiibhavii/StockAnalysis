import React from "react";
import "../styles/RightPanel.css";

export default function RightPanel() {
  return (
    <div className="right-panel">
      <h2>Trending Indices</h2>
      <ul>
        <li>Nifty 50</li>
        <li>Sensex</li>
        <li>Nifty Bank</li>
        <li>BSE 500</li>
      </ul>
    </div>
  );
}