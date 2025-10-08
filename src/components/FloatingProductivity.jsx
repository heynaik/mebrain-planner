import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useDailyProductivity from "../hooks/useDailyProductivity";
import ProgressOrb from "./ProgressOrb";
import confetti from "canvas-confetti";
import { X } from "lucide-react";
import StreakCard from "./StreakCard";

export default function FloatingProductivity({ tasks, user }) {
  const { progress, completedToday, goal, motivation } =
    useDailyProductivity(tasks);
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // 🌈 Glow color by progress
  const getGlowColor = (p) => {
    if (p < 25) return "rgba(124,58,237,0.45)";
    if (p < 50) return "rgba(37,99,235,0.45)";
    if (p < 80) return "rgba(34,197,94,0.45)";
    return "rgba(251,146,60,0.55)";
  };

  // 🎊 Confetti & celebration at 100%
  useEffect(() => {
    if (progress >= 100) {
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      const audio = new Audio("/success.mp3");
      audio.volume = 0.25;
      audio.play().catch(() => {});
      if (navigator.vibrate) navigator.vibrate(150);
    }
  }, [progress]);

  // 💫 Pulse when progress changes
  useEffect(() => {
    if (progress > 0) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 600);
      return () => clearTimeout(t);
    }
  }, [progress]);

  // 📱 Responsive behavior
  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Sizing logic
  const orbSize = isMobile ? 54 : 64;
  const iconSize = isMobile ? "w-6 h-6" : "w-7 h-7";
  const bottomOffset = isMobile ? "bottom-[90px]" : "bottom-6";

  const steps = [
    {
      id: 1,
      title: "Plan your day",
      desc: "Organize what to focus on today.",
      done: completedToday > 0,
    },
    {
      id: 2,
      title: "Complete 3 tasks",
      desc: "You're building momentum.",
      done: completedToday >= 3,
    },
    {
      id: 3,
      title: "Reach 5 tasks",
      desc: "End your day strong.",
      done: completedToday >= 5,
    },
    {
      id: 4,
      title: "Bonus streak",
      desc: "You’re on fire! Keep going!",
      done: completedToday > 5,
    },
  ];

  return (
    <>
      {/* Floating orb trigger button */}
      <motion.button
        onClick={() => setOpen(true)}
        className={`fixed ${bottomOffset} right-6 z-40 flex items-center justify-center rounded-full border-0 bg-transparent`}
        style={{
          width: orbSize,
          height: orbSize,
          boxShadow: "0 8px 18px rgba(16,24,40,0.08)",
        }}
        animate={
          pulse
            ? {
                scale: [1, 1.12, 1],
                boxShadow: [
                  "0 0 0 rgba(255,255,255,0)",
                  `0 0 24px ${getGlowColor(progress)}`,
                  "0 0 0 rgba(255,255,255,0)",
                ],
              }
            : {}
        }
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <div className="relative flex items-center justify-center scale-90 sm:scale-100">
          <ProgressOrb
            percent={progress}
            size={orbSize}
            stroke={6}
            showCenter={false}
          />
          <img
            src="/logo192.png"
            alt="MeBrain"
            className={`absolute ${iconSize} rounded-lg shadow-md`}
          />
        </div>
      </motion.button>

      {/* Slide-up panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Main panel */}
            <motion.div
              className={`fixed bottom-0 right-0 left-0 ${
                isMobile
                  ? "w-full rounded-t-3xl"
                  : "sm:right-6 sm:left-auto sm:w-96 rounded-3xl"
              } bg-white dark:bg-gray-800 shadow-2xl border border-gray-100 dark:border-gray-700 z-50 p-5 flex flex-col`}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 18 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Daily Productivity
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Checkpoints */}
              <div className="space-y-2 overflow-y-auto max-h-[60vh]">
                {steps.map((s) => (
                  <div
                    key={s.id}
                    className={`flex items-start gap-3 rounded-2xl px-3 py-2 ${
                      s.done
                        ? "bg-green-50 dark:bg-green-900/20"
                        : "bg-gray-50 dark:bg-gray-700/40"
                    } transition`}
                  >
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
                        s.done
                          ? "bg-green-100 text-green-600"
                          : "bg-indigo-100 text-indigo-600"
                      }`}
                    >
                      {s.done ? "✔" : s.id}
                    </div>
                    <div className="leading-tight">
                      <p
                        className={`text-[13px] font-medium ${
                          s.done
                            ? "text-gray-500 dark:text-gray-400 line-through"
                            : "text-gray-800 dark:text-gray-100"
                        }`}
                      >
                        {s.title}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 🔥 Streak section */}
              <StreakCard user={user} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}