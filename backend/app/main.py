from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import HedgeInput, HedgeOutput
from .logic import calculate_hedge
import logging

# Set up basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Aegis Hedging API",
    description="Calculates the optimal number of index futures contracts for hedging.",
    version="1.0.0"
)

# Set up CORS (Cross-Origin Resource Sharing)
# This is crucial to allow your React frontend (running on http://localhost:5173)
# to communicate with this backend (running on [http://127.0.0.1:8000](http://127.0.0.1:8000))
origins = [
    "http://localhost:5173",
    "[http://127.0.0.1:5173](http://127.0.0.1:5173)",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
def read_root():
    """Root endpoint for health check."""
    return {"message": "Welcome to the Aegis Hedging API"}

@app.post("/calculate-hedge", response_model=HedgeOutput)
def calculate_hedge_endpoint(input_data: HedgeInput):
    """
    Main API endpoint to perform the hedge calculation.
    Takes portfolio and market data, returns the number of contracts to trade.
    """
    try:
        logger.info(f"Received calculation request: {input_data.dict()}")
        result = calculate_hedge(input_data)
        return HedgeOutput(**result)
    except ValueError as e:
        logger.warning(f"Value error during calculation: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"An unexpected error occurred: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")
