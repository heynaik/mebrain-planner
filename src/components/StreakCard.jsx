import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import toast from "react-hot-toast";

export default function StreakCard({ user }) {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchStreak = async () => {
      const streakRef = doc(db, "streaks", user.uid);
      const snap = await getDoc(streakRef);

      const today = new Date();
      const todayStr = today.toDateString();

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (snap.exists()) {
        const data = snap.data();
        const lastActive = new Date(data.lastActive);
        const daysSince = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

        if (daysSince === 0) {
          // Already opened today — do nothing
          setStreak(data.count || 0);
        } else if (daysSince === 1) {
          // Continued streak
          const newCount = (data.count || 0) + 1;
          await updateDoc(streakRef, { count: newCount, lastActive: todayStr });
          setStreak(newCount);

          // 🎉 Show toast for streak continuation
          if (newCount % 5 === 0) {
            toast.success(`🔥 Amazing! You’ve hit a ${newCount}-day streak!`);
          } else {
            toast(`🔥 Day ${newCount}! Keep it burning!`);
          }
        } else {
          // Missed 2+ days → reset streak
          await updateDoc(streakRef, { count: 1, lastActive: todayStr });
          setStreak(1);

          // 💔 Show toast for reset
          toast.error("💔 You missed a day — starting fresh!");
        }
      } else {
        // First-time user
        await setDoc(streakRef, { count: 1, lastActive: todayStr });
        setStreak(1);
        toast("🔥 Welcome! Your streak starts today!");
      }
    };

    fetchStreak();
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative w-full mt-6 overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-700 shadow-[0_4px_20px_rgba(0,0,0,0.05)] bg-white/70 dark:bg-gray-800/60 backdrop-blur-md flex items-center px-5 py-4"
    >
      {/* 🔥 Animated warm glow background */}
      <motion.div
        className="absolute inset-0 rounded-3xl"
        style={{
          background:
            "radial-gradient(circle at 30% 50%, rgba(255,150,100,0.25), rgba(255,80,90,0.15), transparent 70%)",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.05, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
        }}
      />

      {/* 🔥 Flame Icon */}
      <motion.div
        className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-orange-400 to-pink-500 shadow-[0_0_15px_rgba(255,120,90,0.4)]"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.span
          className="text-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          🔥
        </motion.span>
      </motion.div>

      {/* ✨ Text Info */}
      <div className="relative z-10 ml-4 flex flex-col text-gray-900 dark:text-gray-100">
        <p className="text-2xl font-bold leading-tight flex items-center gap-1">
          {streak} days
          <span className="text-pink-500 text-sm italic font-medium ml-1">
            {streak > 3 ? "You're on fire!" : "Keep it burning 🔥"}
          </span>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Productivity streak
        </p>
      </div>
    </motion.div>
  );
}