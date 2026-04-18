import type { NextFunction, Request, Response } from "express";
import type { Provider } from "../types";
import { prisma } from "../lib/prisma";
import { calculateCostUsd } from "../lib/pricing";

interface RequestLogPayload {
  provider: Provider;
  requestedModel: string | null;
  model: string;
  endpoint: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  streaming: boolean;
  statusCode: number;
  userId: string;
  error: string | null;
  cacheHit: boolean;
  cacheSimilarity: number | null;
}

function persistLog(log: RequestLogPayload): void {
  const costUsd = calculateCostUsd(log.provider, log.model, log.promptTokens, log.completionTokens);

  void prisma.requestLog
    .create({
      data: {
        provider: log.provider,
        requestedModel: log.requestedModel,
        model: log.model,
        endpoint: log.endpoint,
        promptTokens: log.promptTokens,
        completionTokens: log.completionTokens,
        totalTokens: log.totalTokens,
        costUsd,
        latencyMs: log.latencyMs,
        streaming: log.streaming,
        statusCode: log.statusCode,
        userId: log.userId,
        error: log.error,
        cacheHit: log.cacheHit,
        cacheSimilarity: log.cacheSimilarity,
      },
    })
    .catch((err: unknown) => {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.warn("[inferix] request log write failed:", message);
    });
}

export function requestLoggingMiddleware(_req: Request, res: Response, next: NextFunction): void {
  res.on("finish", () => {
    const log = res.locals.requestLog as RequestLogPayload | undefined;
    if (!log) {
      return;
    }

    persistLog({
      ...log,
      statusCode: log.statusCode || res.statusCode,
    });
  });

  next();
}
