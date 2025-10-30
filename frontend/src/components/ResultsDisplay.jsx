import React from "react";
import { motion } from "framer-motion";

const ResultsDisplay = ({ result }) => {
  if (!result) {
    return (
      <div className="card flex items-center justify-center min-h-[200px]">
        <p className="text-text-muted">Awaiting calculation...</p>
      </div>
    );
  }

  const isShort = result.action === "SHORT";
  const isLong = result.action === "LONG";
  const isNone = result.action === "NONE";

  const colorClass = isShort
    ? "text-danger"
    : isLong
    ? "text-success"
    : "text-secondary";
    
  const contracts = Math.abs(result.contracts_required).toFixed(4);

  return (
    <motion.div
      className="card min-h-[200px] flex flex-col justify-between"
      key={JSON.stringify(result)} // Re-animate on change
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{duration: 0.5}}
    >
      <div>
        <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider">
          Recommended Action
        </h3>
        <p className={`text-4xl font-bold my-2 ${colorClass}`}>
          {isNone
            ? "No Action"
            : `${result.action} ${contracts}`}
        </p>
        <p className="text-lg text-text-muted -mt-1">
          Index Futures Contracts
        </p>
      </div>
      
      <p className="text-xs text-text-muted/70 mt-4">
        {result.message}
      </p>
    </motion.div>
  );
};

export default ResultsDisplay;
