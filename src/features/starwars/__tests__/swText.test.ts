import { describe, it, expect } from "vitest";
import { getLabels, defaultLabels, swLabels } from "../swText";

describe("getLabels", () => {
  it("returns defaultLabels when SW mode is off", () => {
    expect(getLabels(false)).toBe(defaultLabels);
  });

  it("returns swLabels when SW mode is on", () => {
    expect(getLabels(true)).toBe(swLabels);
  });
});

describe("defaultLabels", () => {
  it("round renders correctly", () => {
    expect(defaultLabels.round(1)).toBe("Round 1");
    expect(defaultLabels.round(5)).toBe("Round 5");
  });

  it("phase renders correctly", () => {
    expect(defaultLabels.phase("voting")).toBe("Voting");
    expect(defaultLabels.phase("revealed")).toBe("Revealed");
  });

  it("votesSubmitted renders correctly", () => {
    expect(defaultLabels.votesSubmitted(2, 4)).toBe("2/4 voted");
  });

  it("waitingReveal renders correctly", () => {
    expect(defaultLabels.waitingReveal(1, 3)).toContain("1/3");
  });

  it("all string fields are non-empty", () => {
    const stringFields = [
      "appName", "participants", "revealCards", "newRound", "chooseCard",
      "yourVote", "newRoom", "copyInviteLink", "aiQuotes", "roomInfo",
      "roomId", "deck", "roundLabel", "storyPlaceholder", "estimatingPrefix",
      "individualVotes", "highVariance", "someVariance", "goodConsensus",
      "infinityMessage", "coffeeMessage", "joinRoom", "yourNickname",
      "joinTable", "createRoom", "swToggleLabel",
    ] as const;
    for (const field of stringFields) {
      expect(defaultLabels[field], `defaultLabels.${field} should be non-empty`).not.toBe("");
    }
  });
});

describe("swLabels", () => {
  it("round uses Mission prefix", () => {
    expect(swLabels.round(1)).toBe("Mission 1");
    expect(swLabels.round(3)).toBe("Mission 3");
  });

  it("phase uses SW terms", () => {
    expect(swLabels.phase("voting")).toBe("Deliberating");
    expect(swLabels.phase("revealed")).toBe("Force Revealed");
  });

  it("votesSubmitted uses aligned", () => {
    expect(swLabels.votesSubmitted(2, 4)).toBe("2/4 aligned");
  });

  it("waitingReveal uses SW language", () => {
    const msg = swLabels.waitingReveal(2, 5);
    expect(msg).toContain("2/5");
    expect(msg).toContain("Council");
  });

  it("revealCards uses SW language", () => {
    expect(swLabels.revealCards).toBe("Feel the Force");
  });

  it("newRound uses SW language", () => {
    expect(swLabels.newRound).toBe("New Mission");
  });

  it("participants uses SW language", () => {
    expect(swLabels.participants).toBe("Jedi Knights");
  });

  it("all string fields are non-empty", () => {
    const stringFields = [
      "appName", "participants", "revealCards", "newRound", "chooseCard",
      "yourVote", "newRoom", "copyInviteLink", "aiQuotes", "roomInfo",
      "roomId", "deck", "roundLabel", "storyPlaceholder", "estimatingPrefix",
      "individualVotes", "highVariance", "someVariance", "goodConsensus",
      "infinityMessage", "coffeeMessage", "joinRoom", "yourNickname",
      "joinTable", "createRoom", "swToggleLabel",
    ] as const;
    for (const field of stringFields) {
      expect(swLabels[field], `swLabels.${field} should be non-empty`).not.toBe("");
    }
  });

  it("SW labels differ from default labels for key fields", () => {
    expect(swLabels.appName).not.toBe(defaultLabels.appName);
    expect(swLabels.revealCards).not.toBe(defaultLabels.revealCards);
    expect(swLabels.newRound).not.toBe(defaultLabels.newRound);
    expect(swLabels.participants).not.toBe(defaultLabels.participants);
  });
});
