import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../styles/GraphSection.css";

export default function GraphSection() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Switched to a US stock ticker as requested
        const symbol = "AAPL"; 
        const period = "1mo";

        // This is the correct API URL for your 'test1' branch
        const response = await fetch(
          `http://localhost:8000/stocks/historical/${symbol}?period=${period}`
        );

        if (!response.ok) {
          // Log the server's error message for better debugging
          const errorBody = await response.json();
          throw new Error(`HTTP error ${response.status}: ${errorBody.detail}`);
        }

        const data = await response.json();

        const formattedData = data.map(item => ({
          name: new Date(item.trade_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          close: item.close_price,
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="graph-container">
      <h2>Stock Price (AAPL)</h2>
      <div className="graph-buttons">
        <button className="active">O</button>
        <button>H</button>
        <button>L</button>
        <button>C</button>
      </div>
      <div className="graph-box">
        {loading || chartData.length === 0 ? (
          <p>{loading ? "Loading data..." : "No data available."}</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="close"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}