"use client"

import { motion } from "framer-motion"

export default function AnimatedFeedLogo() {
  return (
    <div className="w-64 h-64 mx-auto relative">
      <motion.svg
        viewBox="0 0 500 400"
        className="w-full h-full"
        initial="initial"
        animate="animate"
      >
        {/* Animated gradient background */}
        <defs>
          <linearGradient id="flow-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f4f0ff" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>
        
        {/* Background circle with gradient */}
        <motion.circle
          cx="200"
          cy="200"
          r="160"
          fill="url(#flow-gradient)"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Input File - simplified corner fold */}
        <motion.path
          d="M100 100 L200 100 L240 140 L200 140 L200 100"
          fill="#9575CD"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        />
        <motion.path
          d="M100 100 L200 100 L200 140 L240 140 L240 300 L100 300 Z"
          fill="#7E57C2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        />
        <text
          x="140"
          y="220"
          fill="white"
          fontSize="32"
          fontWeight="bold"
        >
          CSV
        </text>

        {/* Data flow particles */}
        {[...Array(8)].map((_, i) => (
          <motion.circle
            key={i}
            r="6"
            fill="#FFB300"
            initial={{ x: 180, y: 160 }}
            animate={{
              x: [180, 180, 400],
              y: [160, 280, 280],
              opacity: [0, 1, 0],
              scale: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}

        {/* Output Container - fully visible */}
        <motion.rect
          x="380"
          y="240"
          width="80"
          height="120"
          rx="8"
          fill="#26A69A"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        />

        {/* Validation lines inside output container */}
        {[...Array(3)].map((_, i) => (
          <motion.rect
            key={i}
            x="390"
            y={270 + i * 20}
            width="60"
            height="4"
            rx="2"
            fill="white"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 0.5, scaleX: 1 }}
            transition={{ delay: 1 + i * 0.2, duration: 0.3 }}
          />
        ))}

        {/* Animated checkmark */}
        <motion.path
          d="M395 320 L415 340 L445 300"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            delay: 1.8,
            duration: 0.8,
            repeat: Infinity,
            repeatDelay: 3
          }}
        />
      </motion.svg>
    </div>
  )
}

