import { subDays, startOfDay, startOfMonth } from "@/lib/date";
import { prisma } from "@/lib/prisma";
import { calculateCostUsd } from "../../src/lib/pricing";
import { detectProvider } from "../../src/utils/provider-detect";

export interface LogRow {
  id: string;
  createdAt: Date;
  provider: string;
  requestedModel: string | null;
  model: string;
  endpoint: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costUsd: number;
  latencyMs: number;
  streaming: boolean;
  statusCode: number;
  userId: string;
  error: string | null;
  cacheHit: boolean;
  cacheSimilarity: number | null;
}

export interface DailySeriesPoint {
  day: string;
  requests: number;
  cost: number;
}

export async function getOverview(userId: string): Promise<{
  totalRequestsToday: number;
  totalRequestsMonth: number;
  totalCostToday: number;
  totalCostMonth: number;
  averageLatencyMs: number;
  costSavingsUsd: number;
  cacheHitRate: number;
  cacheHitsToday: number;
  cacheHitsMonth: number;
  savedByCacheUsd: number;
  series: DailySeriesPoint[];
}> {
  const now = new Date();
  const todayStart = startOfDay(now);
  const monthStart = startOfMonth(now);
  const rangeStart = subDays(now, 29);

  const [today, month, last30] = (await Promise.all([
    prisma.requestLog.findMany({ where: { userId, createdAt: { gte: todayStart } } }),
    prisma.requestLog.findMany({ where: { userId, createdAt: { gte: monthStart } } }),
    prisma.requestLog.findMany({ where: { userId, createdAt: { gte: rangeStart } }, orderBy: { createdAt: "asc" } }),
  ])) as [LogRow[], LogRow[], LogRow[]];

  const avgLatency = month.length
    ? Math.round(month.reduce((s: number, r: LogRow) => s + r.latencyMs, 0) / month.length)
    : 0;

  let savings = 0;
  let savedByCache = 0;
  for (const row of last30) {
    if (!row.requestedModel || row.requestedModel === row.model) continue;
    try {
      const provider = detectProvider(row.requestedModel);
      const requestedCost = calculateCostUsd(provider, row.requestedModel, row.promptTokens, row.completionTokens);
      savings += Math.max(0, requestedCost - row.costUsd);
    } catch {
      // Skip rows with unrecognized models.
    }
  }

  for (const row of month) {
    if (!row.cacheHit || !row.requestedModel) continue;
    try {
      const provider = detectProvider(row.requestedModel);
      savedByCache += calculateCostUsd(provider, row.requestedModel, row.promptTokens, row.completionTokens);
    } catch {
      // Skip unrecognized models.
    }
  }

  const cacheHitsMonth = month.filter((row) => row.cacheHit).length;
  const cacheHitsToday = today.filter((row) => row.cacheHit).length;
  const cacheHitRate = month.length ? Number(((cacheHitsMonth / month.length) * 100).toFixed(2)) : 0;

  const bucket = new Map<string, DailySeriesPoint>();
  for (let i = 0; i < 30; i += 1) {
    const d = subDays(now, 29 - i);
    const key = d.toISOString().slice(0, 10);
    bucket.set(key, { day: key.slice(5), requests: 0, cost: 0 });
  }

  for (const row of last30) {
    const key = row.createdAt.toISOString().slice(0, 10);
    const point = bucket.get(key);
    if (!point) continue;
    point.requests += 1;
    point.cost += row.costUsd;
  }

  return {
    totalRequestsToday: today.length,
    totalRequestsMonth: month.length,
    totalCostToday: Number(today.reduce((s: number, r: LogRow) => s + r.costUsd, 0).toFixed(4)),
    totalCostMonth: Number(month.reduce((s: number, r: LogRow) => s + r.costUsd, 0).toFixed(4)),
    averageLatencyMs: avgLatency,
    costSavingsUsd: Number(savings.toFixed(4)),
    cacheHitRate,
    cacheHitsToday,
    cacheHitsMonth,
    savedByCacheUsd: Number(savedByCache.toFixed(4)),
    series: Array.from(bucket.values()),
  };
}

export async function getLogs(userId: string, filters: { provider?: string; endpoint?: string; start?: Date; end?: Date }) {
  return (await prisma.requestLog.findMany({
    where: {
      userId,
      provider: filters.provider && filters.provider !== "all" ? filters.provider : undefined,
      endpoint: filters.endpoint && filters.endpoint !== "all" ? filters.endpoint : undefined,
      createdAt:
        filters.start || filters.end
          ? {
              gte: filters.start,
              lte: filters.end,
            }
          : undefined,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  })) as LogRow[];
}

export async function getRuleFireStats(userId: string): Promise<Record<string, number>> {
  const since = subDays(new Date(), 7);
  const rules = await prisma.routingRule.findMany({ where: { userId } });
  const logs = await prisma.requestLog.findMany({ where: { userId, createdAt: { gte: since } }, select: { endpoint: true, model: true } });

  const stats: Record<string, number> = {};
  for (const rule of rules) {
    let hits = 0;
    for (const log of logs) {
      const endpointMatch = rule.endpointTag === "*" || rule.endpointTag === log.endpoint;
      const modelMatch = rule.preferredModels.length === 0 || rule.preferredModels.includes(log.model);
      if (endpointMatch && modelMatch) hits += 1;
    }
    stats[rule.id] = hits;
  }
  return stats;
}
