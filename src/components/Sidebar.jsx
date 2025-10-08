import React, { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  Target,
  BookOpen,
  Bell,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar({ user }) {
  const [dark, setDark] = useState(
    document.documentElement.classList.contains("dark")
  );
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();

  const toggleTheme = () => {
    setDark(!dark);
    if (!dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  const userName = useMemo(() => user?.displayName || "User", [user]);
  const userEmail = useMemo(() => user?.email || "", [user]);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  const menuItems = [
    { icon: LayoutGrid, to: "/planner", title: "Planner" },
    { icon: Target, to: "/planner#focus", title: "Focus" },
    { icon: BookOpen, to: "/notes", title: "Notes" },
  ];

  return (
    <aside
      className="hidden md:flex flex-col justify-between items-center w-20 bg-white dark:bg-[#0f172a]
      border-r border-gray-100 dark:border-gray-800 fixed top-0 left-0 h-screen z-40 py-6 isolate"
    >
      {/* Logo */}
      <div className="flex flex-col items-center gap-8 select-none">
        <Link to="/planner" className="block">
          <img
            src="/logo192.png"
            alt="MeBrain Logo"
            className="w-10 h-10 object-contain transition-transform duration-300 hover:scale-105"
          />
        </Link>

        {/* Navigation Icons */}
        <nav className="flex flex-col gap-7 mt-4">
          {menuItems.map(({ icon: Icon, to, title }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={title}
                to={to}
                title={title}
                className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-gray-500 hover:text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="w-5 h-5" />
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute left-[-3px] top-1/2 -translate-y-1/2 w-[5px] h-7 rounded-full bg-gradient-to-b from-indigo-400 via-indigo-500 to-indigo-700 shadow-[0_0_8px_rgba(99,102,241,0.4)]"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center gap-5 mb-3 relative">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          title={dark ? "Light Mode" : "Dark Mode"}
        >
          {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>
          <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full"></span>
        </div>

        {/* Profile Avatar */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-400 hover:scale-105 transition"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-500 text-white font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: 4, x: -8 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: 4, x: -8 }}
                transition={{ duration: 0.25 }}
                className="absolute bottom-2 left-14 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
              >
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 text-left">
                  <p className="font-semibold text-gray-900 dark:text-white text-[15px]">
                    {userName}
                  </p>
                  {userEmail && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {userEmail}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-start gap-2 w-full py-3 px-5 text-red-500 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </aside>
  );
}