import React from "react";
import Planner from "./pages/Planner";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-6 sm:px-10 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold select-none">
          <span className="text-gray-700 dark:text-gray-200">Me</span>
          <span className="text-indigo-500">Brain</span>
        </h1>
        <ThemeToggle />
      </header>

      {/* Main Planner */}
      <Planner />
    </div>
  );
}