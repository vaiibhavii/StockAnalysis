import yfinance as yf
import pandas as pd

def fetch_stock_data(ticker_symbol, period="5y"):
    """
    Fetches historical stock data for a given ticker symbol.

    Args:
        ticker_symbol (str): The stock ticker symbol (e.g., "AAPL").
        period (str): The period to fetch data for (e.g., "1d", "5d", "1mo", "1y", "5y").

    Returns:
        pandas.DataFrame: A DataFrame containing the historical stock data.
    """
    try:
        stock = yf.Ticker(ticker_symbol)
        hist_data = stock.history(period=period)
        print(f"Successfully fetched data for {ticker_symbol}")
        return hist_data
    except Exception as e:
        print(f"Failed to fetch data for {ticker_symbol}: {e}")
        return None

# This block ensures the code runs only when the script is executed directly
if __name__ == "__main__":
    # Define the stock you want to analyze
    SYMBOL_TO_FETCH = "AAPL" # You can change this to "MSFT", "GOOGL", etc.
    
    # Fetch the data
    apple_data = fetch_stock_data(SYMBOL_TO_FETCH)
    
    # Check if data was fetched successfully before trying to print it
    if apple_data is not None and not apple_data.empty:
        print(f"\nDisplaying last 5 days of data for {SYMBOL_TO_FETCH}:")
        print(apple_data.tail())