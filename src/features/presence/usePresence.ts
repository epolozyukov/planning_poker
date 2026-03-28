"use client";

import { useEffect, useRef } from "react";
import { HEARTBEAT_INTERVAL_MS } from "@/shared/config";
import { sendHeartbeat } from "@/features/room/roomApi";

interface UsePresenceOptions {
  roomId: string;
  participantId: string | null;
  enabled: boolean;
}

export function usePresence({
  roomId,
  participantId,
  enabled,
}: UsePresenceOptions) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!enabled || !participantId) return;

    const beat = () => {
      sendHeartbeat(roomId, participantId);
    };

    // Send immediately
    beat();

    intervalRef.current = setInterval(beat, HEARTBEAT_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [roomId, participantId, enabled]);
}

export function isParticipantActive(lastSeen: string): boolean {
  const HOST_TIMEOUT_MS = 8000;
  const now = Date.now();
  const seen = new Date(lastSeen).getTime();
  return now - seen < HOST_TIMEOUT_MS;
}
