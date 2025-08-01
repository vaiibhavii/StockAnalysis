# backend/src/models/stock.py
from pydantic import BaseModel
from datetime import date
from typing import Optional

# Base model for creating a new company entry
class CompanyBase(BaseModel):
    symbol: str # e.g., "AAPL", "MSFT"
    company_name: str # e.g., "Apple Inc.", "Microsoft Corp."
    sector: Optional[str] = None # e.g., "Technology"
    industry: Optional[str] = None # e.g., "Consumer Electronics"

# Model representing a company as it exists in the database (includes 'id')
class Company(CompanyBase):
    id: int

    class Config:
        # This is important to allow Pydantic to read from ORM objects (like psycopg2 results)
        from_attributes = True

# Base model for adding daily stock price data
class DailyPriceBase(BaseModel):
    company_id: int # Foreign key linking to companies table
    trade_date: date
    open_price: float
    high_price: float
    low_price: float
    close_price: float
    volume: int

# Model representing a daily price entry as it exists in the database (includes 'id')
class DailyPrice(DailyPriceBase):
    id: int

    class Config:
        from_attributes = True