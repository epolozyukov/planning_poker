"use client";

import React, { useState } from "react";
import { RoomState } from "@/shared/types";
import { Button } from "@/shared/components/Button";
import { useToast } from "@/shared/components/Toast";
import { revealVotes, startNewRound } from "@/features/room/roomApi";

interface RevealPanelProps {
  room: RoomState;
  participantId: string;
  isHost: boolean;
  onRoomUpdate: (room: RoomState) => void;
}

export function RevealPanel({
  room,
  participantId,
  isHost,
  onRoomUpdate,
}: RevealPanelProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const voteCount = Object.values(room.votes).filter((v) => v !== null).length;
  const canReveal = voteCount >= 1;
  const isRevealed = room.phase === "revealed";

  const handleReveal = async () => {
    if (!isHost || !canReveal || loading) return;
    setLoading(true);
    try {
      const updated = await revealVotes(room.id, participantId);
      onRoomUpdate(updated);
    } catch {
      showToast("Failed to reveal votes. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleNewRound = async () => {
    if (!isHost || loading) return;
    setLoading(true);
    try {
      const updated = await startNewRound(room.id, participantId);
      onRoomUpdate(updated);
    } catch {
      showToast("Failed to start new round. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isHost) {
    if (isRevealed) {
      return (
        <div className="text-center py-3">
          <p className="text-green-400 text-sm">Waiting for host to start a new round...</p>
        </div>
      );
    }
    return (
      <div className="text-center py-3">
        <p className="text-green-400 text-sm">
          Waiting for host to reveal votes...{" "}
          <span className="text-green-500">
            {voteCount}/{Object.keys(room.participants).length} voted
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {!isRevealed ? (
        <Button
          onClick={handleReveal}
          disabled={!canReveal}
          loading={loading}
          size="lg"
          className="flex-1 min-w-[160px]"
          title={!canReveal ? "Need at least 1 vote to reveal" : undefined}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Reveal Cards
          {voteCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-amber-700/50 rounded text-xs">
              {voteCount}/{Object.keys(room.participants).length}
            </span>
          )}
        </Button>
      ) : (
        <Button
          onClick={handleNewRound}
          loading={loading}
          size="lg"
          variant="secondary"
          className="flex-1 min-w-[160px]"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          New Round
        </Button>
      )}
    </div>
  );
}
