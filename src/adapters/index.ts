import type { Provider, ProviderAdapter } from "../types";
import { AnthropicAdapter } from "./anthropic";
import { OpenAIAdapter } from "./openai";
import { GoogleAdapter } from "./google";
import { MistralAdapter } from "./mistral";
import { GroqAdapter } from "./groq";

const adapters: Partial<Record<Provider, ProviderAdapter>> = {};

export function getAdapter(provider: Provider): ProviderAdapter {
  if (!adapters[provider]) {
    switch (provider) {
      case "anthropic":
        adapters[provider] = new AnthropicAdapter();
        break;
      case "openai":
        adapters[provider] = new OpenAIAdapter();
        break;
      case "google":
        adapters[provider] = new GoogleAdapter();
        break;
      case "mistral":
        adapters[provider] = new MistralAdapter();
        break;
      case "groq":
        adapters[provider] = new GroqAdapter();
        break;
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }
  return adapters[provider]!;
}
