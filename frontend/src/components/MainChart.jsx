// frontend/src/components/MainChart.jsx

import React from 'react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, AreaChart, Area // <-- Added Recharts imports
} from 'recharts';

// The rest of your component should remain as provided in the last step.

// ... (rest of the file content)

export default function MainChart({ isDark, styles, chartData, timeframes, activeTimeframe, setActiveTimeframe, chartTitle, loading }) {
  const hoverStyle = isDark ? '#374151' : '#f3f4f6';
  
  if (loading || chartData.length === 0) {
     return (
      <section style={styles.section}>
        <div style={styles.chartContainer}>
          <div style={styles.chartHeader}>
            <h2 style={styles.sectionTitle}>{chartTitle} Chart</h2>
            <div style={styles.timeframeButtons}>
              {timeframes.map((timeframe) => (
                <button
                  key={timeframe}
                  style={{
                    ...styles.timeframeButton,
                    ...(activeTimeframe === timeframe ? styles.activeTimeframe : styles.inactiveTimeframe)
                  }}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>{loading ? 'Fetching chart data...' : 'No historical data available for this period.'}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={styles.section}>
      <div style={styles.chartContainer}>
        <div style={styles.chartHeader}>
          <h2 style={styles.sectionTitle}>{chartTitle} Chart</h2>
          <div style={styles.timeframeButtons}>
            {timeframes.map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setActiveTimeframe(timeframe)}
                style={{
                  ...styles.timeframeButton,
                  ...(activeTimeframe === timeframe ? styles.activeTimeframe : styles.inactiveTimeframe)
                }}
                onMouseEnter={(e) => {
                  if (activeTimeframe !== timeframe) {
                    e.target.style.backgroundColor = hoverStyle;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTimeframe !== timeframe) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }}
              domain={['dataMin', 'dataMax']} // Ensure Y axis adjusts dynamically
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                borderRadius: '8px',
                color: isDark ? '#ffffff' : '#111827'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorPrice)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}



// // frontend/src/components/MainChart.jsx
// import React from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// export default function MainChart({ isDark, styles, chartData, timeframes, activeTimeframe, setActiveTimeframe }) {
//   const hoverStyle = isDark ? '#374151' : '#f3f4f6';
  
//   return (
//     <section style={styles.section}>
//       <div style={styles.chartContainer}>
//         <div style={styles.chartHeader}>
//           <h2 style={styles.sectionTitle}>NIFTY 50 Chart</h2>
//           <div style={styles.timeframeButtons}>
//             {timeframes.map((timeframe) => (
//               <button
//                 key={timeframe}
//                 onClick={() => setActiveTimeframe(timeframe)}
//                 style={{
//                   ...styles.timeframeButton,
//                   ...(activeTimeframe === timeframe ? styles.activeTimeframe : styles.inactiveTimeframe)
//                 }}
//                 onMouseEnter={(e) => {
//                   if (activeTimeframe !== timeframe) {
//                     e.target.style.backgroundColor = hoverStyle;
//                   }
//                 }}
//                 onMouseLeave={(e) => {
//                   if (activeTimeframe !== timeframe) {
//                     e.target.style.backgroundColor = 'transparent';
//                   }
//                 }}
//               >
//                 {timeframe}
//               </button>
//             ))}
//           </div>
//         </div>
        
//         <ResponsiveContainer width="100%" height={300}>
//           <AreaChart data={chartData}>
//             <defs>
//               <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
//                 <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
//               </linearGradient>
//             </defs>
//             <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
//             <XAxis 
//               dataKey="time" 
//               axisLine={false}
//               tickLine={false}
//               tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }}
//             />
//             <YAxis 
//               axisLine={false}
//               tickLine={false}
//               tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }}
//             />
//             <Tooltip 
//               contentStyle={{
//                 backgroundColor: isDark ? '#1f2937' : '#ffffff',
//                 border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
//                 borderRadius: '8px',
//                 color: isDark ? '#ffffff' : '#111827'
//               }}
//             />
//             <Area 
//               type="monotone" 
//               dataKey="price" 
//               stroke="#3b82f6" 
//               strokeWidth={2}
//               fillOpacity={1} 
//               fill="url(#colorPrice)" 
//             />
//           </AreaChart>
//         </ResponsiveContainer>
//       </div>
//     </section>
//   );
// }