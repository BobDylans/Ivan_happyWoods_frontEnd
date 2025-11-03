"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "default" | "lg" | "xl";
  withGlow?: boolean;
  className?: string;
  showText?: boolean;
}

const sizeMap = {
  sm: { icon: 32, text: "text-base" },
  default: { icon: 48, text: "text-xl" },
  lg: { icon: 64, text: "text-2xl" },
  xl: { icon: 80, text: "text-4xl" },
} as const;

/**
 * Logo Component
 * HappyWoods logo inspired by Notion's design style
 *
 * @param size - Size variant: sm, default, lg, xl
 * @param withGlow - Enable breathing glow animation
 * @param showText - Show "HappyWoods" text next to logo
 */
export const Logo: React.FC<LogoProps> = ({
  size = "default",
  withGlow = false,
  className,
  showText = true,
}) => {
  const { icon, text } = sizeMap[size];

  const glowAnimation = withGlow
    ? {
        animate: {
          filter: [
            "drop-shadow(0 0 0px rgba(228, 177, 107, 0))",
            "drop-shadow(0 0 8px rgba(228, 177, 107, 0.5))",
            "drop-shadow(0 0 0px rgba(228, 177, 107, 0))",
          ],
        },
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }
    : {};

  return (
    <motion.div className={cn("flex items-center gap-3", className)} {...glowAnimation}>
      {/* Notion-style Logo with "H" for HappyWoods */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Background rounded square */}
        <rect x="8" y="8" width="84" height="84" rx="20" fill="#E4B16B" />

        {/* Inner content background */}
        <rect x="12" y="12" width="76" height="76" rx="16" fill="#F5E6D3" opacity="0.3" />

        {/* Letter "H" with diagonal element - Notion style */}
        <g transform="translate(50, 50)">
          {/* Left vertical bar of H */}
          <rect x="-26" y="-28" width="10" height="56" rx="3" fill="white" />

          {/* Right vertical bar of H */}
          <rect x="16" y="-28" width="10" height="56" rx="3" fill="white" />

          {/* Horizontal bar of H */}
          <rect x="-26" y="-5" width="52" height="10" rx="3" fill="white" />

          {/* Diagonal slash through H (Notion style) */}
          <rect
            x="-3"
            y="-32"
            width="6"
            height="68"
            rx="3"
            fill="white"
            transform="rotate(25)"
            opacity="0.95"
          />

          {/* Small leaf accent in top right */}
          <path d="M 18 -22 Q 22 -26 26 -24 Q 28 -22 26 -18 Q 24 -16 20 -18 Z" fill="#9CAF88" />
        </g>

        {/* Subtle shadow/depth effect */}
        <rect
          x="8"
          y="8"
          width="84"
          height="84"
          rx="20"
          fill="none"
          stroke="white"
          strokeWidth="2"
          opacity="0.2"
        />
      </svg>

      {showText && (
        <span className={cn("font-semibold text-[var(--text-primary)]", text)}>HappyWoods</span>
      )}
    </motion.div>
  );
};
