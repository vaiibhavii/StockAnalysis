# backend/src/services/stock_service.py
from ..models import DailyPriceBase
from ..data_collection import data_fetcher
from typing import List, Dict, Any
from datetime import date, timedelta
import pandas as pd

def get_daily_prices_for_graph(symbol: str, period: str = "1mo") -> List[Dict[str, Any]]:
    """
    Fetches daily prices for a given stock symbol for a specific period directly from yfinance.
    """
    # Fetch historical data
    df = data_fetcher.fetch_stock_data(symbol, period=period)

    if df is None or df.empty:
        return []

    # Reset index to turn the DateTimeIndex into a column
    df.reset_index(inplace=True)
    
    # Rename columns to match what is commonly expected by frontends (lower case, snake_case)
    df.columns = [
        'trade_date', 'open_price', 'high_price', 'low_price', 
        'close_price', 'volume', 'Dividends', 'Stock Splits'
    ]

    # Convert DataFrame rows to a list of dictionaries for API response
    data_list = df[[
        'trade_date', 'open_price', 'high_price', 'low_price', 
        'close_price', 'volume'
    ]].to_dict('records')
    
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



# # backend/src/services/stock_service.py
# # Removed: from backend.src.models.stock import DailyPriceBase
# from ..models import DailyPriceBase # <-- SIMPLIFIED IMPORT
# from ..data_collection import data_fetcher # <-- SIMPLIFIED IMPORT
# from typing import List, Dict, Any
# from datetime import date, timedelta
# import pandas as pd

# def get_daily_prices_for_graph(symbol: str, period: str = "1mo") -> List[Dict[str, Any]]:
#     """
#     Fetches daily prices for a given stock symbol for a specific period directly from yfinance.
#     """
#     # Fetch historical data
#     df = data_fetcher.fetch_stock_data(symbol, period=period)

#     if df is None or df.empty:
#         return []

#     # Reset index to turn the DateTimeIndex into a column
#     df.reset_index(inplace=True)
    
#     # Rename columns to match what is commonly expected by frontends (lower case, snake_case)
#     df.columns = [
#         'trade_date', 'open_price', 'high_price', 'low_price', 
#         'close_price', 'volume', 'Dividends', 'Stock Splits'
#     ]

#     # Convert DataFrame rows to a list of dictionaries for API response
#     data_list = df[[
#         'trade_date', 'open_price', 'high_price', 'low_price', 
#         'close_price', 'volume'
#     ]].to_dict('records')
    
#     # Format date for cleaner API response
#     for item in data_list:
#         # Convert date object/timestamp to ISO string (YYYY-MM-DD)
#         item['trade_date'] = item['trade_date'].strftime('%Y-%m-%d')
#         # Simulate a simple ID field for compatibility, though unnecessary for MVP
#         item['id'] = 0 
#         item['company_id'] = 0

#     return data_list

# def get_latest_price_and_sparkline(symbol: str) -> Dict[str, Any]:
#     """
#     Fetches the latest price and a small history for sparklines.
#     """
#     # Fetch 1 month of data for current price and sparkline
#     df = data_fetcher.fetch_stock_data(symbol, period="1mo")
    
#     if df is None or df.empty:
#         return {"price": 0.0, "change": 0.0, "sparkline_data": []}

#     # Get the latest closing price
#     latest_price = df['Close'].iloc[-1].round(2)
    
#     # Calculate the price change from the open of the latest day.
#     # We use the penultimate day's close for a more stable daily change calculation
#     previous_close = df['Close'].iloc[-2].round(2) if len(df) > 1 else df['Close'].iloc[0].round(2)
#     change = (latest_price - previous_close).round(2)
    
#     # Prepare sparkline data (last 30 closing prices)
#     sparkline_data = df['Close'].tail(30).reset_index(drop=True).apply(lambda x: {"value": round(x, 2)}).to_list()

#     return {
#         "price": latest_price,
#         "change": change,
#         "sparkline_data": sparkline_data
#     }


# # 
# #  # backend/src/services/stock_service.py
# # from backend.src.models.stock import DailyPriceBase
# # from backend.src.data_collection import data_fetcher
# # from typing import List, Dict, Any
# # from datetime import date, timedelta
# # import pandas as pd

# # # The original models are slightly misused here, but we will return data in a consistent structure.
# # # For simplicity, we define a quick data conversion function.

# # def get_daily_prices_for_graph(symbol: str, period: str = "1mo") -> List[Dict[str, Any]]:
# #     """
# #     Fetches daily prices for a given stock symbol for a specific period directly from yfinance.
# #     """
# #     # Fetch historical data
# #     df = data_fetcher.fetch_stock_data(symbol, period=period)

# #     if df is None or df.empty:
# #         return []

# #     # Reset index to turn the DateTimeIndex into a column
# #     df.reset_index(inplace=True)
    
# #     # Rename columns to match what is commonly expected by frontends (lower case, snake_case)
# #     df.columns = [
# #         'trade_date', 'open_price', 'high_price', 'low_price', 
# #         'close_price', 'volume', 'Dividends', 'Stock Splits'
# #     ]

