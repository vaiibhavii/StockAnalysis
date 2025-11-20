import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse 

app = FastAPI()

# Allow React (localhost:3000) to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Locate the clean data folder
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(BASE_DIR, "data")

@app.get("/")
def home():
    return {"message": "Stock CSV API is running."}

@app.get("/api/files")
def list_available_files():
    """
    Returns list of files like: ['22_23_RELIANCE.csv', '23_24_RELIANCE.csv']
    React uses this to build the dropdown menu.
    """
    if not os.path.exists(DATA_DIR):
        return []
    return [f for f in os.listdir(DATA_DIR) if f.endswith('.csv')]

@app.get("/api/data/{filename}")
def get_csv_file(filename: str):
    """
    Serves the actual CSV file.
    React calls this when the user clicks a specific year/stock.
    """
    file_path = os.path.join(DATA_DIR, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(file_path, media_type='text/csv', filename=filename)