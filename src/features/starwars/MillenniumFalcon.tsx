"use client";

import React from "react";

export function MillenniumFalcon() {
  return (
    <div className="sw-falcon-fly" aria-hidden="true">
      {/* Millennium Falcon SVG */}
      <svg
        width="96"
        height="52"
        viewBox="0 0 96 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Engine glow (rear) */}
        <ellipse cx="90" cy="27" rx="7" ry="10" fill="#60a5fa" opacity="0.85" />
        <ellipse cx="90" cy="27" rx="3.5" ry="5.5" fill="#bfdbfe" />

        {/* Main hull */}
        <ellipse cx="47" cy="27" rx="40" ry="17" fill="#6b7280" />
        <ellipse cx="47" cy="24" rx="40" ry="15" fill="#9ca3af" />

        {/* Hull panel lines */}
        <line x1="20" y1="20" x2="75" y2="20" stroke="#6b7280" strokeWidth="0.8" />
        <line x1="15" y1="27" x2="80" y2="27" stroke="#6b7280" strokeWidth="0.8" />

        {/* Top dome */}
        <ellipse cx="50" cy="17" rx="16" ry="7" fill="#d1d5db" />
        <ellipse cx="50" cy="16" rx="13" ry="5" fill="#e5e7eb" />

        {/* Quad laser cannon (top) */}
        <rect x="48" y="10" width="2.5" height="6" rx="1" fill="#9ca3af" />
        <rect x="45" y="9" width="8" height="2" rx="1" fill="#9ca3af" />

        {/* Cockpit arm */}
        <path d="M22 27 Q12 23 7 27 Q12 31 22 27Z" fill="#9ca3af" />

        {/* Cockpit */}
        <circle cx="7" cy="27" r="7" fill="#374151" stroke="#9ca3af" strokeWidth="1.2" />
        {/* Cockpit windows — glowing blue */}
        <circle cx="7" cy="25" r="2.5" fill="#93c5fd" opacity="0.9" />
        <circle cx="7" cy="29" r="1.5" fill="#93c5fd" opacity="0.7" />

        {/* Hull details */}
        <circle cx="40" cy="27" r="4.5" fill="#4b5563" />
        <circle cx="40" cy="27" r="2.5" fill="#374151" />
        <circle cx="57" cy="27" r="3" fill="#4b5563" />
        <circle cx="65" cy="27" r="2" fill="#4b5563" />
        <circle cx="30" cy="23" r="2" fill="#4b5563" />
        <circle cx="30" cy="31" r="2" fill="#4b5563" />
      </svg>
    </div>
  );
}
