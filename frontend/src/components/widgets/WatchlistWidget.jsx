import React from "react";
import "../../styles/WatchlistWidget.css";

const WatchlistWidget = () => {
  const watchlist = [
    { symbol: "AAPL", name: "Apple Inc.", price: 193.97, change: "+1.32%" },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: 2854.30, change: "-0.45%" },
    { symbol: "TSLA", name: "Tesla Inc.", price: 717.17, change: "+3.14%" },
  ];

  return (
    <div className="watchlist-widget">
      <h3>📋 Watchlist</h3>
      <ul className="watchlist-list">
        {watchlist.map((stock) => (
          <li key={stock.symbol} className="watchlist-item">
            <div className="stock-info">
              <span className="symbol">{stock.symbol}</span>
              <span className="name">{stock.name}</span>
            </div>
            <div className="price-info">
              <span className="price">${stock.price}</span>
              <span className={`change ${stock.change.startsWith("+") ? "positive" : "negative"}`}>
                {stock.change}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WatchlistWidget;
