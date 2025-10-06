// src/App.js
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import Header from "./components/Header";
import ThemeToggle from "./components/ThemeToggle";
import Planner from "./pages/Planner";

function App() {
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);

  useEffect(() => {
    async function testConnection() {
      try {
        // Attempt to read from a collection called "test"
        const querySnapshot = await getDocs(collection(db, "test"));
        console.log("✅ Firebase connection successful");
        setIsFirebaseConnected(true);
      } catch (error) {
        console.error("❌ Firebase connection failed:", error);
        setIsFirebaseConnected(false);
      }
    }
    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <Header />
      
      {/* Theme Toggle */}
      <div className="absolute top-5 right-5">
        <ThemeToggle />
      </div>

      {/* Firebase Connection Status */}
      <div className="text-center mt-6">
        {isFirebaseConnected ? (
          <span className="text-green-400 font-semibold">
            ✅ Firebase Connected Successfully
          </span>
        ) : (
          <span className="text-red-400 font-semibold">
            ❌ Firebase Connection Failed
          </span>
        )}
      </div>

      {/* Planner Page */}
      <main className="p-6">
        <Planner />
      </main>
    </div>
  );
}

export default App;