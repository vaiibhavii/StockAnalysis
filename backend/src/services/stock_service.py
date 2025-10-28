# backend/src/services/stock_service.py

# CORRECTED IMPORTS: Changed to be relative
from ..db.database import get_db_connection
from ..models.stock import CompanyBase, DailyPriceBase, Company, DailyPrice
from typing import List, Optional
from datetime import date
import psycopg2.extras # For dictionary cursor

# ... (the rest of the file remains exactly the same)
def create_company(company: CompanyBase) -> Company:
    """Inserts a new company into the database."""
    conn = get_db_connection()
    # Use DictCursor to get results as dictionaries
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        cur.execute(
            "INSERT INTO companies (symbol, company_name, sector, industry) VALUES (%s, %s, %s, %s) RETURNING id, symbol, company_name, sector, industry",
            (company.symbol, company.company_name, company.sector, company.industry)
        )
        new_company_data = cur.fetchone()
        conn.commit()
        # Convert DictRow to Company model
        return Company(**dict(new_company_data))
    except Exception as e:
        conn.rollback()
        raise ValueError(f"Failed to create company: {e}") # Raise a more specific error
    finally:
        cur.close()
        conn.close()

def get_companies() -> List[Company]:
    """Fetches all companies from the database."""
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("SELECT id, symbol, company_name, sector, industry FROM companies")
    companies_data = cur.fetchall()
    cur.close()
    conn.close()
    # Convert list of DictRows to list of Company models
    return [Company(**dict(c)) for c in companies_data]

def add_daily_price(price: DailyPriceBase) -> DailyPrice:
    """Inserts a daily stock price entry into the database."""
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        cur.execute(
            "INSERT INTO daily_prices (company_id, trade_date, open_price, high_price, low_price, close_price, volume) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id, company_id, trade_date, open_price, high_price, low_price, close_price, volume",
            (price.company_id, price.trade_date, price.open_price, price.high_price, price.low_price, price.close_price, price.volume)
        )
        new_price_data = cur.fetchone()
        conn.commit()
        return DailyPrice(**dict(new_price_data))
    except Exception as e:
        conn.rollback()
        # Check for unique constraint violation
        if "unique_price_per_day" in str(e):
            raise ValueError("Daily price for this company on this date already exists.")
        raise ValueError(f"Failed to add daily price: {e}")
    finally:
        cur.close()
        conn.close()

def get_daily_prices_by_symbol(symbol: str, start_date: date, end_date: date) -> List[DailyPrice]:
    """Fetches daily prices for a given stock symbol within a date range."""
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute(
        """
        SELECT dp.id, dp.company_id, dp.trade_date, dp.open_price, dp.high_price, dp.low_price, dp.close_price, dp.volume
        FROM daily_prices dp
        JOIN companies c ON dp.company_id = c.id
        WHERE c.symbol = %s AND dp.trade_date BETWEEN %s AND %s
        ORDER BY dp.trade_date ASC
        """,
        (symbol, start_date, end_date)
    )
    prices_data = cur.fetchall()
    cur.close()
    conn.close()
    return [DailyPrice(**dict(p)) for p in prices_data]