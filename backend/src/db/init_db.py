from backend.src.db.database import get_db_connection
import sys

def create_tables():
    """Creates the companies and daily_prices tables in the database."""
    # SQL commands to create the tables
    commands = (
        """
        -- 1. Create companies table based on Company model
        CREATE TABLE IF NOT EXISTS companies (
            id SERIAL PRIMARY KEY,
            symbol VARCHAR(10) NOT NULL UNIQUE,
            company_name VARCHAR(255) NOT NULL,
            sector VARCHAR(100),
            industry VARCHAR(100)
        )
        """,
        """
        -- 2. Create daily_prices table based on DailyPrice model
        -- Includes a FOREIGN KEY to 'companies' table and a UNIQUE CONSTRAINT 
        CREATE TABLE IF NOT EXISTS daily_prices (
            id SERIAL PRIMARY KEY,
            company_id INTEGER NOT NULL REFERENCES companies(id),
            trade_date DATE NOT NULL,
            open_price NUMERIC(10, 4) NOT NULL,
            high_price NUMERIC(10, 4) NOT NULL,
            low_price NUMERIC(10, 4) NOT NULL,
            close_price NUMERIC(10, 4) NOT NULL,
            volume BIGINT NOT NULL,
            -- Enforces unique constraint (checked by stock_service)
            CONSTRAINT unique_price_per_day UNIQUE (company_id, trade_date)
        )
        """
    )
    
    conn = None
    try:
        # Get connection from existing database module
        print("Attempting to connect to the database...")
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Execute create table SQL commands
        for command in commands:
            # Print only the first line of the command for cleaner output
            print(f"Executing command: {command.strip().splitlines()[0]}...")
            cur.execute(command)
        
        # Commit the changes to the database
        conn.commit()
        print("✅ Database tables created successfully.")
        
    except Exception as e:
        print("❌ Error during database initialization.")
        print("Please ensure your PostgreSQL database is running and the DATABASE_URL environment variable is correctly set in backend/.env.")
        print(f"Error details: {e}")
        if conn:
            conn.rollback()
        sys.exit(1)
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    # Add backend/src to Python path to ensure imports work correctly
    # Only necessary if running from the project root directory
    import os
    # Temporarily modify the Python path to allow the internal import to work
    script_dir = os.path.dirname(__file__)
    # Go up two levels (to backend/ directory) and add it to the path
    sys.path.append(os.path.join(script_dir, '..', '..'))
    
    create_tables()