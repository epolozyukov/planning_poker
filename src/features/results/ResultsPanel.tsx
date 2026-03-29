"use client";

import React from "react";
import { RoomState } from "@/shared/types";
import { calculateStats } from "@/shared/utils/stats";
import { Badge } from "@/shared/components/Badge";
import { useStarWars } from "@/features/starwars/StarWarsContext";
import { getLabels } from "@/features/starwars/swText";

interface ResultsPanelProps {
  room: RoomState;
}

export function ResultsPanel({ room }: ResultsPanelProps) {
  const { isSwMode } = useStarWars();
  const labels = getLabels(isSwMode);
  const stats = calculateStats(room.votes);

  if (room.phase !== "revealed") return null;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Special banners */}
      {stats.hasInfinity && (
        <div className="flex items-center gap-3 px-4 py-3 bg-purple-900/50 border border-purple-700/50 rounded-xl">
          <span className="text-2xl" aria-hidden="true">∞</span>
          <p className="text-purple-200 text-sm">{labels.infinityMessage}</p>
        </div>
      )}
      {stats.hasCoffee && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-900/50 border border-amber-700/50 rounded-xl">
          <span className="text-2xl" aria-hidden="true">☕</span>
          <p className="text-amber-200 text-sm">{labels.coffeeMessage}</p>
        </div>
      )}

      {/* Stats grid */}
      {stats.numericCount > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Average" value={stats.average !== null ? String(stats.average) : "—"} accent="amber" />
          <StatCard label="Min" value={stats.min !== null ? String(stats.min) : "—"} accent="green" />
          <StatCard label="Max" value={stats.max !== null ? String(stats.max) : "—"} accent="red" />
          <StatCard
            label="Mode"
            value={stats.mode !== null ? String(stats.mode) : "—"}
            accent="blue"
            subtitle={stats.mode ? "most common" : "no consensus"}
          />
        </div>
      )}

      {/* Spread indicator */}
      {stats.spread !== null && stats.spread > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-green-400">Spread:</span>
          <span
            className={[
              "font-medium",
              stats.spread > 8 ? "text-red-400" : stats.spread > 3 ? "text-amber-400" : "text-green-400",
            ].join(" ")}
          >
            {stats.spread} points
          </span>
          {stats.spread > 8 && (
            <Badge variant="danger">{labels.highVariance}</Badge>
          )}
          {stats.spread > 3 && stats.spread <= 8 && (
            <Badge variant="warning">{labels.someVariance}</Badge>
          )}
          {stats.spread <= 3 && (
            <Badge variant="success">{labels.goodConsensus}</Badge>
          )}
        </div>
      )}

      {/* Individual votes */}
      <div>
        <h3 className="text-green-300 text-xs font-semibold uppercase tracking-wider mb-3">
          {labels.individualVotes}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Object.entries(room.participants).map(([pid, participant]) => {
            const vote = room.votes[pid];
            return (
              <div
                key={pid}
                className="flex items-center justify-between px-3 py-2 bg-green-800/40 rounded-lg border border-green-700/30"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                    style={{ backgroundColor: participant.color }}
                  >
                    {participant.nickname.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-green-200 text-sm truncate">{participant.nickname}</span>
                  {participant.isHost && (
                    <span className="text-amber-500 text-xs flex-shrink-0">
                      <svg className="w-3.5 h-3.5 inline" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </div>
                <span
                  className={[
                    "text-base font-bold ml-2 flex-shrink-0",
                    vote === null
                      ? "text-green-600 text-sm font-normal"
                      : vote === "∞" || vote === "☕"
                      ? "text-amber-400"
                      : "text-white",
                  ].join(" ")}
                >
                  {vote ?? "no vote"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  accent: "amber" | "green" | "red" | "blue";
  subtitle?: string;
}

function StatCard({ label, value, accent, subtitle }: StatCardProps) {
  const accentClasses = {
    amber: "text-amber-400 bg-amber-900/30 border-amber-800/50",
    green: "text-emerald-400 bg-emerald-900/30 border-emerald-800/50",
    red: "text-red-400 bg-red-900/30 border-red-800/50",
    blue: "text-blue-400 bg-blue-900/30 border-blue-800/50",
  };

  return (
    <div
      className={[
        "flex flex-col items-center justify-center p-3 rounded-xl border",
        accentClasses[accent],
      ].join(" ")}
    >
      <span className="text-green-400 text-xs font-medium uppercase tracking-wide mb-1">
        {label}
      </span>
      <span className="text-2xl font-bold">{value}</span>
      {subtitle && <span className="text-xs opacity-60 mt-0.5">{subtitle}</span>}
    </div>
  );
}
