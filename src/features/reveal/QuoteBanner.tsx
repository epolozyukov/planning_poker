"use client";

import React, { useEffect, useState } from "react";
import { QUOTE_AUTO_DISMISS_MS } from "@/shared/config";
import { useStarWars } from "@/features/starwars/StarWarsContext";

interface QuoteBannerProps {
  quote: string;
  onDismiss: () => void;
}

export function QuoteBanner({ quote, onDismiss }: QuoteBannerProps) {
  const [visible, setVisible] = useState(true);
  const { isSwMode } = useStarWars();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, QUOTE_AUTO_DISMISS_MS);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={[
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        visible ? "animate-slide-down" : "opacity-0 -translate-y-full",
      ].join(" ")}
      role="status"
      aria-live="polite"
    >
      <div className={isSwMode ? "sw-quote-banner border-b backdrop-blur-sm shadow-xl" : "bg-amber-900/95 border-b border-amber-700/60 backdrop-blur-sm shadow-xl"}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-start gap-3">
          <span className={["text-lg flex-shrink-0 mt-0.5", isSwMode ? "sw-quote-icon" : "text-amber-400"].join(" ")} aria-hidden="true">
            {isSwMode ? "⚡" : "✦"}
          </span>
          <p className={["text-sm font-medium leading-relaxed flex-1", isSwMode ? "sw-quote-text" : "text-amber-100"].join(" ")}>
            {quote}
          </p>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => {
                setVisible(false);
                setTimeout(onDismiss, 300);
              }}
              className="text-amber-400 hover:text-amber-200 transition-colors"
              aria-label="Dismiss quote"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
