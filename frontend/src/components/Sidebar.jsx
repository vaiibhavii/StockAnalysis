import React from "react";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Stock Dashboard</h2>
      <ul>
        <li>Dashboard</li>
        <li>Watchlist</li>
        <li>Reports</li>
        <li>Settings</li>
      </ul>
    </div>
  );
};

export default Sidebar;
