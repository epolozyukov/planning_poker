"use client";

import React, { useState, useCallback } from "react";
import { RoomState } from "@/shared/types";
import { getDeck } from "@/shared/utils/deck";
import { PokerCard } from "@/shared/components/PokerCard";
import { Button } from "@/shared/components/Button";
import { useToast } from "@/shared/components/Toast";
import { submitVote } from "@/features/room/roomApi";
import { CUSTOM_CARD_MIN, CUSTOM_CARD_MAX } from "@/shared/config";

interface VotingPanelProps {
  room: RoomState;
  participantId: string;
  onRoomUpdate: (room: RoomState) => void;
}

export function VotingPanel({ room, participantId, onRoomUpdate }: VotingPanelProps) {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const deck = getDeck(room.deck);
  const currentVote = room.votes[participantId];
  const isRevealed = room.phase === "revealed";

  const handleVote = useCallback(
    async (value: string | null) => {
      if (isRevealed || submitting) return;

      const newVote = currentVote === value ? null : value;

      // Optimistic update
      const optimisticRoom: RoomState = {
        ...room,
        votes: { ...room.votes, [participantId]: newVote },
      };
      onRoomUpdate(optimisticRoom);

      setSubmitting(true);
      try {
        const updated = await submitVote(room.id, participantId, newVote);
        onRoomUpdate(updated);
      } catch {
        // Revert optimistic update
        onRoomUpdate(room);
        showToast("Failed to submit vote. Please try again.", "error");
      } finally {
        setSubmitting(false);
      }
    },
    [room, participantId, currentVote, isRevealed, submitting, onRoomUpdate, showToast]
  );

  const handleCustomSubmit = useCallback(async () => {
    const num = parseFloat(customValue);
    if (isNaN(num) || num < CUSTOM_CARD_MIN || num > CUSTOM_CARD_MAX) {
      showToast(`Custom value must be between ${CUSTOM_CARD_MIN} and ${CUSTOM_CARD_MAX}`, "error");
      return;
    }
    const strValue = Number.isInteger(num) ? String(num) : String(Math.round(num * 10) / 10);
    await handleVote(strValue);
    setShowCustomInput(false);
    setCustomValue("");
  }, [customValue, handleVote, showToast]);

  const voteCount = Object.values(room.votes).filter((v) => v !== null).length;
  const totalCount = Object.keys(room.participants).length;

  if (isRevealed) {
    return (
      <div className="text-center py-8">
        <p className="text-green-400 text-sm">Votes have been revealed. Waiting for next round...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Vote progress */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-green-300 font-medium">Your vote</span>
        <span className="text-green-400">
          {voteCount}/{totalCount} voted
        </span>
      </div>

      {/* Card grid */}
      <div className="flex flex-wrap gap-3 justify-center py-2">
        {deck.map((cardValue) => {
          const strValue = String(cardValue);
          return (
            <PokerCard
              key={strValue}
              value={strValue}
              selected={currentVote === strValue}
              onClick={() => handleVote(strValue)}
              disabled={isRevealed || submitting}
              size="md"
            />
          );
        })}

        {/* Custom card for sequence deck */}
        {room.deck === "sequence" && (
          <div className="relative">
            {showCustomInput ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  min={CUSTOM_CARD_MIN}
                  max={CUSTOM_CARD_MAX}
                  placeholder="0-999"
                  className="w-24 px-2 py-1 rounded-lg bg-green-800 border border-green-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCustomSubmit();
                    if (e.key === "Escape") setShowCustomInput(false);
                  }}
                  autoFocus
                />
                <Button size="sm" onClick={handleCustomSubmit}>OK</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowCustomInput(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setShowCustomInput(true)}
                disabled={isRevealed || submitting}
                className="w-16 h-24 rounded-xl border-2 border-dashed border-green-600 hover:border-amber-400 text-green-400 hover:text-amber-400 flex flex-col items-center justify-center text-xs font-medium transition-all duration-200 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                aria-label="Enter custom card value"
              >
                <svg className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Custom
              </button>
            )}
          </div>
        )}
      </div>

      {/* Current vote indicator */}
      {currentVote && (
        <div className="text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-900/40 border border-amber-700/50 rounded-full text-amber-300 text-sm">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            You voted <strong>{currentVote}</strong> — click again to deselect
          </span>
        </div>
      )}
    </div>
  );
}
