"use client";

import React from "react";

function Chewbacca() {
  return (
    <svg
      width="200"
      height="380"
      viewBox="0 0 200 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fur wisps on top of head */}
      <path d="M75 18 Q65 0 72 -8" stroke="#5c3310" strokeWidth="7" strokeLinecap="round" fill="none"/>
      <path d="M100 12 Q100 -5 100 -14" stroke="#5c3310" strokeWidth="6" strokeLinecap="round" fill="none"/>
      <path d="M125 18 Q135 0 128 -8" stroke="#5c3310" strokeWidth="7" strokeLinecap="round" fill="none"/>

      {/* Head — outer fur shape */}
      <ellipse cx="100" cy="78" rx="66" ry="70" fill="#4a2a0e"/>
      {/* Head — face mid-tone */}
      <ellipse cx="100" cy="88" rx="48" ry="56" fill="#6b3a18"/>
      {/* Cheek fur shaping */}
      <ellipse cx="52" cy="82" rx="22" ry="30" fill="#4a2a0e"/>
      <ellipse cx="148" cy="82" rx="22" ry="30" fill="#4a2a0e"/>

      {/* Brow ridge */}
      <path d="M62 58 Q100 46 138 58" stroke="#3a1e08" strokeWidth="8" fill="none" strokeLinecap="round"/>

      {/* Eyes */}
      <circle cx="78" cy="70" r="12" fill="#1a0800"/>
      <circle cx="122" cy="70" r="12" fill="#1a0800"/>
      {/* Amber iris */}
      <circle cx="78" cy="70" r="7" fill="#8b5e10"/>
      <circle cx="122" cy="70" r="7" fill="#8b5e10"/>
      {/* Pupil */}
      <circle cx="78" cy="70" r="4" fill="#0a0500"/>
      <circle cx="122" cy="70" r="4" fill="#0a0500"/>
      {/* Eye shine */}
      <circle cx="80" cy="67" r="2" fill="rgba(255,255,255,0.5)"/>
      <circle cx="124" cy="67" r="2" fill="rgba(255,255,255,0.5)"/>

      {/* Nose / snout */}
      <ellipse cx="100" cy="108" rx="30" ry="20" fill="#3a1e08"/>
      <ellipse cx="88" cy="106" r="7" fill="#1a0800"/>
      <ellipse cx="112" cy="106" r="7" fill="#1a0800"/>
      {/* Snout texture */}
      <ellipse cx="100" cy="116" rx="20" ry="10" fill="#2a1005"/>

      {/* Mouth / lips */}
      <path d="M74 126 Q100 138 126 126" stroke="#1a0800" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M80 130 Q100 142 120 130" stroke="#2a1005" strokeWidth="2" fill="none" strokeLinecap="round"/>

      {/* Neck / lower face fur */}
      <ellipse cx="100" cy="148" rx="38" ry="18" fill="#4a2a0e"/>

      {/* Body — outer fur mass */}
      <path d="M10 178 Q15 158 100 152 Q185 158 190 178 L196 340 Q196 370 100 374 Q4 370 4 340 Z" fill="#4a2a0e"/>
      {/* Body — chest lighter fur */}
      <path d="M40 175 Q100 168 160 175 L156 330 Q100 338 44 330 Z" fill="#5c3310"/>

      {/* Fur wisps on body sides */}
      <path d="M14 200 Q5 215 8 232" stroke="#3a1e08" strokeWidth="8" strokeLinecap="round" fill="none"/>
      <path d="M16 240 Q6 256 10 272" stroke="#3a1e08" strokeWidth="7" strokeLinecap="round" fill="none"/>
      <path d="M186 200 Q195 215 192 232" stroke="#3a1e08" strokeWidth="8" strokeLinecap="round" fill="none"/>
      <path d="M184 240 Q194 256 190 272" stroke="#3a1e08" strokeWidth="7" strokeLinecap="round" fill="none"/>

      {/* Arms */}
      <path d="M18 185 Q-8 220 -2 270 Q2 294 22 300" stroke="#4a2a0e" strokeWidth="34" fill="none" strokeLinecap="round"/>
      <path d="M182 185 Q208 220 202 270 Q198 294 178 300" stroke="#4a2a0e" strokeWidth="34" fill="none" strokeLinecap="round"/>
      {/* Hands / paws */}
      <ellipse cx="-2" cy="310" rx="20" ry="14" fill="#3a1e08"/>
      <ellipse cx="202" cy="310" rx="20" ry="14" fill="#3a1e08"/>
      {/* Claws */}
      <path d="M-15 316 Q-20 328 -12 332" stroke="#1a0a00" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M-2 320 Q-4 332 4 334" stroke="#1a0a00" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M11 316 Q16 328 8 332" stroke="#1a0a00" strokeWidth="3" strokeLinecap="round" fill="none"/>

      {/* Bandolier strap */}
      <path d="M22 168 Q100 230 178 168" stroke="#7a5a14" strokeWidth="14" fill="none" strokeLinecap="round"/>
      <path d="M22 168 Q35 250 70 334" stroke="#7a5a14" strokeWidth="12" fill="none" strokeLinecap="round"/>
      {/* Bandolier pouches */}
      <rect x="56" y="222" width="18" height="14" rx="3" fill="#5a4010" stroke="#7a5a14" strokeWidth="1.5"/>
      <rect x="82" y="238" width="18" height="14" rx="3" fill="#5a4010" stroke="#7a5a14" strokeWidth="1.5"/>
      <rect x="108" y="246" width="18" height="14" rx="3" fill="#5a4010" stroke="#7a5a14" strokeWidth="1.5"/>

      {/* Legs */}
      <rect x="46" y="334" width="46" height="46" rx="18" fill="#3a1e08"/>
      <rect x="108" y="334" width="46" height="46" rx="18" fill="#3a1e08"/>
      {/* Feet */}
      <ellipse cx="69" cy="376" rx="28" ry="12" fill="#2a1205"/>
      <ellipse cx="131" cy="376" rx="28" ry="12" fill="#2a1205"/>
    </svg>
  );
}

