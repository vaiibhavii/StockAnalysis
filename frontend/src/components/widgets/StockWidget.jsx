import React from "react";
import "../../styles/StockWidget.css";

const stockData = [
  {
    name: "Apple, Inc",
    symbol: "AAPL",
    logo: "https://logo.clearbit.com/apple.com",
    price: "$1,232.00",
    change: "+11.01%",
    positive: true,
  },
  {
    name: "Paypal, Inc",
    symbol: "PYPL",
    logo: "https://logo.clearbit.com/paypal.com",
    price: "$965.00",
    change: "-9.05%",
    positive: false,
  },
  {
    name: "Tesla, Inc",
    symbol: "TSLA",
    logo: "https://logo.clearbit.com/tesla.com",
    price: "$1,232.00",
    change: "+11.01%",
    positive: true,
  },
  {
    name: "Amazon.com, Inc",
    symbol: "AMZN",
    logo: "https://logo.clearbit.com/amazon.com",
    price: "$2,567.00",
    change: "+11.01%",
    positive: true,
  },
];

const StockWidget = () => {
  return (
    <div className="stock-widget">
      {stockData.map((stock, index) => (
        <div className="stock-card" key={index}>
          <div className="stock-header">
            <img src={stock.logo} alt={stock.name} className="stock-logo" />
            <div className="stock-info">
              <h4>{stock.name}</h4>
              <p>{stock.symbol}</p>
            </div>
          </div>
          <div className="stock-details">
            <h3>{stock.price}</h3>
            <span className={stock.positive ? "positive" : "negative"}>
              {stock.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StockWidget;
