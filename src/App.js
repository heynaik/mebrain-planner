// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Planner from "./pages/Planner";
import Login from "./pages/Login";
import Header from "./components/Header";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center mt-20 text-lg">Loading...</div>;

  return (
    <Router>
      {user && <Header user={user} onLogout={() => signOut(auth)} />}

      <Routes>
        <Route path="/" element={<Navigate to={user ? "/planner" : "/login"} />} />
        <Route
          path="/planner"
          element={user ? <Planner user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/planner" />}
        />
      </Routes>
    </Router>
  );
}