function HanSolo() {
  return (
    <svg
      width="170"
      height="360"
      viewBox="0 0 170 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hair */}
      <path d="M42 42 Q44 14 85 12 Q126 14 128 42" fill="#3a2810"/>
      <path d="M42 42 Q36 28 42 18" stroke="#2a1808" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M128 42 Q134 28 128 18" stroke="#2a1808" strokeWidth="4" fill="none" strokeLinecap="round"/>
      {/* Hair highlight */}
      <path d="M60 18 Q85 10 110 18" stroke="#4a3018" strokeWidth="3" fill="none"/>

      {/* Head */}
      <ellipse cx="85" cy="52" rx="38" ry="40" fill="#c8906a"/>
      {/* Jaw definition */}
      <path d="M54 66 Q85 92 116 66" fill="#b87a58" opacity="0.6"/>

      {/* Eyebrows — furrowed, Han's signature look */}
      <path d="M64 38 Q74 34 82 38" stroke="#2a1808" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M88 38 Q96 34 106 38" stroke="#2a1808" strokeWidth="3" fill="none" strokeLinecap="round"/>

      {/* Eyes */}
      <ellipse cx="73" cy="47" rx="7" ry="6" fill="#1a1008"/>
      <ellipse cx="97" cy="47" rx="7" ry="6" fill="#1a1008"/>
      {/* Iris */}
      <ellipse cx="73" cy="47" rx="4.5" ry="4" fill="#5a3818"/>
      <ellipse cx="97" cy="47" rx="4.5" ry="4" fill="#5a3818"/>
      <ellipse cx="73" cy="47" rx="2.5" ry="2.5" fill="#0a0800"/>
      <ellipse cx="97" cy="47" rx="2.5" ry="2.5" fill="#0a0800"/>
      <circle cx="74" cy="45" r="1.5" fill="rgba(255,255,255,0.6)"/>
      <circle cx="98" cy="45" r="1.5" fill="rgba(255,255,255,0.6)"/>

      {/* Nose */}
      <path d="M82 55 Q78 66 85 68 Q92 66 88 55" fill="#b07a52" opacity="0.7"/>

      {/* Han's trademark smirk */}
      <path d="M70 76 Q82 84 94 80" stroke="#8a5030" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M94 80 Q102 76 100 74" stroke="#8a5030" strokeWidth="2" fill="none" strokeLinecap="round"/>

      {/* Ears */}
      <ellipse cx="47" cy="52" rx="8" ry="10" fill="#b8805a"/>
      <ellipse cx="123" cy="52" rx="8" ry="10" fill="#b8805a"/>

      {/* Neck */}
      <rect x="76" y="90" width="18" height="20" rx="5" fill="#c8906a"/>

      {/* White shirt */}
      <path d="M26 116 Q36 106 85 104 Q134 106 144 116 L148 224 Q85 234 22 224 Z" fill="#ddd8cc"/>

      {/* Dark vest - left panel */}
      <path d="M26 116 Q38 108 58 108 L56 224 L22 224 Z" fill="#1e1c18"/>
      {/* Dark vest - right panel */}
      <path d="M144 116 Q132 108 112 108 L114 224 L148 224 Z" fill="#1e1c18"/>
      {/* Vest collar */}
      <path d="M58 108 Q85 118 112 108 L112 130 Q85 136 58 130 Z" fill="#2a2820"/>

      {/* Belt */}
      <rect x="22" y="218" width="126" height="14" rx="4" fill="#3a2e18"/>
      <rect x="74" y="216" width="22" height="18" rx="3" fill="#8a7030"/>
      {/* Belt buckle detail */}
      <rect x="78" y="219" width="14" height="12" rx="2" fill="#6a5020"/>

      {/* Dark pants */}
      <rect x="26" y="230" width="52" height="128" rx="12" fill="#181618"/>
      <rect x="92" y="230" width="52" height="128" rx="12" fill="#181618"/>
      {/* Pants stripe - yellow/gold Corellian stripe */}
      <rect x="36" y="230" width="4" height="128" rx="2" fill="#8b7020" opacity="0.8"/>

      {/* Holster strap */}
      <path d="M126 232 Q132 264 135 292" stroke="#3a2810" strokeWidth="6" fill="none" strokeLinecap="round"/>
      <rect x="126" y="232" width="6" height="10" rx="2" fill="#2a2010"/>

      {/* DL-44 Blaster */}
      <rect x="128" y="282" width="36" height="12" rx="4" fill="#2a2828"/>
      <rect x="148" y="270" width="10" height="24" rx="3" fill="#2a2828"/>
      <rect x="130" y="285" width="20" height="6" rx="2" fill="#383838"/>
      {/* Barrel */}
      <rect x="160" y="286" width="14" height="6" rx="3" fill="#1a1818"/>

      {/* Hands */}
      <ellipse cx="18" cy="238" rx="13" ry="15" fill="#c8906a"/>
      <ellipse cx="152" cy="244" rx="13" ry="15" fill="#c8906a"/>

      {/* Boots */}
      <rect x="24" y="344" width="54" height="20" rx="8" fill="#1a1410"/>
      <rect x="92" y="344" width="54" height="20" rx="8" fill="#1a1410"/>
      {/* Boot top seam */}
      <path d="M26 344 Q51 340 76 344" stroke="#2a2018" strokeWidth="2" fill="none"/>
      <path d="M94 344 Q119 340 144 344" stroke="#2a2018" strokeWidth="2" fill="none"/>
    </svg>
  );
}

export function SwBackground() {
  return (
    <>
      <div className="sw-char-chewie" aria-hidden="true">
        <Chewbacca />
      </div>
      <div className="sw-char-han" aria-hidden="true">
        <HanSolo />
      </div>
    </>
  );
}
