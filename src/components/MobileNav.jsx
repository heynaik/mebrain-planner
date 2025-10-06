import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, CalendarDays, Sunrise } from "lucide-react";

export default function MobileNav({ activeSection, onSectionChange }) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const tabs = [
    { id: "brainDump", label: "Brain", icon: <Brain size={16} /> },
    { id: "today", label: "Today", icon: <CalendarDays size={16} /> },
    { id: "tomorrow", label: "Tomorrow", icon: <Sunrise size={16} /> },
  ];

  // Detect scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Scrolling down → hide bar
        setIsVisible(false);
      } else {
        // Scrolling up → show bar
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-4 left-0 w-full flex justify-center items-center z-50 sm:hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 70 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <motion.div
            className="flex items-center justify-around bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl 
                       shadow-[0_8px_25px_rgba(0,0,0,0.08)] rounded-full border border-white/30 dark:border-slate-800 
                       w-[85%] max-w-sm py-2 px-4"
          >
            {tabs.map((tab) => {
              const isActive = activeSection === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => onSectionChange(tab.id)}
                  whileTap={{ scale: 0.93 }}
                  className={`flex flex-col items-center justify-center transition-all duration-200 ${
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  <motion.div
                    layout
                    className={`flex items-center justify-center rounded-full p-2 transition-all ${
                      isActive
                        ? "bg-indigo-100 dark:bg-indigo-500/20 scale-105 shadow-sm"
                        : "bg-transparent"
                    }`}
                  >
                    {tab.icon}
                  </motion.div>
                  <span
                    className={`text-[10px] font-medium mt-[2px] ${
                      isActive ? "opacity-100" : "opacity-70"
                    }`}
                  >
                    {tab.label}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}