import { NextRequest, NextResponse } from "next/server";
import { getRoom, getRateLimitCount, incrementRateLimit } from "@/api/storage";
import { sanitizeRoomId } from "@/shared/utils/sanitize";
import { QUOTE_RATE_LIMIT, QUOTE_TIMEOUT_MS } from "@/shared/config";

const FALLBACK_QUOTES = [
  "Hopefully no major bugs this sprint, as usual.",
  "Don't forget to write tests — future you will have feelings about this.",
  "Strong consensus. The estimate is probably still wrong, but at least it's consistently wrong.",
  "Someone voted infinity. The story has achieved legendary status.",
  "A break was requested. The code will wait; it has no choice.",
  "Wide spread detected. Either the requirements are unclear, or half the team has context the other half doesn't. Both, probably.",
  "Estimation complete. Now we can all pretend the sprint will go exactly as planned.",
  "Confidence is high; accuracy is traditionally unrelated to confidence.",
  "Remember: this estimate is a promise you're making to yourself. Good luck.",
  "The ticket said two hours. The estimate says eight. The truth is somewhere in the middle, leaning right.",
];

let fallbackIndex = 0;

function getFallbackQuote(): string {
  const quote = FALLBACK_QUOTES[fallbackIndex % FALLBACK_QUOTES.length];
  fallbackIndex += 1;
  return quote!;
}

const GROK_SYSTEM_PROMPT = `You are a sharp, creative observer embedded in a software team's planning session. After each planning-poker reveal you deliver one memorable, funny line about what just happened.
RULES:
- One sentence only. Maximum 25 words.
- Be creative: vary your style each time — use metaphors, absurdist comparisons, mock-formal language, fake historical references, or dramatic understatement.
- Humour must be professional and IT-specific. No politics, religion, or personal criticism.
- Draw from: code reviews, technical debt, tests, wrong estimates, deploys, coffee, deadlines, bugs, legacy code, documentation, on-call, scope creep, rubber-duck debugging, story points, PRs, microservices, git blame, stack overflow, prod incidents.
- Never use exclamation marks. Never use startup clichés like "synergy", "move fast", "10x".
- Do NOT repeat common phrases like "estimation complete" or "the estimate is probably wrong".
- Output the quote only. No preamble, no attribution, no markdown.`;

interface QuoteContext {
  voteCount: number;
  spread: number | null;
  hasInfinity: boolean;
  hasCoffee: boolean;
  votes: string[];
}

function buildUserPrompt(context: QuoteContext): string {
  const parts = [];
  parts.push(`The team just revealed their planning poker votes.`);
  parts.push(`${context.voteCount} people voted.`);

  if (context.hasInfinity) parts.push("Someone voted infinity.");
  if (context.hasCoffee) parts.push("Someone voted coffee break.");
  if (context.spread !== null) {
    if (context.spread === 0) parts.push("Perfect consensus — everyone agreed.");
    else if (context.spread > 8) parts.push(`High variance: spread of ${context.spread} points.`);
    else parts.push(`Spread of ${context.spread} points.`);
  }

  parts.push("Give one dry, witty observation.");
  return parts.join(" ");
}

async function fetchFromGrok(context: QuoteContext): Promise<string | null> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.XAI_MODEL ?? "grok-3-mini";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), QUOTE_TIMEOUT_MS);

  try {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: GROK_SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(context) },
        ],
        max_tokens: 80,
        temperature: 1.1,
      }),
      signal: controller.signal,
    });

    if (!response.ok) return null;

    const data = await response.json() as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content?.trim();
    return content ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchFromGroq(context: QuoteContext): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), QUOTE_TIMEOUT_MS);

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: GROK_SYSTEM_PROMPT },
            { role: "user", content: buildUserPrompt(context) },
          ],
          max_tokens: 80,
          temperature: 1.1,
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) return null;

    const data = await response.json() as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content?.trim();
    return content ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(req: NextRequest) {
  let body: { roomId?: string; context?: QuoteContext };
  try {
    body = await req.json() as { roomId?: string; context?: QuoteContext };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const roomId = sanitizeRoomId(String(body.roomId ?? ""));
  if (!roomId || roomId.length !== 6) {
    return NextResponse.json({ error: "Invalid room ID" }, { status: 400 });
  }

  // Validate room exists
  const room = await getRoom(roomId);
  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 403 });
  }

  // Rate limit per room
  const rateLimitKey = `quote:${roomId}`;
  const count = await incrementRateLimit(rateLimitKey);
  if (count > QUOTE_RATE_LIMIT) {
    return NextResponse.json({ error: "Quote rate limit exceeded" }, { status: 429 });
  }

  const context: QuoteContext = body.context ?? {
    voteCount: 0,
    spread: null,
    hasInfinity: false,
    hasCoffee: false,
    votes: [],
  };

  // Try Grok first, then Groq, then fallback
  let quote = await fetchFromGrok(context);
  if (!quote) {
    quote = await fetchFromGroq(context);
  }
  if (!quote) {
    quote = getFallbackQuote();
  }

  return NextResponse.json({ quote });
}
