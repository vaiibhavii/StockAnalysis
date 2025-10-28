# backend/src/data_collection/data_fetcher.py

import yfinance as yf
import pandas as pd

def fetch_stock_data(ticker_symbol, period="5y"):
    """
    Fetches historical stock data for a given ticker symbol.

    Args:
        ticker_symbol (str): The stock ticker symbol (e.g., "AAPL").
        period (str): The period to fetch data for (e.g., "1d", "5d", "1mo", "1y", "5y").

    Returns:
        pandas.DataFrame: A DataFrame containing the historical stock data, or an empty DataFrame if no data is found.
    """
    try:
        stock = yf.Ticker(ticker_symbol)
        hist_data = stock.history(period=period)
        
        if hist_data.empty:
            print(f"No data found for {ticker_symbol} for the period {period}")
            return None

        print(f"Successfully fetched data for {ticker_symbol}")
        return hist_data
    except Exception as e:
        print(f"Failed to fetch data for {ticker_symbol}: {e}")
        return None

# ... (the rest of your file can remain the same)