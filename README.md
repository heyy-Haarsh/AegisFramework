Aegis: Portfolio Hedging Dashboard

Aegis is a full-stack web application designed to help portfolio managers analyze and hedge their market risk (Beta).

It provides a professional, interactive dashboard that takes a portfolio's current value, its market risk exposure (Beta), and a desired target Beta, then automatically calculates the optimal number of index futures contracts required to achieve that target.

Features

Core Logic: Implements the financial formula to calculate the exact number of futures contracts (long or short) to modify a portfolio's beta.

Interactive Dashboard: A "Fintech" themed dashboard built with React and Tailwind CSS.

2D Analysis Graph: An interactive line chart (using recharts) that visualizes the relationship between the number of contracts held and the portfolio's resulting beta.

3D Market Risk Widget: A functional 3D particle cloud (using react-three-fiber) that visually represents market volatility. Its color and animation speed change based on the "Current Beta" input.

AI Assistant: A fully functional chatbot (powered by the Gemini API) to answer questions about finance, hedging, beta, or futures.

Tech Stack

Backend

Python 3.10+

FastAPI: For the high-performance API.

Uvicorn: As the ASGI server.

Pydantic: For data validation.

Frontend

React 18 (with Vite)

Tailwind CSS: For all styling.

Recharts: For the 2D analysis graph.

Three.js (@react-three/fiber, @react-three/drei): For the 3D scene.

maath: Helper library for 3D math.

Framer Motion: For all UI animations.

Axios: For API calls.

Installation & Setup

Follow these instructions exactly to get the project running.

Prerequisites

Node.js: (v18 or newer)

Python: (v3.10 or newer)

Google AI API Key: (For the chatbot)

Step 1: Get Your AI API Key

Go to Google AI Studio.

Sign in and click "Get API key" to create a new key.

Copy the key.

Open AegisFramework/frontend/src/components/AIHelperChat.jsx.

Find the apiKey variable (around line 46) and paste your key in:

// Before
const apiKey = "";
// After
const apiKey = "YOUR_API_KEY_GOES_HERE";


Save the file.

Step 2: Run the Backend Server

Open your terminal.

Navigate to the backend directory:

cd AegisFramework/backend


Create a Python virtual environment:

python -m venv .venv


Activate the environment:

On Windows (PowerShell): .\.venv\Scripts\activate

On macOS/Linux (bash): source .venv/bin/activate

Your terminal prompt should now show (.venv). Install the dependencies:

pip install -r requirements.txt


Run the FastAPI server:

uvicorn app.main:app --reload


Leave this terminal running. It will serve the API at http://127.0.0.1:8000.

Step 3: Run the Frontend Application

Open a NEW terminal (leave the backend one running).

Navigate to the frontend directory:

cd AegisFramework/frontend


Install all Node.js dependencies (this will install React, Recharts, maath, etc.):

npm install


Run the Vite development server:

npm run dev


Leave this terminal running. It will serve the website.

Step 4: Use the App

Open your browser and go to the URL provided by Vite, which is usually:

http://localhost:5173

You should see the full dashboard, and all components should be working.

Troubleshooting

CORS Error: If you see a "CORS error" in the browser's F12 console, it means your browser URL doesn't match the backend's "allow list".

Fix: Open AegisFramework/backend/app/main.py. Find the origins list and add the URL from your browser (e.g., "http://192.168.1.5:5173"). Restart the backend server after saving.

Unstyled Button / Missing Graph: If the app looks wrong, it's likely npm install failed.

Fix: Stop the frontend server (Ctrl+C), delete the node_modules folder and the package-lock.json file, and run npm install again.
