import { describe, it, expect } from "vitest";
import { calculateStats } from "../stats";

describe("calculateStats", () => {
  it("returns nulls when no votes", () => {
    const stats = calculateStats({ a: null, b: null });
    expect(stats.average).toBeNull();
    expect(stats.spread).toBeNull();
    expect(stats.totalCount).toBe(0);
  });

  it("calculates average and spread correctly", () => {
    const stats = calculateStats({ a: "2", b: "8" });
    expect(stats.average).toBe(5);
    expect(stats.spread).toBe(6);
    expect(stats.min).toBe(2);
    expect(stats.max).toBe(8);
  });

  it("detects infinity vote", () => {
    const stats = calculateStats({ a: "∞", b: "3" });
    expect(stats.hasInfinity).toBe(true);
  });

  it("detects coffee vote", () => {
    const stats = calculateStats({ a: "☕", b: "5" });
    expect(stats.hasCoffee).toBe(true);
  });

  it("reports mode only when it appears more than once", () => {
    const noMode = calculateStats({ a: "1", b: "2", c: "3" });
    expect(noMode.mode).toBeNull();

    const withMode = calculateStats({ a: "3", b: "3", c: "5" });
    expect(withMode.mode).toBe("3");
  });

  it("spread is 0 on perfect consensus", () => {
    const stats = calculateStats({ a: "5", b: "5", c: "5" });
    expect(stats.spread).toBe(0);
  });

  it("ignores null votes in counts", () => {
    const stats = calculateStats({ a: "5", b: null });
    expect(stats.totalCount).toBe(1);
  });
});
