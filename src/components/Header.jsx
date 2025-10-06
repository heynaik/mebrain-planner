import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import ThemeToggle from "./ThemeToggle";
import ProfileDropdown from "./ProfileDropdown";

export default function Header({ user }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const navigate = useNavigate();

  // Detect screen size for responsive dropdown
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 bg-white dark:bg-[#0f172a] shadow-sm fixed top-0 left-0 w-full z-50">
      {/* Logo */}
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
        Me<span className="text-indigo-500">Brain</span>
      </h1>

      {/* Controls */}
      <div className="flex items-center gap-2 sm:gap-4 relative">
        <ThemeToggle />

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-indigo-400 dark:border-indigo-500 hover:scale-105 transition-transform"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-semibold">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "?"}
              </div>
            )}
          </button>

          {/* Dropdown / Bottom Sheet */}
          {isDropdownOpen && (
            <ProfileDropdown
              user={user}
              onLogout={handleLogout}
              onClose={() => setIsDropdownOpen(false)}
              isMobile={isMobile}
            />
          )}
        </div>
      </div>
    </header>
  );
}