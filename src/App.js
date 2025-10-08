// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./pages/Login";
import Planner from "./pages/Planner";
import ComingSoon from "./pages/ComingSoon"; // 🆕 Import Coming Soon page
import { Toaster } from "react-hot-toast";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Listen for Firebase login state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return null; // or a small spinner while checking

  return (
    <>
      {/* ✅ Toast provider (for task messages) */}
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            borderRadius: "12px",
            background: "#fff",
            color: "#111827",
            fontWeight: 500,
            boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          },
        }}
      />

      <Router>
        <Routes>
          {/* 🔹 If not signed in -> Login; else -> Planner */}
          <Route
            path="/"
            element={user ? <Navigate to="/planner" /> : <Login />}
          />
          <Route
            path="/planner"
            element={user ? <Planner user={user} /> : <Navigate to="/" />}
          />

          {/* 📝 Notes Coming Soon Page */}
          <Route path="/notes" element={<ComingSoon />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;