import { createClient, type RedisClientType } from "redis";

let redisClient: RedisClientType | null = null;
let redisInitTried = false;

export async function getRedisClient(): Promise<RedisClientType | null> {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    return null;
  }

  if (redisClient?.isOpen) {
    return redisClient;
  }

  if (redisInitTried && !redisClient) {
    return null;
  }

  redisInitTried = true;

  try {
    redisClient = createClient({ url: redisUrl });
    redisClient.on("error", (err) => {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.warn("[inferix] Redis error:", message);
    });
    await redisClient.connect();
    return redisClient;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.warn("[inferix] Redis unavailable, using Postgres fallback:", message);
    redisClient = null;
    return null;
  }
}
