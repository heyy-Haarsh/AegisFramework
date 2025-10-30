import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
} from "recharts";

// Custom Tooltip for the chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-panel-light p-3 rounded-md border border-zinc-600 shadow-lg">
        <p className="text-text-muted text-sm">{`Contracts: ${label}`}</p>
        <p className="text-primary font-bold">{`Portfolio Beta: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const BetaChart = ({ data, targetBeta, currentBeta, resultContracts }) => {
  
  if (data.length === 0) {
    return (
       <div className="flex items-center justify-center h-full text-text-muted">
         <p>Enter valid data to generate analysis chart.</p>
       </div>
    );
  }
  
  return (
    // ResponsiveContainer makes the chart fill its parent div
    <ResponsiveContainer width="100%" height="85%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 20,
          left: -20, // Adjust to pull Y-axis labels closer
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
        <XAxis
          dataKey="contracts"
          stroke="#9ca3af"
          tick={{ fontSize: 12 }}
          label={{ value: "Number of Contracts (Short/Long)", position: "insideBottom", dy: 15, fill: "#9ca3af", fontSize: 12 }}
        />
        <YAxis
          stroke="#9ca3af"
          tick={{ fontSize: 12 }}
          domain={['dataMin - 0.2', 'dataMax + 0.2']}
          label={{ value: "Portfolio Beta (β)", angle: -90, position: "insideLeft", dx: -10, fill: "#9ca3af", fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        
        {/* The main line showing beta relationship */}
        <Line
          type="monotone"
          dataKey="beta"
          stroke="#06b6d4" // Primary color (cyan)
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6, fill: "#06b6d4", stroke: "white", strokeWidth: 2 }}
        />
        
        {/* Reference line for the Target Beta */}
        {!isNaN(targetBeta) && (
          <ReferenceLine 
            y={targetBeta} 
            label={{ value: "Target", position: "right", fill: "#f59e0b", fontSize: 12 }} 
            stroke="#f59e0b" // Secondary color (amber)
            strokeDasharray="4 4" 
          />
        )}
        
        {/* Reference line for the Current Beta (at 0 contracts) */}
        {!isNaN(currentBeta) && (
           <ReferenceDot 
             x={0} 
             y={currentBeta} 
             r={5} 
             fill="#9ca3af" 
             stroke="white" 
             strokeWidth={1}
           />
        )}
        
         {/* Reference dot for the calculated position */}
        {resultContracts !== null && !isNaN(targetBeta) && (
           <ReferenceDot 
             x={resultContracts} 
             y={targetBeta} 
             r={6} 
             fill="#f59e0b" 
             stroke="white" 
             strokeWidth={2}
           />
        )}
        
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BetaChart;
