# backend/src/data_collection/data_fetcher.py
import yfinance as yf
import pandas as pd
from typing import Optional

def fetch_stock_data(ticker_symbol: str, period: str = "1mo") -> Optional[pd.DataFrame]:
    """
    Fetches historical stock data using yf.download() for maximum stability.
    
    Args:
        ticker_symbol (str): The stock ticker symbol (e.g., "RELIANCE.NS").
        period (str): The period to fetch data for (e.g., "1mo", "1y", "5y").

    Returns:
        pandas.DataFrame: A DataFrame containing the historical stock data, or None on failure.
    """
    # Use interval='1d' (daily) as it's typically more reliable than attempting '1m' or '1h'
    try:
        hist_data = yf.download(
            tickers=ticker_symbol,
            period=period,
            interval='1d',
            progress=False,
            # show_errors=True parameter removed for compatibility
        )
        
        if hist_data.empty:
            print(f"WARNING: Successfully connected but fetched no data for {ticker_symbol}.")
            return None
            
        print(f"Successfully fetched {len(hist_data)} data points for {ticker_symbol} via yfinance.")
        return hist_data
    except Exception as e:
        # This catches network or connection errors
        print(f"CRITICAL: Failed to fetch data for {ticker_symbol} (Connection/Network Error): {e}")
        return None

# This block ensures the code runs only when the script is executed directly
if __name__ == "__main__":
    # Test fetch for a known reliable ticker (AAPL)
    SYMBOL_TO_FETCH = "AAPL" 
    
    apple_data = fetch_stock_data(SYMBOL_TO_FETCH, period="1mo")
    
    if apple_data is not None and not apple_data.empty:
        print(f"\nSUCCESS: Data fetch verified for {SYMBOL_TO_FETCH}. Last 5 days:")
        print(apple_data.tail())
    else:
        print(f"\nFAILURE: Could not fetch data for {SYMBOL_TO_FETCH}. Check network/firewall settings.")