import React from "react";
import "../styles/Header.css";
import { FiSearch, FiSun, FiMoon } from "react-icons/fi";

const Header = () => {
  return (
    <div className="header">
      {/* Search bar */}
      <div className="search-box">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Search or type command..." />
      </div>

      {/* Right side: theme toggle + user info */}
      <div className="header-right">
        <button className="theme-toggle">
          <FiSun />
        </button>

        <div className="user-info">
          <img
            src="https://i.pravatar.cc/40?img=10"  // Replace with your own avatar URL or user image logic
            alt="User Avatar"
            className="avatar"
          />
          <span className="username">Musharof</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
