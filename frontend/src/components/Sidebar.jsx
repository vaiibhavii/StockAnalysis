import React from "react";
import "../styles/Sidebar.css";
import { FaChartBar, FaUser, FaTasks, FaTable, FaFileAlt, FaRegCalendar } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { NavLink } from "react-router-dom"; // Optional if using routing

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>📊 TailAdmin</h2>
      </div>

      <ul className="sidebar-menu">
        <li>
          <MdOutlineDashboard className="icon" />
          <span>Dashboard</span>
        </li>
        <li>
          <FaChartBar className="icon" />
          <span>Analytics</span>
        </li>
        <li>
          <FaRegCalendar className="icon" />
          <span>Calendar</span>
        </li>
        <li>
          <FaUser className="icon" />
          <span>User Profile</span>
        </li>
        <li>
          <FaTasks className="icon" />
          <span>Tasks</span>
        </li>
        <li>
          <FaTable className="icon" />
          <span>Tables</span>
        </li>
        <li>
          <FaFileAlt className="icon" />
          <span>Reports</span>
        </li>
      </ul>

      <div className="sidebar-footer">
        <p>Support</p>
      </div>
    </div>
  );
};

export default Sidebar;
