export type CardValue = string | number;
export type DeckType = "fibonacci" | "sequence";

export const FIBONACCI_DECK: CardValue[] = [
  0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, "∞", "☕",
];

export const SEQUENCE_DECK: CardValue[] = [
  0, "½", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, "∞", "☕",
];

export function getDeck(type: DeckType): CardValue[] {
  return type === "fibonacci" ? FIBONACCI_DECK : SEQUENCE_DECK;
}

export function isNumericCard(value: CardValue): boolean {
  if (value === "∞" || value === "☕") return false;
  if (value === "½") return true;
  return typeof value === "number" || !isNaN(Number(value));
}

export function cardToNumber(value: CardValue): number | null {
  if (value === "∞" || value === "☕") return null;
  if (value === "½") return 0.5;
  const num = Number(value);
  return isNaN(num) ? null : num;
}

export function formatCardDisplay(value: CardValue): string {
  return String(value);
}
