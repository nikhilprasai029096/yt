import React from "react";
import Home from "./pages/Home";
import "./index.css";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-4">
      <h1 className="text-4xl font-bold text-center mb-6 animate-fade-in">🎬 VidVortex</h1>
      <Home />
    </div>
  );
}

export default App;
