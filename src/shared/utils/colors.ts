const AVATAR_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f59e0b", // amber
];

export function getRandomColor(): string {
  const array = new Uint8Array(1);
  crypto.getRandomValues(array);
  return AVATAR_COLORS[array[0] % AVATAR_COLORS.length];
}

export function getInitials(nickname: string): string {
  return nickname.slice(0, 2).toUpperCase();
}
