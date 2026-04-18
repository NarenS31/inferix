import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";
import { prisma } from "../lib/prisma";

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;

  if (!bearerToken) {
    res.status(401).json({ error: { message: "Missing Authorization header", type: "auth_error", code: 401 } });
    return;
  }

  // ApiKey path: inf_live_ prefix
  if (bearerToken.startsWith("inf_live_")) {
    const apiKey = await prisma.apiKey.findUnique({
      where: { key: bearerToken },
      include: { user: true },
    });

    if (!apiKey || !apiKey.active) {
      res.status(401).json({ error: { message: "Invalid or revoked API key", type: "auth_error", code: 401 } });
      return;
    }

    // Update lastUsedAt asynchronously — don't block the request
    prisma.apiKey.update({ where: { id: apiKey.id }, data: { lastUsedAt: new Date() } }).catch(() => undefined);

    res.locals.userId = apiKey.userId;
    res.locals.userPlan = apiKey.user.plan;
    next();
    return;
  }

  // JWT path
  try {
    const payload = verifyToken(bearerToken);
    res.locals.userId = payload.userId;
    res.locals.userPlan = payload.plan;
    next();
  } catch {
    res.status(401).json({ error: { message: "Invalid or expired token", type: "auth_error", code: 401 } });
  }
}
