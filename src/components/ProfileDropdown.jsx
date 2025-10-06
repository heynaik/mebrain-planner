import React, { useEffect, useRef } from "react";
import { signOut } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "../firebase";

export default function ProfileDropdown({ user, onLogout, onClose, isMobile }) {
  const dropdownRef = useRef(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleLogout = async () => {
    await signOut(auth);
    onLogout();
  };

  return (
    <AnimatePresence>
      {isMobile ? (
        // 🔹 Bottom Sheet for Mobile
        <motion.div
          ref={dropdownRef}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl border-t border-gray-200 dark:border-gray-700 z-50"
        >
          <div className="p-6 text-center border-b border-gray-100 dark:border-gray-800">
            <div className="flex flex-col items-center">
              <img
                src={user?.photoURL}
                alt="Profile"
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full border-2 border-indigo-500 mb-3"
              />
              <p className="font-semibold text-gray-900 dark:text-white text-lg">
                {user?.displayName || "User"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate w-full">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="p-4">
            <button
              onClick={handleLogout}
              className="w-full py-3 text-red-500 font-medium rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              Log Out
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 mt-2 text-gray-600 dark:text-gray-300 font-medium rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      ) : (
        // 💻 Floating Menu for Desktop
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute right-0 top-14 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <p className="font-semibold text-gray-900 dark:text-white text-base leading-tight">
              {user?.displayName || "User"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate w-full">
              {user?.email}
            </p>
          </div>

          <div className="p-2">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-500 font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              Log Out
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}