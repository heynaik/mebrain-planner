// src/components/ProgressOrb.jsx
import React from "react";
import { motion } from "framer-motion";

export default function ProgressOrb({
  percent = 0,
  size = 72,
  stroke = 8,
  showCenter = false, // default: no text inside
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - percent / 100);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "white",
        boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#FB7185" />
          </linearGradient>
        </defs>

        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={stroke}
          fill="none"
        />

        {/* Progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transition={{ duration: 0.6 }}
        />
      </svg>

      {/* Optional percent text (hidden unless showCenter = true) */}
      {showCenter && (
        <span className="absolute text-xs font-semibold text-gray-700">
          {Math.round(percent)}%
        </span>
      )}
    </div>
  );
}