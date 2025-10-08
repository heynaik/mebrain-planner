// src/components/ProgressOrb.jsx
import React from "react";
import { motion } from "framer-motion";

/**
 * ProgressOrb: small, reusable circular progress ring.
 *
 * Props:
 * - percent: number 0..100
 * - size: px (default 72)
 * - stroke: ring thickness (default 8)
 * - showCenter: boolean, whether to render center text (default false)
 */
export default function ProgressOrb({ percent = 0, size = 72, stroke = 8, showCenter = false }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(150, percent)); // allow slight over 100 if you want
  const dashOffset = circumference * (1 - clamped / 100);

  // subtle layered shadow styles (inline to ensure consistency)
  const containerStyle = {
    width: size,
    height: size,
    display: "inline-block",
    position: "relative",
    borderRadius: "9999px",
    // soft outer shadow + small inner "lift"
    boxShadow: "0 10px 20px rgba(16,24,40,0.08), inset 0 -6px 8px rgba(0,0,0,0.03)",
    background: "transparent",
  };

  return (
    <div style={containerStyle} aria-hidden="false">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
        <defs>
          <linearGradient id="orbGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#FB7185" />
          </linearGradient>
        </defs>

        {/* background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#ECECF0"
          strokeWidth={stroke}
          fill="none"
        />

        {/* animated progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#orbGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
        />

        {/* subtle inner ring (thin) for depth */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius - stroke / 2 - 1}
          stroke="rgba(0,0,0,0.02)"
          strokeWidth={1}
          fill="none"
        />
      </svg>

      {/* optional numeric center (hidden by default) */}
      {showCenter && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: Math.max(10, Math.round(size / 6)),
            fontWeight: 600,
            color: "#374151",
            pointerEvents: "none",
          }}
        >
          {Math.round(percent)}%
        </div>
      )}
    </div>
  );
}