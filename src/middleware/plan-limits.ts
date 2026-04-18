import type { Request, Response, NextFunction } from "express";
import type { Plan } from "@prisma/client";
import { prisma } from "../lib/prisma";

const MONTHLY_LIMITS: Record<Plan, number | null> = {
  FREE: 1000,
  STARTER: 500_000,
  GROWTH: 5_000_000,
  SCALE: null, // unlimited
};

export async function planLimitsMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = res.locals.userId as string | undefined;
  const plan = (res.locals.userPlan as Plan | undefined) ?? "FREE";

  if (!userId) {
    next();
    return;
  }

  const limit = MONTHLY_LIMITS[plan];
  if (limit === null) {
    // unlimited
    next();
    return;
  }

  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const count = await prisma.requestLog.count({
    where: { userId, createdAt: { gte: startOfMonth } },
  });

  if (count >= limit) {
    res.status(429).json({
      error: {
        message: "Monthly request limit reached. Upgrade at inferix.ai/pricing",
        type: "quota_exceeded",
        code: 429,
      },
    });
    return;
  }

  next();
}

// Returns whether a plan has caching enabled
export function planAllowsCache(plan: Plan): boolean {
  return plan !== "FREE";
}

// Returns max routing rules for a plan (null = unlimited)
export function planRulesLimit(plan: Plan): number | null {
  if (plan === "FREE") return 0;
  if (plan === "STARTER") return 5;
  return null;
}
