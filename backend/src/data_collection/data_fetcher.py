import pandas as pd
import os
import logging
from dotenv import load_dotenv
from datetime import datetime, timedelta

# Load environment variables from .env file
load_dotenv()

logging.basicConfig(level=logging.INFO)
# Setup Finnhub client
FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY")
if not FINNHUB_API_KEY:
    raise ValueError("FINNHUB_API_KEY not found in environment variables.")
finnhub_client = finnhub.Client(api_key=FINNHUB_API_KEY)

def fetch_stock_data(ticker_symbol, period="5y"):
    """
    Fetches historical stock data for a given ticker symbol using the Finnhub API.

    Args:
        ticker_symbol (str): The stock ticker symbol (e.g., "AAPL", "RELIANCE.NS").
        period (str): The period to fetch data for (e.g., "5y", "1y", "1mo").

    Returns:
        pandas.DataFrame: A DataFrame containing the historical stock data,
                          or None if fetching fails or no data is returned.
    """
    try:
        end_time = datetime.now()
        if period == "5y":
            start_time = end_time - timedelta(days=5*365)
        elif period == "1y":
            start_time = end_time - timedelta(days=365)
        elif period == "1mo":
            start_time = end_time - timedelta(days=30)
        else:
            start_time = end_time - timedelta(days=365)

        start_timestamp = int(start_time.timestamp())
        end_timestamp = int(end_time.timestamp())

        res = finnhub_client.stock_candles(ticker_symbol, 'D', start_timestamp, end_timestamp)

        if res['s'] != 'ok':
            logging.warning(f"Finnhub API did not return 'ok' for {ticker_symbol}. Status: {res.get('s')}. This may indicate no data or an access issue.")
            return None

        df = pd.DataFrame(data={
            'Open': res['o'],
            'High': res['h'],
            'Low': res['l'],
            'Close': res['c'],
            'Volume': res['v']
        }, index=pd.to_datetime(res['t'], unit='s').date)
        
        # The index name is 'None' by default, give it a name so reset_index() works predictably
        df.index.name = 'Date'

        logging.info(f"Successfully fetched {len(df)} data points for {ticker_symbol} from Finnhub.")
        return df

    except Exception as e:
        logging.error(f"An exception occurred while fetching data for {ticker_symbol} from Finnhub: {e}", exc_info=True)
        return None

# This block ensures the code runs only when the script is executed directly
if __name__ == "__main__":
    # For Indian stocks, you typically need the ".NS" suffix for NSE stocks
    SYMBOL_TO_FETCH = "RELIANCE.NS" # Example: Reliance Industries on NSE
    
    # Fetch the data for a US stock
    SYMBOL_TO_FETCH = "AAPL" # Example: Apple Inc.
    stock_data = fetch_stock_data(SYMBOL_TO_FETCH)
    
    # Check if data was fetched successfully before trying to print it
    if stock_data is not None and not stock_data.empty:
        print(f"\nDisplaying last 5 days of data for {SYMBOL_TO_FETCH}:")
        print(stock_data.tail())