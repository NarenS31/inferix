import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

const providers = ["anthropic", "openai", "google", "mistral", "groq"] as const;

const modelByProvider: Record<(typeof providers)[number], string[]> = {
  anthropic: ["claude-3-5-sonnet", "claude-3-5-haiku", "claude-3-opus"],
  openai: ["gpt-4o", "gpt-4o-mini", "o1", "o1-mini"],
  google: ["gemini-2.0-flash", "gemini-1.5-pro"],
  mistral: ["mistral-large", "mistral-small"],
  groq: ["llama-3.3-70b", "mixtral-8x7b"],
};

const endpointTags = ["dashboard", "chat", "agent", "batch", "untagged"];
const statusCodes = [200, 200, 200, 200, 401, 429, 500, 502];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom<T>(values: T[]): T {
  return values[randomInt(0, values.length - 1)];
}

function calculateSyntheticCostUsd(provider: (typeof providers)[number], model: string, prompt: number, completion: number): number {
  const prices: Record<string, { in: number; out: number }> = {
    "anthropic:claude-3-5-sonnet": { in: 3, out: 15 },
    "anthropic:claude-3-5-haiku": { in: 0.8, out: 4 },
    "anthropic:claude-3-opus": { in: 15, out: 75 },
    "openai:gpt-4o": { in: 5, out: 15 },
    "openai:gpt-4o-mini": { in: 0.15, out: 0.6 },
    "openai:o1": { in: 15, out: 60 },
    "openai:o1-mini": { in: 3, out: 12 },
    "google:gemini-2.0-flash": { in: 0.1, out: 0.4 },
    "google:gemini-1.5-pro": { in: 1.25, out: 5 },
    "mistral:mistral-large": { in: 2, out: 6 },
    "mistral:mistral-small": { in: 0.2, out: 0.6 },
    "groq:llama-3.3-70b": { in: 0.59, out: 0.79 },
    "groq:mixtral-8x7b": { in: 0.24, out: 0.24 },
  };

  const key = `${provider}:${model}`;
  const rate = prices[key] ?? { in: 0, out: 0 };
  return Number((((prompt / 1_000_000) * rate.in) + ((completion / 1_000_000) * rate.out)).toFixed(8));
}

async function main(): Promise<void> {
  const data = Array.from({ length: 50 }).map(() => {
    const provider = randomFrom([...providers]);
    const model = randomFrom(modelByProvider[provider]);
    const requestedModel = Math.random() > 0.4 ? model : randomFrom(modelByProvider[provider]);
    const promptTokens = randomInt(200, 8000);
    const completionTokens = randomInt(50, 4000);
    const totalTokens = promptTokens + completionTokens;
    const statusCode = randomFrom(statusCodes);

    return {
      provider,
      requestedModel,
      model,
      endpoint: randomFrom(endpointTags),
      promptTokens,
      completionTokens,
      totalTokens,
      costUsd: calculateSyntheticCostUsd(provider, model, promptTokens, completionTokens),
      latencyMs: randomInt(80, 8000),
      streaming: Math.random() > 0.5,
      statusCode,
      userId: `user-${randomInt(1, 12)}`,
      error: statusCode >= 400 ? randomFrom(["Rate limited", "Unauthorized", "Provider timeout", "Internal error"]) : null,
    };
  });

  await prisma.requestLog.createMany({ data });
  console.log("Inserted 50 fake request logs.");

  // Seed test user
  const testEmail = "test@inferix.ai";
  const existing = await prisma.user.findUnique({ where: { email: testEmail } });
  if (!existing) {
    const passwordHash = await bcrypt.hash("testpassword123", 12);
    const testUser = await prisma.user.create({
      data: { email: testEmail, passwordHash, name: "Test User", plan: "GROWTH" },
    });
    const key = "inf_live_" + randomBytes(16).toString("hex");
    await prisma.apiKey.create({ data: { userId: testUser.id, key, name: "Default" } });
    console.log(`Created test user: ${testEmail} (plan: GROWTH)`);
    console.log(`API key: ${key}`);
  } else {
    console.log(`Test user already exists: ${testEmail}`);
  }
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
