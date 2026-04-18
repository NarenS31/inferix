import { Router, type Request, type Response } from "express";
import {
  clearCacheForUser,
  deleteCacheEntry,
  getCacheSettingsForUser,
  listCacheEntries,
  upsertCacheSetting,
} from "../lib/cache";

const router = Router();

function getUserId(res: Response): string {
  return (res.locals.userId as string | undefined) ?? "anonymous";
}

router.get("/cache", async (_req: Request, res: Response) => {
  const userId = getUserId(res);

  try {
    const [entries, settings] = await Promise.all([listCacheEntries(userId), getCacheSettingsForUser(userId)]);
    res.json({ data: entries, settings });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: { message, type: "db_error" } });
  }
});

router.delete("/cache/:id", async (req: Request, res: Response) => {
  const userId = getUserId(res);
  const { id } = req.params;

  try {
    const deletedCount = await deleteCacheEntry(userId, id);
    if (deletedCount === 0) {
      res.status(404).json({ error: { message: "Cache entry not found", type: "not_found" } });
      return;
    }
    res.status(204).send();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: { message, type: "invalid_request_error" } });
  }
});

router.delete("/cache", async (_req: Request, res: Response) => {
  const userId = getUserId(res);

  try {
    const deletedCount = await clearCacheForUser(userId);
    res.json({ deletedCount });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: { message, type: "db_error" } });
  }
});

router.post("/cache/settings", async (req: Request, res: Response) => {
  const userId = getUserId(res);
  const body = req.body as {
    endpointTag?: string;
    ttlSeconds?: number;
    similarityThreshold?: number;
    enabled?: boolean;
  };

  try {
    const endpointTag = body.endpointTag?.trim() || "*";
    const setting = await upsertCacheSetting(userId, endpointTag, {
      ttlSeconds: body.ttlSeconds,
      similarityThreshold: body.similarityThreshold,
      enabled: body.enabled,
    });
    res.json({ data: setting });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: { message, type: "invalid_request_error" } });
  }
});

export default router;
