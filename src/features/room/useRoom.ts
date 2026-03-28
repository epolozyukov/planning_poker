"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { RoomState } from "@/shared/types";
import { usePolling } from "@/shared/hooks/usePolling";
import { POLL_INTERVAL_MS } from "@/shared/config";
import { getRoom } from "./roomApi";

interface UseRoomOptions {
  roomId: string;
  participantId: string | null;
  enabled: boolean;
}

interface UseRoomResult {
  room: RoomState | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  setRoom: (room: RoomState) => void;
}

export function useRoom({
  roomId,
  participantId: _participantId,
  enabled,
}: UseRoomOptions): UseRoomResult {
  const [room, setRoom] = useState<RoomState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedOnce = useRef(false);

  const refresh = useCallback(async () => {
    try {
      const data = await getRoom(roomId);
      if (data) {
        setRoom(data);
        setError(null);
      } else if (hasFetchedOnce.current) {
        setError("Room not found");
      }
    } catch {
      setError("Failed to load room");
    } finally {
      if (!hasFetchedOnce.current) {
        hasFetchedOnce.current = true;
        setLoading(false);
      }
    }
  }, [roomId]);

  // Initial fetch when enabled
  useEffect(() => {
    if (enabled) {
      setLoading(true);
      hasFetchedOnce.current = false;
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  usePolling(refresh, POLL_INTERVAL_MS, enabled);

  return { room, loading, error, refresh, setRoom };
}
