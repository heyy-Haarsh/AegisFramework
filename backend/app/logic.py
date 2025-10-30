from .models import HedgeInput

def calculate_hedge(input_data: HedgeInput):
    """
    Calculates the number of index futures contracts needed to hedge 
    a portfolio to a target beta.
    
    Formula:
    Number of Contracts = (Target Beta - Current Beta) * (Portfolio Value / Futures Contract Value)
    Futures Contract Value = Index Price * Contract Multiplier
    """
    
    # Basic validation
    if input_data.index_price == 0 or input_data.contract_multiplier == 0:
        raise ValueError("Index price and contract multiplier must be non-zero.")

    futures_contract_value = input_data.index_price * input_data.contract_multiplier
    
    if futures_contract_value == 0:
        raise ValueError("Futures contract value cannot be zero.")

    beta_difference = input_data.target_beta - input_data.current_beta
    portfolio_value = input_data.portfolio_value
    
    # Calculate the raw number of contracts
    contracts_required = (beta_difference * portfolio_value) / futures_contract_value
    
    # Determine the action
    if contracts_required < -0.001:  # Use a small threshold for floating point
        action = "SHORT"
        message = f"To achieve a target beta of {input_data.target_beta}, you must SELL (short) {abs(contracts_required):.4f} index futures contracts."
    elif contracts_required > 0.001:
        action = "LONG"
        message = f"To achieve a target beta of {input_data.target_beta}, you must BUY (long) {contracts_required:.4f} index futures contracts."
    else:
        action = "NONE"
        contracts_required = 0.0
        message = "Your portfolio's beta is already at the target. No action is required."

    return {
        "contracts_required": contracts_required,
        "action": action,
        "target_beta": input_data.target_beta,
        "current_beta": input_data.current_beta,
        "message": message,
        # Pass through the inputs for the chart generation on the frontend
        "portfolio_value": input_data.portfolio_value,
        "index_price": input_data.index_price,
        "contract_multiplier": input_data.contract_multiplier
    }
