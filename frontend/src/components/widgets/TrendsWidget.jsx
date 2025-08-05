import React from "react";
import "../../styles/TrendsWidget.css";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const trendingStocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: "$172.25", change: "+1.25%", up: true },
  { symbol: "TSLA", name: "Tesla Inc.", price: "$245.30", change: "-0.85%", up: false },
  { symbol: "AMZN", name: "Amazon Inc.", price: "$132.45", change: "+2.10%", up: true },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: "$2,745.66", change: "-0.65%", up: false },
  { symbol: "MSFT", name: "Microsoft Corp.", price: "$324.50", change: "+0.92%", up: true },
];

const TrendsWidget = () => {
  return (
    <div className="trends-widget">
      <h3>Trending Stocks</h3>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Price</th>
            <th>24h Change</th>
          </tr>
        </thead>
        <tbody>
          {trendingStocks.map((stock, index) => (
            <tr key={index}>
              <td>{stock.symbol}</td>
              <td>{stock.name}</td>
              <td>{stock.price}</td>
              <td className={stock.up ? "up" : "down"}>
                {stock.up ? <FaArrowUp /> : <FaArrowDown />} {stock.change}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrendsWidget;
