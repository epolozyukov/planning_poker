import { QuoteRequest } from "@/shared/types";

export async function fetchQuote(req: QuoteRequest): Promise<string | null> {
  try {
    const response = await fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });

    if (!response.ok) return null;

    const data = await response.json() as { quote?: string };
    return data.quote ?? null;
  } catch {
    return null;
  }
}
