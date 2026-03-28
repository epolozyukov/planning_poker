import { cardToNumber } from "./deck";

export interface VoteStats {
  average: number | null;
  min: number | null;
  max: number | null;
  mode: string | null;
  numericCount: number;
  totalCount: number;
  hasInfinity: boolean;
  hasCoffee: boolean;
  spread: number | null;
}

export function calculateStats(votes: Record<string, string | null>): VoteStats {
  const allVotes = Object.values(votes).filter(
    (v): v is string => v !== null && v !== undefined
  );

  const hasInfinity = allVotes.includes("∞");
  const hasCoffee = allVotes.includes("☕");

  const numericVotes = allVotes
    .map(cardToNumber)
    .filter((v): v is number => v !== null);

  const totalCount = allVotes.length;
  const numericCount = numericVotes.length;

  if (numericCount === 0) {
    return {
      average: null,
      min: null,
      max: null,
      mode: null,
      numericCount,
      totalCount,
      hasInfinity,
      hasCoffee,
      spread: null,
    };
  }

  const average = numericVotes.reduce((a, b) => a + b, 0) / numericCount;
  const min = Math.min(...numericVotes);
  const max = Math.max(...numericVotes);
  const spread = max - min;

  // Calculate mode
  const freq: Record<string, number> = {};
  allVotes.forEach((v) => {
    if (cardToNumber(v) !== null) {
      freq[v] = (freq[v] || 0) + 1;
    }
  });

  let modeVal: string | null = null;
  let modeFreq = 0;
  Object.entries(freq).forEach(([val, count]) => {
    if (count > modeFreq) {
      modeFreq = count;
      modeVal = val;
    }
  });

  // Only report mode if it appears more than once
  const mode = modeFreq > 1 ? modeVal : null;

  return {
    average: Math.round(average * 10) / 10,
    min,
    max,
    mode,
    numericCount,
    totalCount,
    hasInfinity,
    hasCoffee,
    spread,
  };
}
