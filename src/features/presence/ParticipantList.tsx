"use client";

import React from "react";
import { RoomState } from "@/shared/types";
import { HOST_TIMEOUT_MS } from "@/shared/config";

interface ParticipantListProps {
  room: RoomState;
  currentParticipantId: string;
}

function isActive(lastSeen: string): boolean {
  return Date.now() - new Date(lastSeen).getTime() < HOST_TIMEOUT_MS;
}

export function ParticipantList({ room, currentParticipantId }: ParticipantListProps) {
  const participants = Object.entries(room.participants);
  const voteCount = Object.values(room.votes).filter((v) => v !== null).length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-green-300 text-xs font-semibold uppercase tracking-wider">
          Participants
        </h3>
        <span className="text-green-500 text-xs">
          {voteCount}/{participants.length} voted
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {participants.map(([pid, participant]) => {
          const hasVoted = room.votes[pid] !== null && room.votes[pid] !== undefined;
          const vote = room.votes[pid];
          const active = isActive(participant.lastSeen);
          const isCurrentUser = pid === currentParticipantId;

          return (
            <div
              key={pid}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-300",
                active
                  ? "bg-green-800/50 border-green-700/40"
                  : "bg-green-900/30 border-green-800/30 opacity-50",
                isCurrentUser ? "ring-1 ring-amber-500/40" : "",
              ].join(" ")}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div
                  className={[
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white transition-opacity",
                    !active ? "opacity-40" : "",
                  ].join(" ")}
                  style={{ backgroundColor: participant.color }}
                >
                  {participant.nickname.slice(0, 2).toUpperCase()}
                </div>
                {/* Active indicator */}
                <div
                  className={[
                    "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-green-900",
                    active ? "bg-emerald-400" : "bg-gray-600",
                  ].join(" ")}
                />
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={[
                      "text-sm font-medium truncate",
                      active ? "text-green-100" : "text-green-600",
                    ].join(" ")}
                  >
                    {participant.nickname}
                  </span>
                  {isCurrentUser && (
                    <span className="text-amber-500 text-xs flex-shrink-0">(you)</span>
                  )}
                  {participant.isHost && (
                    <svg
                      className="w-3.5 h-3.5 text-amber-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-label="Host"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>

              {/* Vote status */}
              <div className="flex-shrink-0">
                {room.phase === "revealed" ? (
                  <span
                    className={[
                      "text-base font-bold",
                      vote === null
                        ? "text-green-700 text-sm font-normal"
                        : vote === "∞" || vote === "☕"
                        ? "text-amber-400"
                        : "text-white",
                    ].join(" ")}
                  >
                    {vote ?? "—"}
                  </span>
                ) : hasVoted ? (
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-8 rounded bg-green-700/60 border border-green-600/40 flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="w-6 h-8 rounded bg-green-900/60 border border-green-800/40 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-700 animate-pulse" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
