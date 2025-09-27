# backend/src/data_collection/data_fetcher.py
import yfinance as yf
import pandas as pd

def fetch_stock_data(ticker_symbol, period="5y"):
    """
    Fetches historical stock data for a given ticker symbol using yf.download() 
    for better stability across different market tickers (like .NS stocks).

    Args:
        ticker_symbol (str): The stock ticker symbol (e.g., "RELIANCE.NS").
        period (str): The period to fetch data for (e.g., "1mo", "1y", "5y").

    Returns:
        pandas.DataFrame: A DataFrame containing the historical stock data, or None on failure.
    """
    try:
        # Use yf.download for a simpler, more reliable direct API call
        hist_data = yf.download(
            tickers=ticker_symbol,
            period=period,
            interval='1d', # Daily interval
            progress=False, # Suppress output
            show_errors=True # Show errors if they occur
        )
        
        if hist_data.empty:
            print(f"Successfully fetched data for {ticker_symbol} but DataFrame is empty.")
            return None
            
        print(f"Successfully fetched {len(hist_data)} data points for {ticker_symbol}")
        return hist_data
    except Exception as e:
        print(f"CRITICAL: Failed to fetch data for {ticker_symbol} using yf.download: {e}")
        return None

# This block ensures the code runs only when the script is executed directly
if __name__ == "__main__":
    # Define the stock you want to analyze
    SYMBOL_TO_FETCH = "RELIANCE.NS" # Testing with an Indian stock
    
    # Fetch the data
    reliance_data = fetch_stock_data(SYMBOL_TO_FETCH, period="1mo")
    
    # Check if data was fetched successfully before trying to print it
    if reliance_data is not None and not reliance_data.empty:
        print(f"\nDisplaying last 5 days of data for {SYMBOL_TO_FETCH}:")
        print(reliance_data.tail())
    else:
        print(f"Failed to fetch data for {SYMBOL_TO_FETCH}.")


# import yfinance as yf
# import pandas as pd

# def fetch_stock_data(ticker_symbol, period="5y"):
#     """
#     Fetches historical stock data for a given ticker symbol.

#     Args:
#         ticker_symbol (str): The stock ticker symbol (e.g., "AAPL").
#         period (str): The period to fetch data for (e.g., "1d", "5d", "1mo", "1y", "5y").

#     Returns:
#         pandas.DataFrame: A DataFrame containing the historical stock data.
#     """
#     try:
#         stock = yf.Ticker(ticker_symbol)
#         hist_data = stock.history(period=period)
#         print(f"Successfully fetched data for {ticker_symbol}")
#         return hist_data
#     except Exception as e:
#         print(f"Failed to fetch data for {ticker_symbol}: {e}")
#         return None

# # This block ensures the code runs only when the script is executed directly
# if __name__ == "__main__":
#     # Define the stock you want to analyze
#     SYMBOL_TO_FETCH = "AAPL" # You can change this to "MSFT", "GOOGL", etc.
    
#     # Fetch the data
#     apple_data = fetch_stock_data(SYMBOL_TO_FETCH)
    
#     # Check if data was fetched successfully before trying to print it
#     if apple_data is not None and not apple_data.empty:
#         print(f"\nDisplaying last 5 days of data for {SYMBOL_TO_FETCH}:")
#         print(apple_data.tail())