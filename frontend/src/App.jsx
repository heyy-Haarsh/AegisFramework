import React from "react";
import Header from "./components/Header";
import HedgingDashboard from "./components/HedgingDashboard";
import AIHelperChat from "./components/AIHelperChat";

function App() {
  return (
    // We use h-screen and overflow-hidden on the parent,
    // and overflow-auto on the 'main' content area for a fixed-header layout.
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Header />
      <main className="flex-grow overflow-auto p-4 sm:p-6 lg:p-8">
        <HedgingDashboard />
      </main>
      <AIHelperChat />
    </div>
  );
}

export default App;
