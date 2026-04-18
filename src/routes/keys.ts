import { Router, type Request, type Response } from "express";
import { prisma } from "../lib/prisma";
import { generateApiKey } from "../lib/apikey";

const router = Router();

// GET /v1/keys — list active API keys for the current user
router.get("/keys", async (_req: Request, res: Response) => {
  const userId = res.locals.userId as string;

  const keys = await prisma.apiKey.findMany({
    where: { userId, active: true },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, key: true, lastUsedAt: true, createdAt: true },
  });

  res.json({ data: keys });
});

// POST /v1/keys — create a new API key
router.post("/keys", async (req: Request, res: Response) => {
  const userId = res.locals.userId as string;
  const { name } = req.body as { name?: string };

  const key = generateApiKey();
  const apiKey = await prisma.apiKey.create({
    data: { userId, key, name: name ?? "Default" },
    select: { id: true, name: true, key: true, lastUsedAt: true, createdAt: true },
  });

  res.status(201).json(apiKey);
});

// DELETE /v1/keys/:id — revoke a key
router.delete("/keys/:id", async (req: Request, res: Response) => {
  const userId = res.locals.userId as string;
  const { id } = req.params;

  const apiKey = await prisma.apiKey.findUnique({ where: { id } });
  if (!apiKey || apiKey.userId !== userId) {
    res.status(404).json({ error: { message: "API key not found", type: "not_found" } });
    return;
  }

  await prisma.apiKey.update({ where: { id }, data: { active: false } });
  res.json({ ok: true });
});

export default router;
