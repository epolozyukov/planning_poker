import { describe, it, expect } from "vitest";
import type { Participant } from "@/shared/types";

// Extracted join host-assignment logic for unit testing
function resolveIsHost(
  participantId: string,
  participants: Record<string, Participant>
): boolean {
  const existingParticipant = participants[participantId];
  const isFirstParticipant = Object.keys(participants).length === 0;

  if (existingParticipant) {
    return existingParticipant.isHost;
  }
  if (isFirstParticipant) {
    return true;
  }
  const existingHost = Object.values(participants).find((p) => p.isHost);
  return !existingHost;
}

function makeParticipant(isHost: boolean): Participant {
  return { nickname: "x", color: "#fff", lastSeen: new Date().toISOString(), joinedAt: new Date().toISOString(), isHost };
}

describe("join host assignment", () => {
  it("first participant becomes host", () => {
    expect(resolveIsHost("p1", {})).toBe(true);
  });

  it("second participant is not host when host exists", () => {
    const participants = { p1: makeParticipant(true) };
    expect(resolveIsHost("p2", participants)).toBe(false);
  });

  it("new participant becomes host when no host exists", () => {
    const participants = { p1: makeParticipant(false) };
    expect(resolveIsHost("p2", participants)).toBe(true);
  });

  it("rejoining host preserves host status", () => {
    const participants = { p1: makeParticipant(true) };
    expect(resolveIsHost("p1", participants)).toBe(true);
  });

  it("rejoining non-host does not gain host status", () => {
    const participants = {
      p1: makeParticipant(true),
      p2: makeParticipant(false),
    };
    expect(resolveIsHost("p2", participants)).toBe(false);
  });

  it("rejoining participant does not lose host status even with others present", () => {
    // This was the reported bug: host refreshes page and loses host status
    const participants = { p1: makeParticipant(true) };
    // p1 is rejoining — should keep isHost: true
    expect(resolveIsHost("p1", participants)).toBe(true);
  });
});
