import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import BetaChart from "./BetaChart";
import ResultsDisplay from "./ResultsDisplay";
import SceneWidget from "./SceneWidget"; // Make sure this is imported

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const HedgingDashboard = () => {
  const [formData, setFormData] = useState({
    portfolio_value: "1000000",
    current_beta: "1.2",
    target_beta: "0.5",
    index_price: "4500",
    contract_multiplier: "50",
  });
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError(null);

    // Convert form data to numbers for the API
    const apiPayload = Object.keys(formData).reduce((acc, key) => {
      acc[key] = parseFloat(formData[key]);
      return acc;
    }, {});

    try {
      // The URL must be a simple string
      const response = await axios.post(
        "http://127.0.0.1:8000/calculate-hedge",
        apiPayload
      );

      setResult(response.data);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.detail || "Server error.");
      } else if (err.request) {
        setError("Network error. Is the backend server running?");
      } else {
        setError("An error occurred. Please check your inputs.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // This useEffect hook generates the data for the chart
  useEffect(() => {
    const dataToUse = result || formData;
    
    const p_value = parseFloat(dataToUse.portfolio_value);
    const c_beta = parseFloat(dataToUse.current_beta);
    const i_price = parseFloat(dataToUse.index_price);
    const c_mult = parseFloat(dataToUse.contract_multiplier);
    const contracts = result ? result.contracts_required : 0;
    
    if (!p_value || !i_price || !c_mult || isNaN(c_beta)) {
      setChartData([]);
      return;
    }

    const futures_contract_value = i_price * c_mult;
    if (futures_contract_value === 0) return;

    const newChartData = [];
    const contract_range = 20;
    const contract_step = Math.max(1, Math.round(Math.abs(contracts) / 20));
    const start_contracts = Math.floor(contracts - (contract_range / 2) * contract_step);

    for (let i = 0; i <= contract_range; i++) {
      const num_contracts = start_contracts + (i * contract_step);
      const beta_change = (num_contracts * futures_contract_value) / p_value;
      const new_beta = c_beta + beta_change;

      newChartData.push({
        contracts: num_contracts,
        beta: parseFloat(new_beta.toFixed(3)),
      });
    }

    setChartData(newChartData);

  }, [result, formData]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* ===== COLUMN 1: Input Form ===== */}
      <motion.div variants={itemVariants} className="card lg:col-span-1">
        <h2 className="text-xl font-bold text-text mb-6">
          Hedging Calculator
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="portfolio_value" className="form-label">
              Portfolio Value ($)
            </label>
            <input
              type="number"
              name="portfolio_value"
              id="portfolio_value"
              className="form-input"
              value={formData.portfolio_value}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="current_beta" className="form-label">
              Current Portfolio Beta (β)
            </label>
            <input
              type="number"
              step="0.01"
              name="current_beta"
              id="current_beta"
              className="form-input"
              value={formData.current_beta}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="target_beta" className="form-label">
              Target Portfolio Beta (β)
            </label>
            <input
              type="number"
              step="0.01"
              name="target_beta"
              id="target_beta"
              className="form-input"
              value={formData.target_beta}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="index_price" className="form-label">
                Index Price
              </label>
              <input
                type="number"
                step="0.01"
                name="index_price"
                id="index_price"
                className="form-input"
                value={formData.index_price}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="contract_multiplier" className="form-label">
                Multiplier
              </label>
              <input
                type="number"
                name="contract_multiplier"
                id="contract_multiplier"
                className="form-input"
                value={formData.contract_multiplier}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* --- THIS IS THE BUTTON --- */}
          <div className="pt-4">
            <motion.button
              type="submit"
              disabled={isLoading}
              className="form-button"
              /* Add animation */
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? "Calculating..." : "Calculate Hedge"}
            </motion.button>
          </div>
          {/* --- END OF BUTTON --- */}


          {error && (
             <motion.div 
               initial={{opacity: 0}}
               animate={{opacity: 1}}
               className="p-3 mt-4 text-center text-red-400 bg-red-900/30 rounded-md text-sm"
             >
               {error}
             </motion.div>
          )}
        </form>
      </motion.div>

      {/* ===== COLUMN 2: Chart & Results ===== */}
      <div className="lg:col-span-2 space-y-6">
        {/* ===== Chart Widget ===== */}
        <motion.div variants={itemVariants} className="card h-[400px]">
          <h3 className="text-xl font-bold text-text mb-4">
            Beta vs. Contracts Analysis
          </h3>
          <BetaChart 
            data={chartData} 
            targetBeta={parseFloat(formData.target_beta)} 
            currentBeta={parseFloat(formData.current_beta)}
            resultContracts={result ? result.contracts_required : null}
          />
        </motion.div>

        {/* ===== Results Widgets (Horizontal Layout) ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <ResultsDisplay result={result} />
          </motion.div>
          
          <motion.div variants={itemVariants} className="card min-h-[200px] flex flex-col">
             <h3 className="text-xl font-bold text-text mb-2">
              Market Risk
             </h3>
             <p className="text-text-muted text-sm mb-4">
              Real-time 3D market volatility index.
             </p>
             <div className="w-full h-32 mt-auto">
              {/* Pass the current beta from the form to the SceneWidget */}
              <SceneWidget beta={parseFloat(formData.current_beta) || 1.0} />
             </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default HedgingDashboard;

