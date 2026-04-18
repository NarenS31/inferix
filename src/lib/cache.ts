import Anthropic from "@anthropic-ai/sdk";
import type { Cache, CacheSetting } from "@prisma/client";
import { createHash } from "node:crypto";
import type { ChatCompletionRequest, ChatCompletionResponse, Provider } from "../types";
import { prisma } from "./prisma";
import { getRedisClient } from "./redis";
import { detectProvider } from "../utils/provider-detect";

const DEFAULT_CACHE_TTL_SECONDS = 24 * 60 * 60;
const DEFAULT_SIMILARITY_THRESHOLD = 0.92;
const DEFAULT_CACHE_ENABLED = true;
const EMBEDDING_DIMENSION = 64;

const embeddingsClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface CacheSettingsResolved {
  endpointTag: string;
  ttlSeconds: number;
  similarityThreshold: number;
  enabled: boolean;
}

export interface CacheHitResult {
  response: ChatCompletionResponse;
  similarity: number;
  cacheEntryId: string;
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function extractPromptText(req: ChatCompletionRequest): string {
  return req.messages
    .map((msg) => {
      if (typeof msg.content === "string") {
        return msg.content;
      }
      if (!Array.isArray(msg.content)) {
        return "";
      }
      return msg.content.map((part) => (part.type === "text" ? part.text ?? "" : "")).join(" ");
    })
    .join("\n")
    .trim();
}

function deterministicEmbedding(text: string): number[] {
  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  const vector = new Array<number>(EMBEDDING_DIMENSION).fill(0);

  for (const word of words) {
    const hash = sha256(word);
    for (let i = 0; i < EMBEDDING_DIMENSION; i += 1) {
      const slice = hash.slice((i % 16) * 4, (i % 16) * 4 + 4);
      const value = parseInt(slice, 16) / 65535;
      vector[i] += value;
    }
  }

  const norm = Math.sqrt(vector.reduce((sum, n) => sum + n * n, 0)) || 1;
  return vector.map((n) => Number((n / norm).toFixed(8)));
}

function safeParseEmbedding(raw: string): number[] | null {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    if (parsed.length < EMBEDDING_DIMENSION) return null;
    const values = parsed.slice(0, EMBEDDING_DIMENSION).map((v) => Number(v));
    if (values.some((v) => Number.isNaN(v))) return null;
    return values;
  } catch {
    return null;
  }
}

async function haikuEmbedding(text: string): Promise<number[]> {
  const prompt = [
    "Generate a compact semantic embedding vector.",
    `Return ONLY a JSON array of ${EMBEDDING_DIMENSION} floating-point values between -1 and 1.`,
    "No prose, no markdown, no labels.",
    `Input text: ${text}`,
  ].join("\n");

  const response = await embeddingsClient.messages.create({
    model: "claude-3-5-haiku-20241022",
    max_tokens: 900,
    temperature: 0,
    messages: [{ role: "user", content: prompt }],
  });

  const output = response.content
    .filter((item) => item.type === "text")
    .map((item) => (item.type === "text" ? item.text : ""))
    .join("\n");

  const parsed = safeParseEmbedding(output);
  if (!parsed) {
    throw new Error("Invalid embedding output from haiku model");
  }

  return parsed;
}

async function getPromptEmbedding(prompt: string): Promise<number[]> {
  const embeddingKey = `inferix:embed:${sha256(prompt)}`;
  const redis = await getRedisClient();

  if (redis) {
    const raw = await redis.get(embeddingKey);
    if (raw) {
      const parsed = safeParseEmbedding(raw);
      if (parsed) {
        return parsed;
      }
    }
  }

  let embedding: number[];
  try {
    embedding = await haikuEmbedding(prompt);
  } catch {
    // Fallback embedding keeps cache functional when Anthropic is unavailable.
    embedding = deterministicEmbedding(prompt);
  }

  if (redis) {
    await redis.set(embeddingKey, JSON.stringify(embedding), { EX: DEFAULT_CACHE_TTL_SECONDS });
  }

  return embedding;
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB) || 1;
  return dot / denom;
}

async function getCacheSettings(userId: string, endpointTag: string): Promise<CacheSettingsResolved> {
  const [exact, wildcard] = await Promise.all([
    prisma.cacheSetting.findUnique({ where: { userId_endpointTag: { userId, endpointTag } } }),
    prisma.cacheSetting.findUnique({ where: { userId_endpointTag: { userId, endpointTag: "*" } } }),
  ]);

  const source = exact ?? wildcard;
  if (!source) {
    return {
      endpointTag,
      ttlSeconds: DEFAULT_CACHE_TTL_SECONDS,
      similarityThreshold: DEFAULT_SIMILARITY_THRESHOLD,
      enabled: DEFAULT_CACHE_ENABLED,
    };
  }

  return {
    endpointTag,
    ttlSeconds: source.ttlSeconds,
    similarityThreshold: source.similarityThreshold,
    enabled: source.enabled,
  };
}

function parseCachedResponse(raw: string): ChatCompletionResponse | null {
  try {
    return JSON.parse(raw) as ChatCompletionResponse;
  } catch {
    return null;
  }
}

