import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import ResultsDisplay from "./ResultsDisplay";

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const HedgingCalculator = () => {
  const [formData, setFormData] = useState({
    portfolio_value: "",
    current_beta: "",
    target_beta: "",
    index_price: "",
    contract_multiplier: "",
  });
  const [result, setResult] = useState(null);
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

    // Convert form data to numbers
    const apiPayload = Object.keys(formData).reduce((acc, key) => {
      acc[key] = parseFloat(formData[key]);
      return acc;
    }, {});

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/calculate-hedge",
        apiPayload
      );
      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "An error occurred. Please check your inputs."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-lg p-8 bg-brand-gray/80 backdrop-blur-md rounded-lg shadow-2xl border border-brand-light-gray/10"
    >
      <h2 className="text-3xl font-light text-white text-center mb-6">
        Portfolio Hedging Framework
      </h2>
      
      {/* Display Result or Error */}
      {result && <ResultsDisplay result={result} />}
      {error && (
        <motion.div 
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          className="p-4 mb-4 text-center text-red-300 bg-red-900/50 rounded-md"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div variants={itemVariants}>
          <label htmlFor="portfolio_value" className="form-label">
            Portfolio Value ($)
          </label>
          <input
            type="number"
            name="portfolio_value"
            id="portfolio_value"
            className="form-input"
            placeholder="e.g., 1000000"
            value={formData.portfolio_value}
            onChange={handleChange}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label htmlFor="current_beta" className="form-label">
            Current Portfolio Beta ($\beta_P$)
          </label>
          <input
            type="number"
            step="0.01"
            name="current_beta"
            id="current_beta"
            className="form-input"
            placeholder="e.g., 1.2"
            value={formData.current_beta}
            onChange={handleChange}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label htmlFor="target_beta" className="form-label">
            Target Portfolio Beta ($\beta_T$)
          </label>
          <input
            type="number"
            step="0.01"
            name="target_beta"
            id="target_beta"
            className="form-input"
            placeholder="e.g., 0.0 for a full hedge"
            value={formData.target_beta}
            onChange={handleChange}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label htmlFor="index_price" className="form-label">
            Index Futures Price
          </label>
          <input
            type="number"
            step="0.01"
            name="index_price"
            id="index_price"
            className="form-input"
            placeholder="e.g., 4500"
            value={formData.index_price}
            onChange={handleChange}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label htmlFor="contract_multiplier" className="form-label">
            Contract Multiplier
          </label>
          <input
            type="number"
            name="contract_multiplier"
            id="contract_multiplier"
            className="form-input"
            placeholder="e.g., 50 (for Nifty) or 250 (for S&P 500)"
            value={formData.contract_multiplier}
            onChange={handleChange}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants} className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 bg-brand-accent text-brand-dark font-bold rounded-md hover:bg-white transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? "Calculating..." : "Calculate Hedge"}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default HedgingCalculator;