# #     # Convert DataFrame rows to a list of dictionaries for API response
# #     data_list = df[[
# #         'trade_date', 'open_price', 'high_price', 'low_price', 
# #         'close_price', 'volume'
# #     ]].to_dict('records')
    
# #     # Format date for cleaner API response
# #     for item in data_list:
# #         # Convert date object/timestamp to ISO string (YYYY-MM-DD)
# #         item['trade_date'] = item['trade_date'].strftime('%Y-%m-%d')
# #         # Simulate a simple ID field for compatibility, though unnecessary for MVP
# #         item['id'] = 0 
# #         item['company_id'] = 0

# #     return data_list

# # def get_latest_price_and_sparkline(symbol: str) -> Dict[str, Any]:
# #     """
# #     Fetches the latest price and a small history for sparklines.
# #     """
# #     # Fetch 1 month of data for current price and sparkline
# #     df = data_fetcher.fetch_stock_data(symbol, period="1mo")
    
# #     if df is None or df.empty:
# #         return {"price": 0.0, "change": 0.0, "sparkline_data": []}

# #     # Get the latest closing price
# #     latest_price = df['Close'].iloc[-1].round(2)
    
# #     # Calculate the price change from the open of the latest day.
# #     # We use the penultimate day's close for a more stable daily change calculation
# #     previous_close = df['Close'].iloc[-2].round(2) if len(df) > 1 else df['Close'].iloc[0].round(2)
# #     change = (latest_price - previous_close).round(2)
    
# #     # Prepare sparkline data (last 30 closing prices)
# #     sparkline_data = df['Close'].tail(30).reset_index(drop=True).apply(lambda x: {"value": round(x, 2)}).to_list()

# #     return {
# #         "price": latest_price,
# #         "change": change,
# #         "sparkline_data": sparkline_data
# #     }


# # # backend/src/services/stock_service.py
# # from backend.src.db.database import get_db_connection
# # from backend.src.models.stock import CompanyBase, DailyPriceBase, Company, DailyPrice
# # from typing import List, Optional
# # from datetime import date
# # import psycopg2.extras # For dictionary cursor

# # def create_company(company: CompanyBase) -> Company:
# #     """Inserts a new company into the database."""
# #     conn = get_db_connection()
# #     # Use DictCursor to get results as dictionaries
# #     cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
# #     try:
# #         cur.execute(
# #             "INSERT INTO companies (symbol, company_name, sector, industry) VALUES (%s, %s, %s, %s) RETURNING id, symbol, company_name, sector, industry",
# #             (company.symbol, company.company_name, company.sector, company.industry)
# #         )
# #         new_company_data = cur.fetchone()
# #         conn.commit()
# #         # Convert DictRow to Company model
# #         return Company(**dict(new_company_data))
# #     except Exception as e:
# #         conn.rollback()
# #         raise ValueError(f"Failed to create company: {e}") # Raise a more specific error
# #     finally:
# #         cur.close()
# #         conn.close()

# # def get_companies() -> List[Company]:
# #     """Fetches all companies from the database."""
# #     conn = get_db_connection()
# #     cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
# #     cur.execute("SELECT id, symbol, company_name, sector, industry FROM companies")
# #     companies_data = cur.fetchall()
# #     cur.close()
# #     conn.close()
# #     # Convert list of DictRows to list of Company models
# #     return [Company(**dict(c)) for c in companies_data]

# # def add_daily_price(price: DailyPriceBase) -> DailyPrice:
# #     """Inserts a daily stock price entry into the database."""
# #     conn = get_db_connection()
# #     cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
# #     try:
# #         cur.execute(
# #             "INSERT INTO daily_prices (company_id, trade_date, open_price, high_price, low_price, close_price, volume) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id, company_id, trade_date, open_price, high_price, low_price, close_price, volume",
# #             (price.company_id, price.trade_date, price.open_price, price.high_price, price.low_price, price.close_price, price.volume)
# #         )
# #         new_price_data = cur.fetchone()
# #         conn.commit()
# #         return DailyPrice(**dict(new_price_data))
# #     except Exception as e:
# #         conn.rollback()
# #         # Check for unique constraint violation
# #         if "unique_price_per_day" in str(e):
# #             raise ValueError("Daily price for this company on this date already exists.")
# #         raise ValueError(f"Failed to add daily price: {e}")
# #     finally:
# #         cur.close()
# #         conn.close()

# # def get_daily_prices_by_symbol(symbol: str, start_date: date, end_date: date) -> List[DailyPrice]:
# #     """Fetches daily prices for a given stock symbol within a date range."""
# #     conn = get_db_connection()
# #     cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
# #     cur.execute(
# #         """
# #         SELECT dp.id, dp.company_id, dp.trade_date, dp.open_price, dp.high_price, dp.low_price, dp.close_price, dp.volume
# #         FROM daily_prices dp
# #         JOIN companies c ON dp.company_id = c.id
# #         WHERE c.symbol = %s AND dp.trade_date BETWEEN %s AND %s
# #         ORDER BY dp.trade_date ASC
# #         """,
# #         (symbol, start_date, end_date)
# #     )
# #     prices_data = cur.fetchall()
# #     cur.close()
# #     conn.close()
# #     return [DailyPrice(**dict(p)) for p in prices_data]