import { describe, it, expect } from "vitest";
import { sanitizeNickname, validateNickname, sanitizeRoomId, sanitizeStoryLabel } from "../sanitize";

describe("sanitizeNickname", () => {
  it("trims whitespace", () => {
    expect(sanitizeNickname("  alice  ")).toBe("alice");
  });

  it("strips XSS characters", () => {
    // strips <>"'`& then truncates to max length (20)
    expect(sanitizeNickname('<script>alert("xss")</script>')).toBe("scriptalert(xss)/scr");
  });

  it("truncates to max length", () => {
    expect(sanitizeNickname("a".repeat(30))).toHaveLength(20);
  });

  it("preserves normal names", () => {
    expect(sanitizeNickname("Alice")).toBe("Alice");
  });
});

describe("validateNickname", () => {
  it("returns null for valid nickname", () => {
    expect(validateNickname("Alice")).toBeNull();
  });

  it("returns error for empty nickname", () => {
    expect(validateNickname("")).not.toBeNull();
  });

  it("returns error for whitespace-only nickname", () => {
    expect(validateNickname("   ")).not.toBeNull();
  });

  it("sanitizes before validating so truncated long input is accepted", () => {
    // sanitizeNickname truncates to 20, so a 25-char input becomes valid
    expect(validateNickname("a".repeat(25))).toBeNull();
  });
});

describe("sanitizeRoomId", () => {
  it("uppercases input", () => {
    expect(sanitizeRoomId("abc123")).toBe("ABC123");
  });

  it("removes non-alphanumeric characters", () => {
    expect(sanitizeRoomId("AB-CD!1")).toBe("ABCD1");
  });

  it("truncates to 6 characters", () => {
    expect(sanitizeRoomId("ABCDEFGHIJ")).toBe("ABCDEF");
  });
});

describe("sanitizeStoryLabel", () => {
  it("trims whitespace", () => {
    expect(sanitizeStoryLabel("  fix bug  ")).toBe("fix bug");
  });

  it("strips XSS characters", () => {
    expect(sanitizeStoryLabel("<b>bold</b>")).toBe("bbold/b");
  });

  it("truncates to 200 characters", () => {
    expect(sanitizeStoryLabel("x".repeat(250))).toHaveLength(200);
  });
});
