import { Router, type Request, type Response } from "express";
import { prisma } from "../lib/prisma";
import { invalidateRulesCache, listRulesForUser } from "../lib/rules";

const router = Router();

function getUserId(res: Response): string {
  return (res.locals.userId as string | undefined) ?? "anonymous";
}

router.post("/rules", async (req: Request, res: Response) => {
  const userId = getUserId(res);
  const body = req.body as {
    endpointTag?: string;
    preferredModels?: string[];
    costCeilingUsd?: number | null;
    latencyThresholdMs?: number | null;
    maxTokens?: number | null;
    active?: boolean;
  };

  try {
    const rule = await prisma.routingRule.create({
      data: {
        userId,
        endpointTag: body.endpointTag?.trim() || "*",
        preferredModels: Array.isArray(body.preferredModels) ? body.preferredModels : [],
        costCeilingUsd: body.costCeilingUsd ?? null,
        latencyThresholdMs: body.latencyThresholdMs ?? null,
        maxTokens: body.maxTokens ?? null,
        active: body.active ?? true,
      },
    });

    invalidateRulesCache(userId);
    res.status(201).json({ data: rule });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: { message, type: "invalid_request_error" } });
  }
});

router.get("/rules", async (_req: Request, res: Response) => {
  const userId = getUserId(res);

  try {
    const rules = await listRulesForUser(userId);
    res.json({ data: rules });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: { message, type: "db_error" } });
  }
});

router.put("/rules/:id", async (req: Request, res: Response) => {
  const userId = getUserId(res);
  const { id } = req.params;
  const body = req.body as {
    endpointTag?: string;
    preferredModels?: string[];
    costCeilingUsd?: number | null;
    latencyThresholdMs?: number | null;
    maxTokens?: number | null;
    active?: boolean;
  };

  try {
    const existing = await prisma.routingRule.findFirst({ where: { id, userId } });
    if (!existing) {
      res.status(404).json({ error: { message: "Rule not found", type: "not_found" } });
      return;
    }

    const rule = await prisma.routingRule.update({
      where: { id },
      data: {
        endpointTag: body.endpointTag ?? existing.endpointTag,
        preferredModels: body.preferredModels ?? existing.preferredModels,
        costCeilingUsd: body.costCeilingUsd === undefined ? existing.costCeilingUsd : body.costCeilingUsd,
        latencyThresholdMs:
          body.latencyThresholdMs === undefined ? existing.latencyThresholdMs : body.latencyThresholdMs,
        maxTokens: body.maxTokens === undefined ? existing.maxTokens : body.maxTokens,
        active: body.active ?? existing.active,
      },
    });

    invalidateRulesCache(userId);
    res.json({ data: rule });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: { message, type: "invalid_request_error" } });
  }
});

router.delete("/rules/:id", async (req: Request, res: Response) => {
  const userId = getUserId(res);
  const { id } = req.params;

  try {
    const deleted = await prisma.routingRule.deleteMany({ where: { id, userId } });
    if (deleted.count === 0) {
      res.status(404).json({ error: { message: "Rule not found", type: "not_found" } });
      return;
    }

    invalidateRulesCache(userId);
    res.status(204).send();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: { message, type: "invalid_request_error" } });
  }
});

export default router;
