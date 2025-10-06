import React from "react";
import { motion } from "framer-motion";

export default function AnimatedOrb() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: [1, 1.08, 1],
        rotate: [0, 360],
        boxShadow: [
          "0 0 30px rgba(0,150,255,0.3)",
          "0 0 60px rgba(0,255,255,0.4)",
          "0 0 30px rgba(0,150,255,0.3)",
        ],
      }}
      transition={{
        duration: 30,
        repeat: Infinity,
        ease: "linear",
      }}
      className="absolute w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full blur-[120px] mix-blend-screen"
      style={{
        background:
          "radial-gradient(circle at center, rgba(0,180,255,0.3), rgba(0,255,255,0.15), transparent)",
        filter: "blur(140px)",
      }}
    />
  );
}