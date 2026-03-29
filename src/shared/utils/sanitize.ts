import { MAX_NICKNAME_LENGTH, MIN_NICKNAME_LENGTH } from "@/shared/config";

export function sanitizeNickname(input: string): string {
  return input
    .trim()
    .replace(/[^\p{L}\p{N} \-_.]/gu, "")
    .slice(0, MAX_NICKNAME_LENGTH);
}

export function validateNickname(nickname: string): string | null {
  const sanitized = sanitizeNickname(nickname);
  if (sanitized.length < MIN_NICKNAME_LENGTH) {
    return `Nickname must be at least ${MIN_NICKNAME_LENGTH} character`;
  }
  if (sanitized.length > MAX_NICKNAME_LENGTH) {
    return `Nickname must be at most ${MAX_NICKNAME_LENGTH} characters`;
  }
  return null;
}

export function sanitizeRoomId(input: string): string {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
}

export function sanitizeStoryLabel(input: string): string {
  return input.trim().replace(/[<>&"'`]/g, "").slice(0, 200);
}
