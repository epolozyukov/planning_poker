"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/Button";
import { useToast } from "@/shared/components/Toast";
import { createRoom } from "@/features/room/roomApi";
import { DeckType } from "@/shared/utils/deck";
import { useStarWars } from "@/features/starwars/StarWarsContext";
import { getLabels } from "@/features/starwars/swText";
import { SwBackground } from "@/features/starwars/SwBackground";

export default function HomePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { isSwMode, toggleSwMode } = useStarWars();
  const labels = getLabels(isSwMode);
  const [deck, setDeck] = useState<DeckType>("fibonacci");
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = async () => {
    setLoading(true);
    try {
      const room = await createRoom({ deck });
      setLoading(false);
      router.push(`/room/${room.id}`);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to create room",
        "error"
      );
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-green-950 felt-texture flex flex-col items-center justify-center p-4">
      {/* Chewbacca + Millennium Falcon background in SW mode */}
      {isSwMode && <SwBackground />}

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-green-800/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-800/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-800 rounded-2xl shadow-xl mb-2 border border-green-700/60">
            <span className="text-3xl" aria-hidden="true">{isSwMode ? "⚡" : "♠"}</span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            {labels.appName}
          </h1>
          <p className="text-green-400 text-lg">
            {isSwMode ? "May the estimates be with you." : "Estimate smarter, together."}
          </p>
        </div>

        {/* Card */}
        <div className="card-felt p-8 space-y-6">
          {/* Deck selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-green-300 uppercase tracking-wider">
              Choose Your Deck
            </label>
            <div className="grid grid-cols-2 gap-3">
              <DeckOption
                type="fibonacci"
                label="Fibonacci"
                description="0, 1, 2, 3, 5, 8, 13..."
                values={["1", "3", "8", "21"]}
                selected={deck === "fibonacci"}
                onSelect={() => setDeck("fibonacci")}
              />
              <DeckOption
                type="sequence"
                label="Linear"
                description="0–12 + custom entry"
                values={["1", "4", "7", "12"]}
                selected={deck === "sequence"}
                onSelect={() => setDeck("sequence")}
              />
            </div>
          </div>

          {/* Deck preview */}
          <DeckPreview deck={deck} />

          {/* Create button */}
          <Button
            onClick={handleCreateRoom}
            loading={loading}
            size="lg"
            className="w-full"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {labels.createRoom}
          </Button>

          {/* SW Mode toggle */}
          <button
            onClick={toggleSwMode}
            aria-label={isSwMode ? "Switch to Standard Mode" : "Switch to Star Wars Mode"}
            className={[
              "w-full text-xs py-2 rounded-lg border transition-colors",
              isSwMode
                ? "text-yellow-400 border-yellow-700/60 hover:border-yellow-500 bg-yellow-950/20"
                : "text-green-500 border-green-800 hover:border-green-600 hover:text-green-300",
            ].join(" ")}
          >
            {isSwMode ? "🌌" : "⚡"} {labels.swToggleLabel}
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { icon: "⚡", label: "Real-time sync" },
            { icon: "🔒", label: "No login needed" },
            { icon: "📊", label: "Instant stats" },
          ].map(({ icon, label }) => (
            <div key={label} className="space-y-1">
              <div className="text-2xl">{icon}</div>
              <div className="text-green-400 text-xs font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

interface DeckOptionProps {
  type: DeckType;
  label: string;
  description: string;
  values: string[];
  selected: boolean;
  onSelect: () => void;
}

function DeckOption({
  label,
  description,
  values,
  selected,
  onSelect,
}: DeckOptionProps) {
  return (
    <button
      onClick={onSelect}
      className={[
        "p-4 rounded-xl border-2 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-green-800",
        selected
          ? "border-amber-400 bg-amber-900/30"
          : "border-green-700/50 bg-green-900/40 hover:border-green-600",
      ].join(" ")}
      aria-pressed={selected}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className={[
            "text-sm font-bold",
            selected ? "text-amber-300" : "text-green-200",
          ].join(" ")}
        >
          {label}
        </span>
        {selected && (
          <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <p className="text-green-500 text-xs mb-3">{description}</p>
      <div className="flex gap-1">
        {values.map((v) => (
          <span
            key={v}
            className={[
              "px-1.5 py-0.5 rounded text-xs font-bold",
              selected
                ? "bg-amber-800/50 text-amber-300"
                : "bg-green-800/60 text-green-400",
            ].join(" ")}
          >
            {v}
          </span>
        ))}
      </div>
    </button>
  );
}

function DeckPreview({ deck }: { deck: DeckType }) {
  const fib = ["0", "1", "2", "3", "5", "8", "13", "21", "∞", "☕"];
  const seq = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "∞", "☕"];
  const values = deck === "fibonacci" ? fib : seq;

  return (
    <div className="flex flex-wrap gap-1.5 justify-center py-2">
      {values.map((v, i) => (
        <span
          key={i}
          className="w-8 h-10 flex items-center justify-center rounded-lg bg-white text-gray-800 text-xs font-bold shadow-sm border border-gray-200"
        >
          {v}
        </span>
      ))}
    </div>
  );
}
