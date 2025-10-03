# backend/src/services/stock_service.py
from ..data_collection import data_fetcher
from typing import List, Dict, Any
from datetime import date, timedelta
import pandas as pd

def get_daily_prices_for_graph(symbol: str, period: str = "1mo") -> List[Dict[str, Any]]:
    """
    Fetches daily prices for a given stock symbol for a specific period using the configured data fetcher (Finnhub).
    """
    # Fetch historical data
    df = data_fetcher.fetch_stock_data(symbol, period=period)

    if df is None or df.empty:
        return []

    # Reset index to turn the DateTimeIndex into a column
    df.reset_index(inplace=True)
    
    # Rename columns to match what is commonly expected by frontends (lower case, snake_case).
    # The Finnhub fetcher provides: Index (date), Open, High, Low, Close, Volume
    df.rename(columns={
        'Date': 'trade_date', 'Open': 'open_price', 'High': 'high_price',
        'Low': 'low_price', 'Close': 'close_price', 'Volume': 'volume'
    }, inplace=True)

    # Select only the columns we need, in case the fetcher returned more than expected.
    required_columns = [
        'trade_date', 'open_price', 'high_price', 'low_price', 'close_price', 'volume'
    ]
    data_list = df[required_columns].to_dict('records')
    
    # Format date for cleaner API response
    for item in data_list:
        # Convert trade_date to datetime object for safe string formatting
        item['trade_date'] = pd.to_datetime(item['trade_date']).strftime('%Y-%m-%d')
        # Simulate a simple ID field for compatibility, though unnecessary for MVP
        item['id'] = 0 
        item['company_id'] = 0

    return data_list

def get_latest_price_and_sparkline(symbol: str) -> Dict[str, Any]:
    """
    Fetches the latest price and a small history for sparklines.
    Uses robust error handling to prevent 500 errors if data is missing.
    """
    # Fetch a longer period (e.g., 3mo) to ensure stable data for the latest price and sparkline
    df = data_fetcher.fetch_stock_data(symbol, period="3mo")
    
    # Check 1: If nothing was fetched
    if df is None or df.empty:
        return {"price": 0.0, "change": 0.0, "sparkline_data": []}

    try:
        # Check 2: If the necessary 'Close' column is missing (should not happen with yfinance)
        if 'Close' not in df.columns:
            raise KeyError("Close price column missing.")

        # 1. Get the latest closing price
        latest_price = df['Close'].iloc[-1].round(2)
        
        # 2. Calculate the price change: ensure we have at least 2 points
        if len(df) >= 2:
            previous_close = df['Close'].iloc[-2].round(2)
            change = (latest_price - previous_close).round(2)
        else:
            # Not enough data for a meaningful change calculation
            change = 0.0 
            
        # 3. Prepare sparkline data (last 30 closing prices)
        sparkline_data = df['Close'].tail(30).reset_index(drop=True).apply(lambda x: {"value": round(x, 2)}).to_list()

    except Exception as e:
        # Catch any unexpected indexing or data conversion errors
        print(f"Unexpected error processing data for {symbol}: {e}")
        return {"price": 0.0, "change": 0.0, "sparkline_data": []}

    return {
        "price": latest_price,
        "change": change,
        "sparkline_data": sparkline_data
    }
