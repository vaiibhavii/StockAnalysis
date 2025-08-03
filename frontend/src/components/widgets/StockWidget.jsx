import React from "react";
import "./Widget.css";

const StockWidget = () => {
  return (
    <div className="widget">
      <h3>Stock Overview</h3>
      <p>🟢 AAPL: $175.12</p>
      <p>🔴 TSLA: $245.30</p>
    </div>
  );
};

export default StockWidget;
