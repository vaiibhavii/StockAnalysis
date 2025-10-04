import yfinance as yf
import pandas as pd
from typing import Optional

def fetch_stock_data(ticker_symbol: str, period: str = "1mo") -> Optional[pd.DataFrame]:
    """
    Fetches historical stock data using yf.download() with enhanced logging.
    """
    print(f"--- Attempting to fetch data for ticker: {ticker_symbol}, period: {period} ---")
    try:
        hist_data = yf.download(
            tickers=ticker_symbol,
            period=period,
            interval='1d',
            progress=False,
        )
        
        if hist_data.empty:
            print(f"!!! YFINANCE WARNING: Download was successful but returned an EMPTY dataframe for {ticker_symbol}.")
            print("!!! This can happen if the ticker is incorrect, delisted, or has no data for the period.")
            return None
            
        print(f"+++ YFINANCE SUCCESS: Fetched {len(hist_data)} data points for {ticker_symbol}.")
        return hist_data
        
    except Exception as e:
        print(f"!!! YFINANCE CRITICAL ERROR: An exception occurred while fetching data for {ticker_symbol}.")
        print(f"!!! Error details: {e}")
        return None