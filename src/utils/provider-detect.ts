import type { Provider } from "../types";

const MODEL_PREFIXES: Array<[RegExp, Provider]> = [
  [/^claude/i, "anthropic"],
  [/^gpt-|^o1-|^o3-|^o4-|^chatgpt/i, "openai"],
  [/^gemini/i, "google"],
  [/^mistral|^mixtral|^codestral|^ministral/i, "mistral"],
  [/^llama|^deepseek|^qwen|^whisper/i, "groq"],
];

export function detectProvider(model: string): Provider {
  // Explicit prefix: "anthropic/claude-3-5-sonnet" → anthropic
  if (model.includes("/")) {
    const prefix = model.split("/")[0].toLowerCase() as Provider;
    const valid: Provider[] = ["anthropic", "openai", "google", "mistral", "groq"];
    if (valid.includes(prefix)) return prefix;
  }

  for (const [pattern, provider] of MODEL_PREFIXES) {
    if (pattern.test(model)) return provider;
  }

  throw new Error(
    `Cannot detect provider for model "${model}". Use a prefix like "groq/llama-3.1-70b" or a recognized model name.`
  );
}

export function stripProviderPrefix(model: string): string {
  if (model.includes("/")) return model.split("/").slice(1).join("/");
  return model;
}
