/**
 * Quick smoke test — set TEST_PROVIDER env var to test one provider:
 *   TEST_PROVIDER=anthropic tsx src/test.ts
 *   TEST_PROVIDER=openai tsx src/test.ts
 *   TEST_PROVIDER=google tsx src/test.ts
 */
import "dotenv/config";
import { detectProvider } from "./utils/provider-detect";
import { getAdapter } from "./adapters";
import type { ChatCompletionRequest } from "./types";

const MODEL_MAP: Record<string, string> = {
  anthropic: "claude-haiku-4-5-20251001",
  openai: "gpt-4o-mini",
  google: "gemini-1.5-flash",
  mistral: "mistral-small-latest",
  groq: "groq/llama-3.1-8b-instant",
};

async function runTest(model: string) {
  const provider = detectProvider(model);
  console.log(`\n--- Testing ${provider} (${model}) ---`);

  const req: ChatCompletionRequest = {
    model,
    messages: [{ role: "user", content: "Say exactly: Hello from Inferix!" }],
    max_tokens: 50,
  };

  const adapter = getAdapter(provider);

  // Non-streaming
  const response = await adapter.complete(req);
  console.log("Non-stream:", response.choices[0].message.content);
  console.log("Tokens:", response.usage);

  // Streaming
  process.stdout.write("Stream: ");
  await adapter.stream({ ...req, stream: true }, (chunk) => {
    const text = chunk.choices[0]?.delta?.content;
    if (text) process.stdout.write(String(text));
  });
  console.log("\n");
}

const target = process.env.TEST_PROVIDER;
const models = target ? [MODEL_MAP[target]].filter(Boolean) : Object.values(MODEL_MAP);

(async () => {
  for (const model of models) {
    try {
      await runTest(model);
    } catch (err) {
      console.error(`FAILED:`, (err as Error).message);
    }
  }
})();
