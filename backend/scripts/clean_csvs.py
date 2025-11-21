import pandas as pd
import os

# --- CONFIGURATION ---
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(CURRENT_DIR)
RAW_DATA_DIR = os.path.join(BACKEND_DIR, "raw_data")
CLEAN_DATA_DIR = os.path.join(BACKEND_DIR, "data")

os.makedirs(CLEAN_DATA_DIR, exist_ok=True)

def clean_all_csvs():
    print(f"📂 Reading from: {RAW_DATA_DIR}")
    
    # Loop through every file in raw_data
    for filename in os.listdir(RAW_DATA_DIR):
        if not filename.endswith(".csv"):
            continue
            
        print(f"   🧹 Polishing {filename}...")
        file_path = os.path.join(RAW_DATA_DIR, filename)
        
        try:
            # 1. Read the CSV (Handle commas in numbers like "1,083.40")
            df = pd.read_csv(file_path, thousands=',')
            
            # 2. Clean headers (remove extra spaces)
            df.columns = df.columns.str.strip()
            
            # 3. Map YOUR specific columns to standard lowercase names
            # This matches the screenshot you just showed me
            rename_map = {
                "Date": "date",       
                "OPEN": "open",       
                "HIGH": "high",       
                "LOW":  "low",        
                "close": "close",     
                "VOLUME": "volume"    
            }
            
            # Rename columns if they exist
            df = df.rename(columns={k: v for k, v in rename_map.items() if k in df.columns})
            
            # 4. Keep only the columns we need
            wanted_cols = ["date", "open", "high", "low", "close", "volume"]
            final_cols = [c for c in wanted_cols if c in df.columns]
            df = df[final_cols]

            # 5. Fix Date Format (Change "31-Mar-23" -> "2023-03-31")
            if 'date' in df.columns:
                df['date'] = pd.to_datetime(df['date'])
                df = df.sort_values('date') # Sort Oldest -> Newest
                df['date'] = df['date'].dt.strftime('%Y-%m-%d')

            # 6. Save as Clean CSV
            output_path = os.path.join(CLEAN_DATA_DIR, filename)
            df.to_csv(output_path, index=False)
            
        except Exception as e:
            print(f"   ❌ Failed to clean {filename}: {e}")

    print("✅ All files cleaned and ready in /backend/data/")

if __name__ == "__main__":
    clean_all_csvs()