function notExpiredFilter(now: Date): { OR: Array<{ expiresAt: null } | { expiresAt: { gt: Date } }> } {
  return {
    OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
  };
}

async function getRedisCacheResponse(userId: string, promptHash: string): Promise<ChatCompletionResponse | null> {
  const redis = await getRedisClient();
  if (!redis) return null;

  const raw = await redis.get(`inferix:cache:${userId}:${promptHash}`);
  if (!raw) return null;
  return parseCachedResponse(raw);
}

async function setRedisCacheResponse(
  userId: string,
  promptHash: string,
  response: ChatCompletionResponse,
  ttlSeconds: number
): Promise<void> {
  const redis = await getRedisClient();
  if (!redis) return;

  await redis.set(`inferix:cache:${userId}:${promptHash}`, JSON.stringify(response), { EX: ttlSeconds });
}

export async function checkCache(
  userId: string,
  endpointTag: string,
  prompt: string
): Promise<CacheHitResult | null> {
  const settings = await getCacheSettings(userId, endpointTag);
  if (!settings.enabled) {
    return null;
  }

  const now = new Date();
  const promptHash = sha256(prompt);

  const redisExact = await getRedisCacheResponse(userId, promptHash);
  if (redisExact) {
    return { response: redisExact, similarity: 1, cacheEntryId: "redis-exact" };
  }

  const exact = await prisma.cache.findFirst({
    where: {
      userId,
      endpointTag: { in: [endpointTag, "*"] },
      promptHash,
      ...notExpiredFilter(now),
    },
    orderBy: { createdAt: "desc" },
  });

  if (exact) {
    const parsed = parseCachedResponse(exact.response);
    if (parsed) {
      await prisma.cache.update({ where: { id: exact.id }, data: { hitCount: { increment: 1 } } });
      return { response: parsed, similarity: 1, cacheEntryId: exact.id };
    }
  }

  const incomingEmbedding = await getPromptEmbedding(prompt);
  const candidates = await prisma.cache.findMany({
    where: {
      userId,
      endpointTag: { in: [endpointTag, "*"] },
      ...notExpiredFilter(now),
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  let best: { row: Cache; score: number } | null = null;

  for (const row of candidates) {
    const score = cosineSimilarity(incomingEmbedding, row.promptEmbedding);
    if (score > settings.similarityThreshold && (!best || score > best.score)) {
      best = { row, score };
    }
  }

  if (!best) {
    return null;
  }

  const parsed = parseCachedResponse(best.row.response);
  if (!parsed) {
    return null;
  }

  await prisma.cache.update({ where: { id: best.row.id }, data: { hitCount: { increment: 1 } } });
  return { response: parsed, similarity: Number(best.score.toFixed(6)), cacheEntryId: best.row.id };
}

export async function storeCache(
  userId: string,
  endpointTag: string,
  prompt: string,
  response: ChatCompletionResponse,
  model: string,
  provider: Provider
): Promise<void> {
  const settings = await getCacheSettings(userId, endpointTag);
  if (!settings.enabled || provider === "cache") {
    return;
  }

  const promptHash = sha256(prompt);
  const promptEmbedding = await getPromptEmbedding(prompt);
  const expiresAt = settings.ttlSeconds > 0 ? new Date(Date.now() + settings.ttlSeconds * 1000) : null;

  await prisma.cache.create({
    data: {
      userId,
      endpointTag,
      promptHash,
      promptEmbedding,
      response: JSON.stringify(response),
      model,
      provider,
      expiresAt,
    },
  });

  await setRedisCacheResponse(userId, promptHash, response, settings.ttlSeconds);
}

export async function listCacheEntries(userId: string): Promise<Cache[]> {
  return prisma.cache.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 200 });
}

export async function deleteCacheEntry(userId: string, id: string): Promise<number> {
  const deleted = await prisma.cache.deleteMany({ where: { id, userId } });
  return deleted.count;
}

export async function clearCacheForUser(userId: string): Promise<number> {
  const deleted = await prisma.cache.deleteMany({ where: { userId } });
  return deleted.count;
}

export async function upsertCacheSetting(
  userId: string,
  endpointTag: string,
  payload: Partial<Pick<CacheSetting, "ttlSeconds" | "similarityThreshold" | "enabled">>
): Promise<CacheSetting> {
  const ttlSeconds = payload.ttlSeconds ?? DEFAULT_CACHE_TTL_SECONDS;
  const similarityThreshold = payload.similarityThreshold ?? DEFAULT_SIMILARITY_THRESHOLD;
  const enabled = payload.enabled ?? DEFAULT_CACHE_ENABLED;

  return prisma.cacheSetting.upsert({
    where: { userId_endpointTag: { userId, endpointTag } },
    update: { ttlSeconds, similarityThreshold, enabled },
    create: { userId, endpointTag, ttlSeconds, similarityThreshold, enabled },
  });
}

export async function getCacheSettingsForUser(userId: string): Promise<CacheSetting[]> {
  return prisma.cacheSetting.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}
