import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import AnimatedOrb from "../components/AnimatedOrb";

export default function Login() {
  const [step, setStep] = useState(0);

  const messages = [
    "// Initializing MeBrain Core Systems...",
    "// Mapping cognitive tasks to neural network...",
    "// Welcome back, your digital workspace is ready.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < messages.length - 1 ? prev + 1 : prev));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#020202] text-white">
      {/* === Deep Neural Gradient Background === */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#0a0a0f_0%,#010101_90%)]"
        animate={{
          opacity: [1, 0.98, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* === Floating Thought Particles === */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 2.5 + 1 + "px",
              height: Math.random() * 2.5 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              backgroundColor: `rgba(0,255,255,${Math.random() * 0.5})`,
              boxShadow: `0 0 ${Math.random() * 6 + 2}px rgba(0,255,255,0.4)`,
            }}
            animate={{
              y: [0, Math.random() * 15 - 10],
              x: [0, Math.random() * 10 - 5],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: Math.random() * 5 + 4,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* === Subtle Cognitive Glows === */}
      <motion.div
        className="absolute top-[10%] left-[10%] w-[260px] h-[260px] rounded-full blur-[130px]"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, rgba(0,255,255,0.15), transparent 70%)",
        }}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[15%] right-[15%] w-[280px] h-[280px] rounded-full blur-[140px]"
        style={{
          background:
            "radial-gradient(circle at 60% 60%, rgba(150,0,255,0.15), transparent 70%)",
        }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* === Central Neural Orb === */}
      <div className="z-[5]">
        <AnimatedOrb />
      </div>

      {/* === Neural Pulse Ring === */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full border border-cyan-400/10 z-[2]"
        animate={{
          scale: [1, 1.4],
          opacity: [0.5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />

      {/* === Brand / Title === */}
      <div className="z-10 text-center space-y-6 px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-5xl md:text-6xl font-light tracking-wide bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,255,255,0.4)]"
        >
          MeBrain
        </motion.h1>

        {/* === Neural Boot Messages === */}
        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8 }}
            className="text-cyan-400/80 text-sm md:text-base font-mono tracking-wide"
          >
            {messages[step]}
          </motion.p>
        </AnimatePresence>

        {/* === Login Button === */}
        {step === messages.length - 1 && (
          <motion.button
            onClick={handleGoogleLogin}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="px-8 py-3 mt-4 bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-semibold rounded-full shadow-[0_0_25px_rgba(0,255,255,0.3)] hover:shadow-[0_0_40px_rgba(0,255,255,0.6)] transition-all duration-300 hover:scale-105 backdrop-blur-sm"
          >
            Connect to MeBrain
          </motion.button>
        )}
      </div>

      {/* === Footer === */}
      <div className="absolute bottom-6 text-xs text-gray-600 font-mono tracking-widest">
        [ Powered by MeBrain AI ]
      </div>
    </div>
  );
}