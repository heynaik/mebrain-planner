// src/pages/ComingSoon.jsx
import React from "react";
import { motion } from "framer-motion";
import { StickyNote } from "lucide-react";

const logo = process.env.PUBLIC_URL + "/logo192.png"; // ✅ Fixed path (logo from public folder)

export default function ComingSoon() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0f172a] relative overflow-hidden">
      {/* 🌀 Subtle background gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-indigo-900 dark:via-[#0f172a] dark:to-purple-950 opacity-60" />

      {/* 💫 Floating soft glow */}
      <motion.div
        initial={{ opacity: 0.2, scale: 0.8 }}
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [0.8, 1, 0.8] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute w-[300px] h-[300px] bg-gradient-to-r from-indigo-400/40 to-purple-400/40 blur-[120px] rounded-full top-1/3 left-1/3"
      />

      {/* 🧠 MeBrain Logo Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative flex flex-col items-center text-center px-6 py-10 bg-white/60 dark:bg-gray-900/50 backdrop-blur-2xl rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50"
      >
        {/* 🧠 Logo */}
        <img
          src={logo}
          alt="MeBrain Logo"
          className="w-20 h-20 mb-4 rounded-xl shadow-md"
        />

        {/* 🌟 Title */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Coming Soon
        </h1>

        {/* 💬 Subtext */}
        <p className="text-gray-600 dark:text-gray-400 max-w-sm text-sm mb-4">
          ✨ We’re working on something exciting — your personal Notes section
          will be here soon!
        </p>

        {/* 📝 Notes chip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium shadow-md"
        >
          <StickyNote className="w-4 h-4" />
          Notes Workspace Loading...
        </motion.div>
      </motion.div>

      {/* 🌈 Footer animation */}
      <motion.div
        className="absolute bottom-8 text-gray-500 dark:text-gray-400 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        MeBrain © 2025
      </motion.div>
    </div>
  );
}