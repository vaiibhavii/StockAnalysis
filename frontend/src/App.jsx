// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MarketOverview from './components/MarketOverview';
import MainChart from './components/MainChart';
import TopMovers from './components/TopMovers';
import RightPanel from './components/RightPanel';
import { 
  TrendingUp, BarChart3, PieChart, Settings, Activity, Eye, Star, Newspaper 
} from 'lucide-react'; 

// IMPORTANT: We use these imports in MainChart and MarketOverview, so ensure the components 
// you created earlier contain their own imports for recharts/lucide-react items.
// We only need the Lucide icons imported here that are used in this file (for the sidebar items).

// --- API CONSTANTS ---
const API_BASE_URL = "http://127.0.0.1:8000";

// Define the tickers for the cards and default chart
const INDEX_TICKERS = [
  { name: 'RELIANCE', symbol: 'RELIANCE.NS' },
  { name: 'HDFC BANK', symbol: 'HDFCBANK.NS' },
  { name: 'TCS', symbol: 'TCS.NS' },
  { name: 'INFOSYS', symbol: 'INFY.NS' },
];
// -----------------------


const StockDashboard = () => {
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTimeframe, setActiveTimeframe] = useState('1M'); 
  const [searchQuery, setSearchQuery] = useState('');
  
  // --- STATE FOR REAL DATA ---
  const [marketIndicesData, setMarketIndicesData] = useState([]);
  const [mainChartData, setMainChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  // ---------------------------

  // --- FALLBACK MOCK DATA ---
  const FALLBACK_INDICES = [
    { name: 'RELIANCE', value: '2,900.50', change: '+55.70', percentage: '+1.96%', isPositive: true, symbol: 'RELIANCE.NS' },
    { name: 'HDFC BANK', value: '1,710.25', change: '-10.15', percentage: '-0.59%', isPositive: false, symbol: 'HDFCBANK.NS' },
    { name: 'TCS', value: '3,550.80', change: '+30.20', percentage: '+0.86%', isPositive: true, symbol: 'TCS.NS' },
    { name: 'INFOSYS', value: '1,500.10', change: '-5.00', percentage: '-0.33%', isPositive: false, symbol: 'INFY.NS' },
  ];

  const generateFallbackChartData = () => {
      const data = [];
      const basePrice = 2800; // Use a high base price for RELIANCE
      for (let i = 0; i < 30; i++) {
          data.push({
              time: `Day ${i + 1}`,
              price: basePrice + Math.random() * 200 + Math.sin(i * 0.5) * 50,
              volume: Math.floor(Math.random() * 100000)
          });
      }
      return data;
  };
  // --- END FALLBACK MOCK DATA ---


  // --- MOCK DATA (Kept for sections we are not integrating yet) ---
  const topMovers = {
    gainers: [
      { symbol: 'RELIANCE', name: 'Reliance Industries', price: '2,456.80', change: '+5.67%' },
      { symbol: 'TCS', name: 'Tata Consultancy Services', price: '3,789.45', change: '+4.23%' },
      { symbol: 'INFY', name: 'Infosys Limited', price: '1,634.20', change: '+3.89%' },
    ],
    losers: [
      { symbol: 'HDFC', name: 'HDFC Bank', price: '1,543.75', change: '-2.45%' },
      { symbol: 'ICICIBANK', name: 'ICICI Bank', price: '987.30', change: '-1.87%' },
      { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: '876.50', change: '-1.65%' },
    ]
  };

  const newsItems = [
    { title: 'Market reaches new highs amid positive sentiment', time: '2 hours ago' },
    { title: 'Tech stocks show strong performance this quarter', time: '4 hours ago' },
    { title: 'Banking sector outlook remains positive', time: '6 hours ago' },
    { title: 'Oil prices impact energy sector stocks', time: '8 hours ago' },
  ];

  const sidebarItems = [
    { icon: BarChart3, label: 'Dashboard', active: true },
    { icon: TrendingUp, label: 'Indices' },
    { icon: Activity, label: 'Stocks' },
    { icon: Eye, label: 'Watchlist' },
    { icon: PieChart, label: 'Portfolio' },
    { icon: Settings, label: 'Settings' },
  ];

  const timeframes = ['1D', '1W', '1M', '1Y', '5Y'];
  // --- END MOCK DATA ---


  // --- DATA FETCHING LOGIC ---
  
  // Helper to convert data from API (price, change) into UI format
  const formatIndexData = (ticker, data) => {
      const isPositive = data.change >= 0;
      const changeText = `${isPositive ? '+' : '-'}${Math.abs(data.change).toFixed(2)}`;
      // Format value with Indian numbering system (e.g., 2,900.50)
      const value = data.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      
      const percentageValue = data.price > 0 ? (Math.abs(data.change) / data.price) * 100 : 0;
      const percentageText = `${isPositive ? '+' : '-'}${percentageValue.toFixed(2)}%`;

      return {
          name: ticker.name,
          value,
          change: changeText,
          percentage: percentageText,
          isPositive,
          symbol: ticker.symbol
      };
  };

  // Fetch index data for all mini cards with fallback
  const fetchMarketIndices = async () => {
    const dataPromises = INDEX_TICKERS.map(async (ticker) => {
        try {
            const url = `${API_BASE_URL}/stocks/latest/${ticker.symbol}`;
            const response = await fetch(url);
            if (!response.ok || response.status === 500) {
                throw new Error("API returned non-OK status");
            }
            const result = await response.json();
            return formatIndexData(ticker, result);
        } catch (e) {
            // console.error(`Failed to fetch ${ticker.symbol}. Loading mock data.`, e);
            return null; 
        }
    });
    
    const results = await Promise.all(dataPromises);
    
    // Check which items failed and replace them with mock data if necessary
    const finalData = results.map((result, i) => {
      return result !== null ? result : FALLBACK_INDICES[i];
    });

    setMarketIndicesData(finalData);
  };
  
  // Fetch data for the main chart (RELIANCE by default) with fallback
  const fetchChartData = async (timeframe) => {
      const symbol = INDEX_TICKERS[0].symbol; // Use RELIANCE.NS for the main chart
      try {
          const url = `${API_BASE_URL}/stocks/historical/${symbol}?period=${timeframe.toLowerCase()}`;
          const response = await fetch(url);
          if (!response.ok || response.status === 500) {
              throw new Error("API returned non-OK status");
          }
          const data = await response.json();
          
          const transformedData = data.map(item => ({
              time: item.trade_date,
              price: item.close_price,
              volume: item.volume
          }));
          
          if (transformedData.length === 0) {
              throw new Error("No data returned from backend.");
          }
          
          setMainChartData(transformedData);
      } catch (e) {
          // console.error("Error fetching chart data. Loading mock data.", e);
          setMainChartData(generateFallbackChartData()); // Load mock data on failure
      }
  };

  useEffect(() => {
    fetchMarketIndices();
    fetchChartData(activeTimeframe);
    setLoading(false);
  }, []); 

  // Re-fetch chart data when the timeframe button is clicked
  useEffect(() => {
      if (!loading) {
          fetchChartData(activeTimeframe);
      }
  }, [activeTimeframe, loading]); 

  const toggleTheme = () => setIsDark(!isDark);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // --- START STYLES OBJECT ---
  // The complete styles object must be placed here.
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: isDark ? '#111827' : '#f9fafb',
      color: isDark ? '#ffffff' : '#111827',
      transition: 'all 0.3s ease',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      height: '64px',
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '20px',
      fontWeight: 'bold'
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    searchContainer: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    },
    searchInput: {
      padding: '8px 12px 8px 40px',
      borderRadius: '8px',
      border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
      backgroundColor: isDark ? '#374151' : '#ffffff',
      color: isDark ? '#ffffff' : '#111827',
      fontSize: '14px',
      width: '240px',
      outline: 'none'
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      color: '#6b7280'
    },
    iconButton: {
      padding: '8px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: 'transparent',
      color: isDark ? '#ffffff' : '#111827',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.2s ease'
    },
    mainLayout: {
      display: 'flex'
    },
    sidebar: {
      width: sidebarOpen ? '256px' : '0',
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderRight: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
      minHeight: 'calc(100vh - 64px)',
      transition: 'width 0.3s ease',
      overflow: 'hidden'
    },
    sidebarContent: {
      padding: '24px',
      width: '256px'
    },
    navItem: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: 'transparent',
      color: isDark ? '#d1d5db' : '#6b7280',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '8px',
      transition: 'all 0.2s ease'
    },
    activeNavItem: {
      backgroundColor: '#3b82f6',
      color: '#ffffff'
    },
    mainContent: {
      flex: 1,
      padding: '24px'
    },
    dashboardGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 300px',
      gap: '24px',
      // We can't use media queries in inline styles, but this indicates the intent:
      // '@media (max-width: 1280px)': {
      //   gridTemplateColumns: '1fr'
      // }
    },
    section: {
      marginBottom: '32px'
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: isDark ? '#ffffff' : '#111827'
    },
    cardGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '16px'
    },
    card: {
      padding: '24px',
      borderRadius: '12px',
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    },
    cardHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.15)'
    },
    indexName: {
      fontSize: '14px',
      color: isDark ? '#9ca3af' : '#6b7280',
      fontWeight: '500',
      marginBottom: '4px'
    },
    indexValue: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: isDark ? '#ffffff' : '#111827',
      marginBottom: '8px'
    },
    changeContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    changeText: {
      fontSize: '14px',
      fontWeight: '500'
    },
    positive: {
      color: '#10b981'
    },
    negative: {
      color: '#ef4444'
    },
    chartContainer: {
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderRadius: '12px',
      border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
      padding: '24px',
      marginBottom: '24px'
    },
    chartHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px'
    },
    timeframeButtons: {
      display: 'flex',
      gap: '8px'
    },
    timeframeButton: {
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    activeTimeframe: {
      backgroundColor: '#3b82f6',
      color: '#ffffff'
    },
    inactiveTimeframe: {
      backgroundColor: 'transparent',
      color: isDark ? '#9ca3af' : '#6b7280'
    },
    moversGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px'
    },
    moverItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: `1px solid ${isDark ? '#374151' : '#f3f4f6'}`
    },
    stockInfo: {
      display: 'flex',
      flexDirection: 'column'
    },
    stockSymbol: {
      fontSize: '14px',
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#111827'
    },
    stockName: {
      fontSize: '12px',
      color: isDark ? '#9ca3af' : '#6b7280'
    },
    priceInfo: {
      textAlign: 'right'
    },
    price: {
      fontSize: '14px',
      fontWeight: '500',
      color: isDark ? '#ffffff' : '#111827'
    },
    rightPanel: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    newsItem: {
      padding: '12px',
      borderRadius: '8px',
      transition: 'background-color 0.2s ease',
      cursor: 'pointer'
    },
    newsTitle: {
      fontSize: '14px',
      fontWeight: '500',
      color: isDark ? '#ffffff' : '#111827',
      marginBottom: '4px',
      lineHeight: '1.4'
    },
    newsTime: {
      fontSize: '12px',
      color: isDark ? '#9ca3af' : '#6b7280'
    },
    statItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0'
    },
    statLabel: {
      fontSize: '14px',
      color: isDark ? '#9ca3af' : '#6b7280'
    },
    statValue: {
      fontSize: '14px',
      fontWeight: '500',
      color: isDark ? '#ffffff' : '#111827'
    }
  };
  // --- END STYLES OBJECT ---


  return (
    <div style={styles.container}>
      <Header
        isDark={isDark}
        styles={styles}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        toggleTheme={toggleTheme}
        toggleSidebar={toggleSidebar}
      />
      <div style={styles.mainLayout}>
        <Sidebar 
          isDark={isDark} 
          styles={styles} 
          sidebarOpen={sidebarOpen} 
          sidebarItems={sidebarItems}
        />
        <main style={styles.mainContent}>
          <div style={styles.dashboardGrid}>
            <div>
              <MarketOverview 
                isDark={isDark} 
                styles={styles} 
                marketIndices={marketIndicesData} 
                loading={loading}
              />
              <MainChart 
                isDark={isDark} 
                styles={styles} 
                chartData={mainChartData} 
                timeframes={timeframes} 
                activeTimeframe={activeTimeframe} 
                setActiveTimeframe={setActiveTimeframe}
                chartTitle={INDEX_TICKERS[0].name}
                loading={loading}
              />
              {/* Top Movers remains mock for the deadline */}
              <TopMovers 
                isDark={isDark} 
                styles={styles} 
                topMovers={topMovers} 
              />
            </div>
            {/* Right Panel remains mock for the deadline */}
            <RightPanel 
              isDark={isDark} 
              styles={styles} 
              newsItems={newsItems} 
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StockDashboard;



// // frontend/src/App.jsx

// import React, { useState, useEffect } from 'react';
// import Header from './components/Header';
// import Sidebar from './components/Sidebar';
// import MarketOverview from './components/MarketOverview';
// import MainChart from './components/MainChart';
// import TopMovers from './components/TopMovers';
// import RightPanel from './components/RightPanel';

// // --- CORRECT CHART IMPORTS ---
// import { 
//   LineChart, 
//   Line, 
//   XAxis, 
//   YAxis, 
//   CartesianGrid, 
//   Tooltip, 
//   ResponsiveContainer, 
//   AreaChart, 
//   Area 
// } from 'recharts';

// // --- CORRECT ICON IMPORTS ---
// import { 
//   TrendingUp, BarChart3, PieChart, Settings, Activity, Eye, Star, Newspaper 
// } from 'lucide-react'; 

// // ... rest of the code

// // --- API CONSTANTS ---
// const API_BASE_URL = "http://127.0.0.1:8000";

// // Define the tickers for the cards and default chart
// // Note: We use specific tickers for the data fetching
// const INDEX_TICKERS = [
//   { name: 'RELIANCE', symbol: 'RELIANCE.NS' },
//   { name: 'HDFC BANK', symbol: 'HDFCBANK.NS' },
//   { name: 'TCS', symbol: 'TCS.NS' },
//   { name: 'INFOSYS', symbol: 'INFY.NS' },
// ];
// // -----------------------


// const StockDashboard = () => {
//   const [isDark, setIsDark] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [activeTimeframe, setActiveTimeframe] = useState('1M'); // Changed default to 1M for data
//   const [searchQuery, setSearchQuery] = useState('');
  
//   // --- STATE FOR REAL DATA ---
//   const [marketIndicesData, setMarketIndicesData] = useState([]);
//   const [mainChartData, setMainChartData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   // ---------------------------

// // frontend/src/App.jsx (Inside StockDashboard component)

// // --- FALLBACK MOCK DATA ---
// const FALLBACK_INDICES = [
//   { name: 'RELIANCE', value: '2,900.50', change: '+55.70', percentage: '+1.96%', isPositive: true, symbol: 'RELIANCE.NS' },
//   { name: 'HDFC BANK', value: '1,710.25', change: '-10.15', percentage: '-0.59%', isPositive: false, symbol: 'HDFCBANK.NS' },
//   { name: 'TCS', value: '3,550.80', change: '+30.20', percentage: '+0.86%', isPositive: true, symbol: 'TCS.NS' },
//   { name: 'INFOSYS', value: '1,500.10', change: '-5.00', percentage: '-0.33%', isPositive: false, symbol: 'INFY.NS' },
// ];

// // Fallback chart data generation function (use the one you already have)
// const generateFallbackChartData = () => {
//     const data = [];
//     const basePrice = 2800; // Use a high base price for RELIANCE
//     for (let i = 0; i < 30; i++) {
//         data.push({
//             time: `Day ${i + 1}`,
//             price: basePrice + Math.random() * 200 + Math.sin(i * 0.5) * 50,
//             volume: Math.floor(Math.random() * 100000)
//         });
//     }
//     return data;
// };

// // --- END FALLBACK MOCK DATA ---

//   // // --- MOCK DATA (Kept for sections we are not integrating yet) ---
//   // const topMovers = {
//   //   gainers: [
//   //     { symbol: 'RELIANCE', name: 'Reliance Industries', price: '2,456.80', change: '+5.67%' },
//   //     { symbol: 'TCS', name: 'Tata Consultancy Services', price: '3,789.45', change: '+4.23%' },
//   //     { symbol: 'INFY', name: 'Infosys Limited', price: '1,634.20', change: '+3.89%' },
//   //   ],
//   //   losers: [
//   //     { symbol: 'HDFC', name: 'HDFC Bank', price: '1,543.75', change: '-2.45%' },
//   //     { symbol: 'ICICIBANK', name: 'ICICI Bank', price: '987.30', change: '-1.87%' },
//   //     { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: '876.50', change: '-1.65%' },
//   //   ]
//   // };

//   const newsItems = [
//     { title: 'Market reaches new highs amid positive sentiment', time: '2 hours ago' },
//     { title: 'Tech stocks show strong performance this quarter', time: '4 hours ago' },
//     { title: 'Banking sector outlook remains positive', time: '6 hours ago' },
//     { title: 'Oil prices impact energy sector stocks', time: '8 hours ago' },
//   ];

//   const sidebarItems = [
//     { icon: BarChart3, label: 'Dashboard', active: true },
//     { icon: TrendingUp, label: 'Indices' },
//     { icon: Activity, label: 'Stocks' },
//     { icon: Eye, label: 'Watchlist' },
//     { icon: PieChart, label: 'Portfolio' },
//     { icon: Settings, label: 'Settings' },
//   ];

//   const timeframes = ['1D', '1W', '1M', '1Y', '5Y'];
//   // --- END MOCK DATA ---

// // frontend/src/App.jsx (Inside StockDashboard component, replace the existing fetch functions)

//   // Fetch index data for all mini cards with fallback
//   const fetchMarketIndices = async () => {
//     const dataPromises = INDEX_TICKERS.map(async (ticker) => {
//         try {
//             const url = `${API_BASE_URL}/stocks/latest/${ticker.symbol}`;
//             const response = await fetch(url);
//             if (!response.ok || response.status === 500) {
//                 // Throw error if response is not 200 OK or is a 500
//                 throw new Error("API returned non-OK status");
//             }
//             const result = await response.json();
//             return formatIndexData(ticker, result);
//         } catch (e) {
//             console.error(`Failed to fetch ${ticker.symbol}. Loading mock data.`, e);
//             // Return null on failure
//             return null; 
//         }
//     });
    
//     const results = await Promise.all(dataPromises);
    
//     // If all fetches failed, use the global fallback data.
//     if (results.every(r => r === null)) {
//         setMarketIndicesData(FALLBACK_INDICES);
//     } else {
//         // Otherwise, use the results that succeeded
//         setMarketIndicesData(results.filter((r, i) => r !== null ? r : FALLBACK_INDICES[i]));
//     }
//   };
  
//   // Fetch data for the main chart (RELIANCE by default) with fallback
//   const fetchChartData = async (timeframe) => {
//       const symbol = INDEX_TICKERS[0].symbol; // Use RELIANCE.NS for the main chart
//       try {
//           const url = `${API_BASE_URL}/stocks/historical/${symbol}?period=${timeframe.toLowerCase()}`;
//           const response = await fetch(url);
//           if (!response.ok || response.status === 500) {
//               throw new Error("API returned non-OK status");
//           }
//           const data = await response.json();
          
//           // Transform API data (close_price, trade_date) to chart format (price, time)
//           const transformedData = data.map(item => ({
//               time: item.trade_date,
//               price: item.close_price,
//               volume: item.volume
//           }));
          
//           if (transformedData.length === 0) {
//               throw new Error("No data returned from backend.");
//           }
          
//           setMainChartData(transformedData);
//       } catch (e) {
//           console.error("Error fetching chart data. Loading mock data.", e);
//           setMainChartData(generateFallbackChartData()); // Load mock data on failure
//       }
//   };

//   // // --- DATA FETCHING LOGIC ---
  
//   // // Helper to convert data from API (price, change) into UI format
//   // const formatIndexData = (ticker, data) => {
//   //     const isPositive = data.change >= 0;
//   //     const changeText = `${isPositive ? '+' : '-'}${Math.abs(data.change).toFixed(2)}`;
//   //     const value = data.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      
//   //     // Calculate a pseudo-percentage for display
//   //     const percentageValue = data.price > 0 ? (Math.abs(data.change) / data.price) * 100 : 0;
//   //     const percentageText = `${isPositive ? '+' : '-'}${percentageValue.toFixed(2)}%`;

//   //     return {
//   //         name: ticker.name,
//   //         value,
//   //         change: changeText,
//   //         percentage: percentageText,
//   //         isPositive,
//   //         symbol: ticker.symbol
//   //     };
//   // };

//   // Fetch index data for all mini cards
//   const fetchMarketIndices = async () => {
//     const dataPromises = INDEX_TICKERS.map(async (ticker) => {
//         try {
//             const url = `${API_BASE_URL}/stocks/latest/${ticker.symbol}`;
//             const response = await fetch(url);
//             if (!response.ok) {
//                 // If fetching data for one index fails, we still try to proceed with others
//                 console.error(`Failed to fetch ${ticker.symbol}: ${response.statusText}`);
//                 return null;
//             }
//             const result = await response.json();
//             return formatIndexData(ticker, result);
//         } catch (e) {
//             console.error(`Error fetching ${ticker.symbol}:`, e);
//             return null;
//         }
//     });
    
//     const results = await Promise.all(dataPromises);
//     setMarketIndicesData(results.filter(r => r !== null));
//   };
  
//   // Fetch data for the main chart (NIFTY 50 by default)
//   const fetchChartData = async (timeframe) => {
//       const symbol = INDEX_TICKERS[0].symbol; // Use NIFTY 50 for the main chart
//       try {
//           const url = `${API_BASE_URL}/stocks/historical/${symbol}?period=${timeframe.toLowerCase()}`;
//           const response = await fetch(url);
//           if (!response.ok) {
//               throw new Error(`Failed to fetch chart data: ${response.statusText}`);
//           }
//           const data = await response.json();
          
//           // Transform API data (close_price, trade_date) to chart format (price, time)
//           const transformedData = data.map(item => ({
//               time: item.trade_date, // x-axis label
//               price: item.close_price, // y-axis value
//               volume: item.volume
//           }));
//           setMainChartData(transformedData);
//       } catch (e) {
//           console.error("Error fetching chart data:", e);
//           setMainChartData([]); // Clear data on error
//       }
//   };

//   useEffect(() => {
//     fetchMarketIndices();
//     // Fetch initial chart data using the default timeframe
//     fetchChartData(activeTimeframe);
//     setLoading(false);
//   }, []); // Run once on component mount

//   // Re-fetch chart data when the timeframe button is clicked
//   useEffect(() => {
//       if (!loading) {
//           fetchChartData(activeTimeframe);
//       }
//   }, [activeTimeframe, loading]); 

//   const toggleTheme = () => setIsDark(!isDark);
//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

//   // --- START STYLES OBJECT ---
//   // IMPORTANT: The complete styles object from your original code must be placed here.
//   // The provided snippet below is just a placeholder, but your file must contain the full object.
//   const styles = {
//     container: {
//       minHeight: '100vh',
//       backgroundColor: isDark ? '#111827' : '#f9fafb',
//       color: isDark ? '#ffffff' : '#111827',
//       transition: 'all 0.3s ease',
//       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
//     },
//     header: { /* ... */ },
//     mainLayout: { display: 'flex' },
//     sidebar: { /* ... */ },
//     sidebarContent: { /* ... */ },
//     navItem: { /* ... */ },
//     activeNavItem: { /* ... */ },
//     mainContent: { flex: 1, padding: '24px' },
//     dashboardGrid: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' },
//     section: { marginBottom: '32px' },
//     sectionTitle: { /* ... */ },
//     cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' },
//     card: {
//       padding: '24px',
//       borderRadius: '12px',
//       backgroundColor: isDark ? '#1f2937' : '#ffffff',
//       border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
//       boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
//       transition: 'all 0.2s ease',
//       cursor: 'pointer'
//     },
//     indexName: { /* ... */ },
//     indexValue: { /* ... */ },
//     changeContainer: { /* ... */ },
//     changeText: { /* ... */ },
//     positive: { color: '#10b981' },
//     negative: { color: '#ef4444' },
//     chartContainer: { /* ... */ },
//     chartHeader: { /* ... */ },
//     timeframeButtons: { /* ... */ },
//     timeframeButton: { /* ... */ },
//     activeTimeframe: { /* ... */ },
//     inactiveTimeframe: { /* ... */ },
//     moversGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' },
//     moverItem: { /* ... */ },
//     stockInfo: { /* ... */ },
//     stockSymbol: { /* ... */ },
//     stockName: { /* ... */ },
//     priceInfo: { /* ... */ },
//     price: { /* ... */ },
//     rightPanel: { display: 'flex', flexDirection: 'column', gap: '24px' },
//     newsItem: { /* ... */ },
//     newsTitle: { /* ... */ },
//     newsTime: { /* ... */ },
//     statItem: { /* ... */ },
//     statLabel: { /* ... */ },
//     statValue: { /* ... */ },
//     // ... all other styles as provided in your original single file ...
//   };
//   // --- END STYLES OBJECT ---


//   return (
//     <div style={styles.container}>
//       <Header
//         isDark={isDark}
//         styles={styles}
//         searchQuery={searchQuery}
//         setSearchQuery={setSearchQuery}
//         toggleTheme={toggleTheme}
//         toggleSidebar={toggleSidebar}
//       />
//       <div style={styles.mainLayout}>
//         <Sidebar 
//           isDark={isDark} 
//           styles={styles} 
//           sidebarOpen={sidebarOpen} 
//           sidebarItems={sidebarItems}
//         />
//         <main style={styles.mainContent}>
//           <div style={styles.dashboardGrid}>
//             <div>
//               {/* Pass the dynamic data here */}
//               <MarketOverview 
//                 isDark={isDark} 
//                 styles={styles} 
//                 marketIndices={marketIndicesData} // <-- DYNAMIC DATA
//                 loading={loading}
//               />
//               {/* Pass the dynamic data and handlers here */}
//               <MainChart 
//                 isDark={isDark} 
//                 styles={styles} 
//                 chartData={mainChartData} // <-- DYNAMIC DATA
//                 timeframes={timeframes} 
//                 activeTimeframe={activeTimeframe} 
//                 setActiveTimeframe={setActiveTimeframe}
//                 chartTitle={INDEX_TICKERS[0].name}
//                 loading={loading}
//               />
//               {/* Top Movers remains mock for the deadline */}
//               <TopMovers 
//                 isDark={isDark} 
//                 styles={styles} 
//                 topMovers={topMovers} 
//               />
//             </div>
//             {/* Right Panel remains mock for the deadline */}
//             <RightPanel 
//               isDark={isDark} 
//               styles={styles} 
//               newsItems={newsItems} 
//             />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default StockDashboard;


// // // frontend/src/App.jsx
// // import React, { useState, useEffect } from 'react';
// // import Header from './components/Header';
// // import Sidebar from './components/Sidebar';
// // import MarketOverview from './components/MarketOverview';
// // import MainChart from './components/MainChart';
// // import TopMovers from './components/TopMovers';
// // import RightPanel from './components/RightPanel';
// // import { TrendingUp, BarChart3, PieChart, Settings, Activity, Eye, Star, Newspaper } from 'lucide-react';

// // const StockDashboard = () => {
// //   const [isDark, setIsDark] = useState(false);
// //   const [sidebarOpen, setSidebarOpen] = useState(true);
// //   const [activeTimeframe, setActiveTimeframe] = useState('1D');
// //   const [searchQuery, setSearchQuery] = useState('');

// //   // --- MOCK DATA (Should be moved to API calls later) ---
// //   const marketIndices = [
// //     { name: 'NIFTY 50', value: '19,674.25', change: '+127.85', percentage: '+0.65%', isPositive: true },
// //     { name: 'SENSEX', value: '65,995.63', change: '+428.75', percentage: '+0.65%', isPositive: true },
// //     { name: 'NASDAQ', value: '13,567.98', change: '-45.32', percentage: '-0.33%', isPositive: false },
// //     { name: 'S&P 500', value: '4,337.44', change: '+12.65', percentage: '+0.29%', isPositive: true },
// //   ];

// //   const topMovers = {
// //     gainers: [
// //       { symbol: 'RELIANCE', name: 'Reliance Industries', price: '2,456.80', change: '+5.67%' },
// //       { symbol: 'TCS', name: 'Tata Consultancy Services', price: '3,789.45', change: '+4.23%' },
// //       { symbol: 'INFY', name: 'Infosys Limited', price: '1,634.20', change: '+3.89%' },
// //     ],
// //     losers: [
// //       { symbol: 'HDFC', name: 'HDFC Bank', price: '1,543.75', change: '-2.45%' },
// //       { symbol: 'ICICIBANK', name: 'ICICI Bank', price: '987.30', change: '-1.87%' },
// //       { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: '876.50', change: '-1.65%' },
// //     ]
// //   };

// //   const newsItems = [
// //     { title: 'Market reaches new highs amid positive sentiment', time: '2 hours ago' },
// //     { title: 'Tech stocks show strong performance this quarter', time: '4 hours ago' },
// //     { title: 'Banking sector outlook remains positive', time: '6 hours ago' },
// //     { title: 'Oil prices impact energy sector stocks', time: '8 hours ago' },
// //   ];

// //   const sidebarItems = [
// //     { icon: BarChart3, label: 'Dashboard', active: true },
// //     { icon: TrendingUp, label: 'Indices' },
// //     { icon: Activity, label: 'Stocks' },
// //     { icon: Eye, label: 'Watchlist' },
// //     { icon: PieChart, label: 'Portfolio' },
// //     { icon: Settings, label: 'Settings' },
// //   ];

// //   const timeframes = ['1D', '1W', '1M', '1Y', '5Y'];

// //   const generateChartData = () => {
// //     const data = [];
// //     const basePrice = 19000;
// //     for (let i = 0; i < 30; i++) {
// //       data.push({
// //         time: i,
// //         price: basePrice + Math.random() * 1000 + Math.sin(i * 0.2) * 300,
// //         volume: Math.random() * 1000000
// //       });
// //     }
// //     return data;
// //   };
// //   const chartData = generateChartData();
// //   // --- END MOCK DATA ---

// //   const toggleTheme = () => setIsDark(!isDark);
// //   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

// //   // Consolidated Style Object passed to all components
// //   const styles = {
// //     container: {
// //       minHeight: '100vh',
// //       backgroundColor: isDark ? '#111827' : '#f9fafb',
// //       color: isDark ? '#ffffff' : '#111827',
// //       transition: 'all 0.3s ease',
// //       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
// //     },
// //     // ... (Keep the full styles object here, but don't output it again)
// //     header: { /* ... */ },
// //     // ... all other styles as provided in your original single file ...
// //     card: {
// //       padding: '24px',
// //       borderRadius: '12px',
// //       backgroundColor: isDark ? '#1f2937' : '#ffffff',
// //       border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
// //       boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
// //       transition: 'all 0.2s ease',
// //       cursor: 'pointer'
// //     },
// //     // ...
// //     // Note: I will only output the final combined JSX and tell the user to put the full styles object here.
// //   };
// //   // Note: For the actual file, ensure the entire styles object from your previous post is defined here.
  
// //   // To avoid writing the massive styles object here, I will structure the component JSX:
// //   return (
// //     <div style={styles.container}>
// //       <Header
// //         isDark={isDark}
// //         styles={styles}
// //         searchQuery={searchQuery}
// //         setSearchQuery={setSearchQuery}
// //         toggleTheme={toggleTheme}
// //         toggleSidebar={toggleSidebar}
// //       />
// //       <div style={styles.mainLayout}>
// //         <Sidebar 
// //           isDark={isDark} 
// //           styles={styles} 
// //           sidebarOpen={sidebarOpen} 
// //           sidebarItems={sidebarItems}
// //         />
// //         <main style={styles.mainContent}>
// //           <div style={styles.dashboardGrid}>
// //             <div>
// //               <MarketOverview 
// //                 isDark={isDark} 
// //                 styles={styles} 
// //                 marketIndices={marketIndices} 
// //               />
// //               <MainChart 
// //                 isDark={isDark} 
// //                 styles={styles} 
// //                 chartData={chartData} 
// //                 timeframes={timeframes} 
// //                 activeTimeframe={activeTimeframe} 
// //                 setActiveTimeframe={setActiveTimeframe} 
// //               />
// //               <TopMovers 
// //                 isDark={isDark} 
// //                 styles={styles} 
// //                 topMovers={topMovers} 
// //               />
// //             </div>
// //             <RightPanel 
// //               isDark={isDark} 
// //               styles={styles} 
// //               newsItems={newsItems} 
// //             />
// //           </div>
// //         </main>
// //       </div>
// //     </div>
// //   );
// // };

// // export default StockDashboard;


// // // import React from "react";
// // // import Dashboard from "./components/Dashboard";

// // // function App() {
// // //   return (
// // //     <div>
// // //       <Dashboard />
// // //     </div>
// // //   );
// // // }

// // // export default App;
