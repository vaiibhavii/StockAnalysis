# backend/src/db/database.py
# This module is now intentionally empty to remove database dependency for MVP.
# We will use yfinance for data fetching directly in the service layer.

# # backend/src/db/database.py
# import os
# import psycopg2
# from dotenv import load_dotenv

# load_dotenv() # Load environment variables from .env file

# # Default to localhost if DATABASE_URL not set (e.g., for local dev without Docker Compose)
# DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://myuser:root@localhost:5432/stock_analysis_db")

# def get_db_connection():
#     """Establishes and returns a connection to the PostgreSQL database."""
#     try:
#         conn = psycopg2.connect(DATABASE_URL)
#         return conn
#     except psycopg2.Error as e:
#         print(f"Error connecting to the database: {e}")
#         raise # Re-raise the exception to be handled by FastAPI

