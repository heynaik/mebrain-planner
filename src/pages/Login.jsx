// src/pages/Login.jsx
import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

export default function Login() {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      console.log("✅ Google login success");
    } catch (err) {
      console.error("❌ Google login failed:", err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl text-center w-[360px]">
        <h1 className="text-3xl font-bold mb-4">
          Welcome to <span className="text-indigo-500">MeBrain</span>
        </h1>
        <p className="mb-6 text-gray-500 dark:text-gray-400">
          Sign in with Google to continue
        </p>
        <button
          onClick={handleLogin}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-3 rounded-lg w-full font-semibold transition"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="inline-block mr-2 w-5 h-5 align-text-bottom"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}