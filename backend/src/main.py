# backend/src/main.py
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from backend.src.models.stock import CompanyBase, DailyPriceBase, Company, DailyPrice
from backend.src.services import stock_service # Import your service functions
from datetime import date
from typing import List

app = FastAPI(
    title="Stock Analysis API",
    description="API for fetching historical stock data and managing company information.",
    version="0.1.0"
)

# CORS configuration to allow your React frontend to communicate with the backend
# Make sure to update 'http://localhost:3000' if your React app runs on a different port
origins = [
    "http://localhost:3000",
    # You might add more origins later if your frontend is deployed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"], # Allow all headers
)

@app.get("/", summary="Root endpoint")
async def root():
    """Returns a welcome message for the API."""
    return {"message": "Welcome to the Stock Analysis API!"}

@app.post("/companies/", response_model=Company, status_code=status.HTTP_201_CREATED, summary="Create a new company")
async def create_company_endpoint(company: CompanyBase):
    """Creates a new company record in the database."""
    try:
        return stock_service.create_company(company)
    except ValueError as e: # Catch the specific ValueError from service
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e: # Catch any other unexpected errors
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An unexpected error occurred: {e}")

@app.get("/companies/", response_model=List[Company], summary="Get all companies")
async def get_companies_endpoint():
    """Retrieves a list of all companies in the database."""
    try:
        return stock_service.get_companies()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to fetch companies: {e}")

@app.post("/daily_prices/", response_model=DailyPrice, status_code=status.HTTP_201_CREATED, summary="Add daily stock price")
async def add_daily_price_endpoint(price: DailyPriceBase):
    """Adds a new daily stock price record for a company."""
    try:
        return stock_service.add_daily_price(price)
    except ValueError as e: # Catch the specific ValueError (e.g., duplicate entry)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An unexpected error occurred: {e}")

@app.get("/daily_prices/{symbol}/", response_model=List[DailyPrice], summary="Get daily prices for a symbol")
async def get_daily_prices_endpoint(
    symbol: str,
    start_date: date,
    end_date: date
):
    """
    Retrieves daily stock prices for a given symbol within a specified date range.

    - **symbol**: The stock ticker symbol (e.g., AAPL).
    - **start_date**: The start date for the price range (YYYY-MM-DD).
    - **end_date**: The end date for the price range (YYYY-MM-DD).
    """
    try:
        prices = stock_service.get_daily_prices_by_symbol(symbol, start_date, end_date)
        if not prices:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No data found for symbol '{symbol}' in the range {start_date} to {end_date}.")
        return prices
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to fetch daily prices: {e}")