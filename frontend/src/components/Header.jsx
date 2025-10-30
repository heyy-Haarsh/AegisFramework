import React from "react";
import { motion } from "framer-motion";

// Simple SVG Logo
const AegisLogo = () => (
  <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)">
    <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="4" className="text-primary"/>
    <path d="M20 6V20H34" stroke="currentColor" strokeWidth="4" className="text-cyan-600" />
    <circle cx="20" cy="20" r="4" fill="currentColor" className="text-text"/>
  </svg>
);


const Header = () => {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} // Nice ease-out quint
      className="w-full p-5 flex justify-between items-center border-b border-panel-light flex-shrink-0"
    >
      <div className="flex items-center space-x-3">
        <AegisLogo />
        <h1 className="text-xl font-bold text-text tracking-tight">
          Aegis <span className="font-light text-text-muted">Dashboard</span>
        </h1>
      </div>
      <nav>
        <button className="btn-secondary py-2 px-4 text-sm">
          Settings
        </button>
      </nav>
    </motion.header>
  );
};

export default Header;
