// frontend/src/components/Sidebar.jsx
import React from 'react';

export default function Sidebar({ isDark, styles, sidebarOpen, sidebarItems }) {
  const hoverStyle = isDark ? '#374151' : '#f3f4f6';

  return (
    <aside style={styles.sidebar}>
      <div style={styles.sidebarContent}>
        <nav>
          {sidebarItems.map((item, index) => (
            <button
              key={index}
              style={{
                ...styles.navItem,
                ...(item.active ? styles.activeNavItem : {})
              }}
              onMouseEnter={(e) => {
                if (!item.active) {
                  e.target.style.backgroundColor = hoverStyle;
                }
              }}
              onMouseLeave={(e) => {
                if (!item.active) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}


// import "../styles/Sidebar.css";

// export default function Sidebar() {
//   return (
//     <div className="sidebar">
//       <ul>
//         <li>🏠 Dashboard</li>
//         <li>📈 Indices</li>
//         <li>📊 Stocks</li>
//         <li>⚙️ Settings</li>
//       </ul>
//     </div>
//   );
// }
