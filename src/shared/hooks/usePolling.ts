"use client";

import { useEffect, useRef, useCallback } from "react";

export function usePolling(
  callback: () => void | Promise<void>,
  intervalMs: number,
  enabled: boolean = true
) {
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runningRef = useRef(false);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const schedule = useCallback(() => {
    timerRef.current = setTimeout(async () => {
      if (runningRef.current) {
        schedule();
        return;
      }
      runningRef.current = true;
      try {
        await callbackRef.current();
      } finally {
        runningRef.current = false;
        schedule();
      }
    }, intervalMs);
  }, [intervalMs]);

  useEffect(() => {
    if (!enabled) return;

    schedule();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [enabled, schedule]);
}
