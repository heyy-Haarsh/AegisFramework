import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// System instruction to guide the AI
const systemInstruction = {
  parts: [{
    text: "You are an expert financial assistant. Your name is Aegis. You will ONLY answer questions related to finance, economics, portfolio management, beta, hedging, and financial markets. If asked about any other topic, politely decline and steer the conversation back to finance."
  }]
};

// Main Chat Component
const AIHelperChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Welcome! I'm Aegis, your financial assistant. Ask me anything about portfolio hedging, beta, or market risk.",
    },
  ]);
  
  // Ref to scroll to the bottom of the chat
  const chatEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle the form submission to the Gemini API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || !prompt.trim()) return;

    const userPrompt = prompt;
    const newMessages = [...messages, { role: "user", text: userPrompt }];
    setMessages(newMessages); // Show user's message immediately
    setPrompt("");
    setIsLoading(true);

    // --- Gemini API Call ---
    // Leave apiKey as "" - the environment will provide it
    const apiKey = "AIzaSyDAkJyuercXSZf9p1NmB7dfLbpPDG2bofE"; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    // Construct the payload, excluding the model's loading message if we add one
    const payload = {
      contents: newMessages.map(msg => ({ role: msg.role, parts: [{ text: msg.text }] })),
      systemInstruction: systemInstruction,
    };
    
    // Add a loading "message" from the model
    setMessages(prev => [...prev, { role: "model", text: "...", isLoading: true }]);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.candidates && result.candidates[0].content?.parts?.[0]?.text) {
        const modelResponse = result.candidates[0].content.parts[0].text;
        // Replace the loading message with the actual response
        setMessages((prev) => [
            ...prev.slice(0, -1), // Remove the loading message
            { role: "model", text: modelResponse } // Add the real one
        ]);
      } else {
        throw new Error("Invalid response structure from API.");
      }

    } catch (err) {
      console.error("Gemini API call failed:", err);
      // Replace the loading message with an error message
      setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "model", text: "Sorry, I'm having trouble connecting. Please try again later." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Bubble Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-primary rounded-full z-50 shadow-lg flex items-center justify-center text-zinc-900 text-3xl font-bold"
        aria-label="Open AI Assistant"
      >
        {/* Simple close icon when open */}
        <AnimatePresence>
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              className="absolute"
            >
              &#x2715;
            </motion.div>
          ) : (
            <motion.div
              key="question"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="absolute"
            >
              ?
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 w-full max-w-md h-[600px] bg-panel shadow-2xl rounded-lg z-40 flex flex-col border border-panel-light overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-panel-light/50 flex-shrink-0 border-b border-panel-light">
              <h4 className="font-bold text-text">Aegis AI Assistant</h4>
              <p className="text-xs text-text-muted">
                Powered by Gemini
              </p>
            </div>
            
            {/* Chat message body */}
            <div className="flex-grow p-4 space-y-4 overflow-y-auto">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-[85%] text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-zinc-900'
                        : 'bg-panel-light text-text'
                    }`}
                  >
                    {/* A simple loading dots animation */}
                    {msg.isLoading ? (
                      <div className="flex space-x-1 items-center justify-center px-2 py-1">
                        <span className="w-2 h-2 bg-text-muted rounded-full animate-pulse" style={{animationDelay: '0s'}}></span>
                        <span className="w-2 h-2 bg-text-muted rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
                        <span className="w-2 h-2 bg-text-muted rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></span>
                      </div>
                    ) : (
                      <p>{msg.text}</p>
                    )}
                  </div>
                </motion.div>
              ))}
              {/* This empty div is the target for scrolling */}
              <div ref={chatEndRef} />
            </div>
            
            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-panel-light flex-shrink-0 flex space-x-2">
              <input
                type="text"
                placeholder="Ask about Beta..."
                className="form-input flex-grow"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="submit"
                className="form-button w-auto px-4"
                disabled={isLoading}
              >
                {isLoading ? "..." : "Send"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIHelperChat;

