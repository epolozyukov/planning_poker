"use client";

import React from "react";

interface PokerCardProps {
  value: string;
  selected?: boolean;
  faceDown?: boolean;
  revealed?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-12 h-16 text-lg",
  md: "w-16 h-24 text-2xl",
  lg: "w-20 h-28 text-3xl",
};

export function PokerCard({
  value,
  selected = false,
  faceDown = false,
  revealed = false,
  onClick,
  disabled = false,
  size = "md",
}: PokerCardProps) {
  const isSpecial = value === "∞" || value === "☕";
  const isClickable = !!onClick && !disabled;

  return (
    <div
      className={[
        "relative flex-shrink-0 cursor-default select-none",
        sizeClasses[size],
        "perspective-500",
      ].join(" ")}
      style={{ perspective: "500px" }}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-pressed={isClickable ? selected : undefined}
      aria-label={isClickable ? `Card ${value}` : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      <div
        className={[
          "w-full h-full relative transition-transform duration-500",
          faceDown && !revealed ? "rotate-y-180" : "",
        ].join(" ")}
        style={{
          transformStyle: "preserve-3d",
          transform: faceDown && !revealed ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.5s ease-in-out",
        }}
      >
        {/* Front face */}
        <div
          className={[
            "absolute inset-0 rounded-xl flex flex-col items-center justify-center border-2 transition-all duration-200",
            "backface-hidden",
            selected
              ? "border-amber-400 bg-amber-50 shadow-card-selected"
              : isClickable
              ? "border-green-600 bg-white shadow-card hover:shadow-card-hover hover:-translate-y-1 hover:border-amber-400"
              : "border-green-700/50 bg-green-800/30 shadow-card",
            disabled && !selected ? "opacity-50 cursor-not-allowed" : "",
          ].join(" ")}
          style={{ backfaceVisibility: "hidden" }}
        >
          <span
            className={[
              "font-bold leading-none",
              selected ? "text-gray-900" : isClickable ? "text-gray-800" : "text-green-200",
              isSpecial ? "text-2xl" : "",
            ].join(" ")}
          >
            {value}
          </span>
          {selected && (
            <div className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full" />
          )}
          {/* Card corner values */}
          {isClickable && (
            <>
              <span
                className={[
                  "absolute top-1 left-1.5 text-xs font-bold leading-none",
                  selected ? "text-gray-700" : "text-gray-500",
                ].join(" ")}
              >
                {value}
              </span>
              <span
                className={[
                  "absolute bottom-1 right-1.5 text-xs font-bold leading-none rotate-180",
                  selected ? "text-gray-700" : "text-gray-500",
                ].join(" ")}
              >
                {value}
              </span>
            </>
          )}
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 rounded-xl flex items-center justify-center border-2 border-green-700/60 bg-green-800"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="w-8 h-10 rounded-lg border-2 border-green-600/60 bg-green-700/40 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-500/60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
