import { Router, type Request, type Response } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/usage", async (_req: Request, res: Response) => {
  try {
    const logs = await prisma.requestLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    res.json({ data: logs });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: { message, type: "db_error" } });
  }
});

export default router;
