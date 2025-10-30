from pydantic import BaseModel, Field

class HedgeInput(BaseModel):
    """Data model for the calculation input."""
    portfolio_value: float = Field(..., gt=0, description="Total current value of the portfolio")
    current_beta: float = Field(..., description="Current weighted beta of the portfolio")
    target_beta: float = Field(..., description="Desired target beta for the portfolio")
    index_price: float = Field(..., gt=0, description="Current price of the index futures")
    contract_multiplier: float = Field(..., gt=0, description="Value of one index point (e.g., $50 for Nifty, $250 for S&P 500)")

class HedgeOutput(BaseModel):
    """Data model for the calculation result."""
    contracts_required: float
    action: str # "SHORT", "LONG", or "NONE"
    target_beta: float
    current_beta: float
    message: str
    
    # We will also return the raw inputs for the frontend
    portfolio_value: float
    index_price: float
    contract_multiplier: float
