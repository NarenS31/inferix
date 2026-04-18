import { stripProviderPrefix } from "../utils/provider-detect";
import type { Provider } from "../types";

interface ModelPrice {
  promptPerMillionUsd: number;
  completionPerMillionUsd: number;
}

type BillableProvider = Exclude<Provider, "cache">;

const PRICE_TABLE: Record<BillableProvider, Record<string, ModelPrice>> = {
  anthropic: {
    "claude-3-5-sonnet": { promptPerMillionUsd: 3, completionPerMillionUsd: 15 },
    "claude-3-5-haiku": { promptPerMillionUsd: 0.8, completionPerMillionUsd: 4 },
    "claude-3-opus": { promptPerMillionUsd: 15, completionPerMillionUsd: 75 },
  },
  openai: {
    "gpt-4o": { promptPerMillionUsd: 5, completionPerMillionUsd: 15 },
    "gpt-4o-mini": { promptPerMillionUsd: 0.15, completionPerMillionUsd: 0.6 },
    o1: { promptPerMillionUsd: 15, completionPerMillionUsd: 60 },
    "o1-mini": { promptPerMillionUsd: 3, completionPerMillionUsd: 12 },
  },
  google: {
    "gemini-2.0-flash": { promptPerMillionUsd: 0.1, completionPerMillionUsd: 0.4 },
    "gemini-1.5-pro": { promptPerMillionUsd: 1.25, completionPerMillionUsd: 5 },
  },
  mistral: {
    "mistral-large": { promptPerMillionUsd: 2, completionPerMillionUsd: 6 },
    "mistral-small": { promptPerMillionUsd: 0.2, completionPerMillionUsd: 0.6 },
  },
  groq: {
    "llama-3.3-70b": { promptPerMillionUsd: 0.59, completionPerMillionUsd: 0.79 },
    "mixtral-8x7b": { promptPerMillionUsd: 0.24, completionPerMillionUsd: 0.24 },
  },
};

function normalizeModel(model: string): string {
  return stripProviderPrefix(model).toLowerCase();
}

export function calculateCostUsd(
  provider: Provider,
  model: string,
  promptTokens: number,
  completionTokens: number
): number {
  if (provider === "cache") {
    return 0;
  }

  const normalized = normalizeModel(model);
  const entry = Object.entries(PRICE_TABLE[provider]).find(([modelPrefix]) => normalized.startsWith(modelPrefix));

  if (!entry) {
    return 0;
  }

  const [, price] = entry;
  const promptCost = (promptTokens / 1_000_000) * price.promptPerMillionUsd;
  const completionCost = (completionTokens / 1_000_000) * price.completionPerMillionUsd;
  return Number((promptCost + completionCost).toFixed(8));
}
