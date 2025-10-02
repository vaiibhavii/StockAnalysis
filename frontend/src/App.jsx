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

// --- API CONSTANTS ---
const API_BASE_URL = "http://127.0.0.1:8000";

// Define the tickers for the cards and default chart (Using stable US tickers for final delivery)
const INDEX_TICKERS = [
  { name: 'APPLE', symbol: 'AAPL' },
  { name: 'MICROSOFT', symbol: 'MSFT' },
  { name: 'GOOGLE', symbol: 'GOOGL' },
  { name: 'AMAZON', symbol: 'AMZN' },
];
// -----------------------


const StockDashboard = () => {
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTimeframe, setActiveTimeframe] = useState('1mo'); // Fixed: Initialized to valid yfinance string
  const [searchQuery, setSearchQuery] = useState('');
  
  // --- STATE FOR LIVE STATUS AND ACTIVE SYMBOL ---
  const [isLive, setIsLive] = useState(false); 
  const [activeSymbol, setActiveSymbol] = useState(INDEX_TICKERS[0].symbol); 
  // ---------------------------
  
  const [marketIndicesData, setMarketIndicesData] = useState([]);
  const [mainChartData, setMainChartData] = useState([]);
  const [loading, setLoading] = useState(true);


  // --- FALLBACK MOCK DATA ---
  const getCurrentFormattedTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };
  const getCurrentFormattedDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  const FALLBACK_TIME = getCurrentFormattedTime();
  const FALLBACK_DATE = getCurrentFormattedDate();
  
  const FALLBACK_INDICES = [
    { name: 'APPLE', value: '190.50', change: '+2.70', percentage: '+1.44%', isPositive: true, symbol: 'AAPL', time: FALLBACK_TIME, date: FALLBACK_DATE },
    { name: 'MICROSOFT', value: '430.25', change: '-1.15', percentage: '-0.26%', isPositive: false, symbol: 'MSFT', time: FALLBACK_TIME, date: FALLBACK_DATE },
    { name: 'GOOGLE', value: '180.80', change: '+0.90', percentage: '+0.50%', isPositive: true, symbol: 'GOOGL', time: FALLBACK_TIME, date: FALLBACK_DATE },
    { name: 'AMAZON', value: '185.10', change: '-0.30', percentage: '-0.16%', isPositive: false, symbol: 'AMZN', time: FALLBACK_TIME, date: FALLBACK_DATE },
  ];

  const generateFallbackChartData = () => {
      const data = [];
      const basePrice = 180; 
      for (let i = 0; i < 30; i++) {
          data.push({
              time: `Day ${i + 1}`,
              price: basePrice + Math.random() * 10 + Math.sin(i * 0.5) * 5,
              volume: Math.floor(Math.random() * 100000)
          });
      }
      return data;
  };
  // --- END FALLBACK MOCK DATA ---


  // --- MOCK DATA (Other sections) ---
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

  const timeframes = [
    { label: '1D', period: '1d' }, 
    { label: '1W', period: '5d' }, 
    { label: '1M', period: '1mo' }, 
    { label: '3M', period: '3mo' }, 
    { label: '1Y', period: '1y' }, 
    { label: '5Y', period: '5y' }
];
  // --- END MOCK DATA ---


  // Helper to convert data from API (price, change) into UI format
  const formatIndexData = (ticker, data) => {
      const isPositive = data.change >= 0;
      const changeText = `${isPositive ? '+' : '-'}${Math.abs(data.change).toFixed(2)}`;
      const value = data.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      
      const percentageValue = data.price > 0 ? (Math.abs(data.change) / data.price) * 100 : 0;
      const percentageText = `${isPositive ? '+' : '-'}${percentageValue.toFixed(2)}%`;

      return {
          name: ticker.name,
          value,
          change: changeText,
          percentage: percentageText,
          isPositive,
          symbol: ticker.symbol,
          time: FALLBACK_TIME, 
          date: FALLBACK_DATE,
      };
  };

  // Fetch index data for all mini cards with fallback
  const fetchMarketIndices = async () => {
    let anySuccess = false;
    const dataPromises = INDEX_TICKERS.map(async (ticker) => {
        try {
            const url = `${API_BASE_URL}/stocks/latest/${ticker.symbol}`;
            const response = await fetch(url);
            if (!response.ok || response.status === 500) {
                throw new Error("API returned non-OK status");
            }
            const result = await response.json();
            anySuccess = true;
            return formatIndexData(ticker, result);
        } catch (e) {
            return null; 
        }
    });
    
    const results = await Promise.all(dataPromises);
    
    setIsLive(anySuccess);

    const finalData = results.map((result, i) => {
      return result !== null ? result : FALLBACK_INDICES[i]; 
    });

    setMarketIndicesData(finalData);
  };
  
  // Fetch data for the main chart based on activeSymbol
const fetchChartData = async (symbol, periodString) => { 
    try {
        const url = `${API_BASE_URL}/stocks/historical/${symbol}?period=${periodString}`;
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
          setMainChartData(generateFallbackChartData()); // Load mock data on failure
      }
  };

  // Initial Load (Fetches cards and sets loading state)
  useEffect(() => {
    async function initialLoad() {
        await fetchMarketIndices();
        setLoading(false);
    }
    initialLoad();
  }, []); 

  // Chart Load (Triggers after initial load completes OR when symbol/timeframe changes)
  useEffect(() => {
      if (!loading && activeSymbol) { 
          fetchChartData(activeSymbol, activeTimeframe);
      }
  }, [activeSymbol, activeTimeframe, loading]); 

  // Function to handle search from the Header
  const handleSearch = (symbol) => {
    const symbolUpper = symbol.toUpperCase().trim();
    const finalSymbol = symbolUpper.includes('.') || symbolUpper.includes('^') ? symbolUpper : `${symbolUpper}.NS`;
    setActiveSymbol(finalSymbol);
    setSearchQuery('');
  };

  const toggleTheme = () => setIsDark(!isDark);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const activeIndex = INDEX_TICKERS.find(i => i.symbol === activeSymbol) || { name: activeSymbol, symbol: activeSymbol };

  // --- START STYLES OBJECT ---
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
        isLive={isLive}
        handleSearch={handleSearch}
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
                chartTitle={activeIndex.name}
                loading={loading}
              />
              <TopMovers
                isDark={isDark}
                styles={styles}
                topMovers={topMovers}
              />
            </div>
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