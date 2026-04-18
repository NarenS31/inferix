import type { RoutingRule } from "@prisma/client";
import type { ChatCompletionRequest } from "../types";
import { prisma } from "./prisma";
import { calculateCostUsd } from "./pricing";
import { detectProvider } from "../utils/provider-detect";

const CACHE_TTL_MS = 60_000;

const DEFAULT_RULE = {
  endpointTag: "*",
  preferredModels: [
    "claude-3-5-haiku-20241022",
    "claude-3-5-sonnet-20241022",
    "claude-3-opus-20240229",
  ],
  costCeilingUsd: 0.01,
  latencyThresholdMs: null,
  maxTokens: null,
  active: true,
};

interface RulesCacheEntry {
  expiresAt: number;
  rules: RoutingRule[];
}

const rulesCache = new Map<string, RulesCacheEntry>();

export function invalidateRulesCache(userId?: string): void {
  if (userId) {
    rulesCache.delete(userId);
    return;
  }
  rulesCache.clear();
}

async function ensureDefaultRule(userId: string): Promise<void> {
  const existingCount = await prisma.routingRule.count({ where: { userId } });
  if (existingCount > 0) {
    return;
  }

  await prisma.routingRule.create({
    data: {
      userId,
      endpointTag: DEFAULT_RULE.endpointTag,
      preferredModels: DEFAULT_RULE.preferredModels,
      costCeilingUsd: DEFAULT_RULE.costCeilingUsd,
      latencyThresholdMs: DEFAULT_RULE.latencyThresholdMs,
      maxTokens: DEFAULT_RULE.maxTokens,
      active: DEFAULT_RULE.active,
    },
  });
}

async function getActiveRulesForUser(userId: string): Promise<RoutingRule[]> {
  const cached = rulesCache.get(userId);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.rules;
  }

  await ensureDefaultRule(userId);

  const rules = await prisma.routingRule.findMany({
    where: { userId, active: true },
    orderBy: { createdAt: "asc" },
  });

  rulesCache.set(userId, { expiresAt: Date.now() + CACHE_TTL_MS, rules });
  return rules;
}

function estimatePromptTokens(req: ChatCompletionRequest): number {
  const text = req.messages
    .map((m) => {
      if (typeof m.content === "string") return m.content;
      if (!Array.isArray(m.content)) return "";
      return m.content
        .map((part) => (part.type === "text" ? part.text ?? "" : ""))
        .join(" ");
    })
    .join(" ");

  return Math.max(1, Math.ceil(text.length / 4));
}

async function isLatencyWithinThreshold(
  userId: string,
  endpointTag: string,
  model: string,
  latencyThresholdMs: number
): Promise<boolean> {
  const recent = await prisma.requestLog.findMany({
    where: {
      userId,
      model,
      endpoint: endpointTag,
      statusCode: { lt: 400 },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { latencyMs: true },
  });

  if (recent.length === 0) {
    return true;
  }

  const avg = recent.reduce((sum, item) => sum + item.latencyMs, 0) / recent.length;
  return avg <= latencyThresholdMs;
}

function estimateRequestCostUsd(model: string, promptTokens: number, completionBudget: number): number {
  try {
    const provider = detectProvider(model);
    return calculateCostUsd(provider, model, promptTokens, completionBudget);
  } catch {
    return 0;
  }
}

function pickEndpointRule(rules: RoutingRule[], endpointTag: string): RoutingRule | null {
  const exact = rules.find((rule) => rule.endpointTag === endpointTag);
  if (exact) {
    return exact;
  }

  const fallback = rules.find((rule) => rule.endpointTag === "*");
  return fallback ?? null;
}

async function chooseModel(
  rule: RoutingRule,
  userId: string,
  endpointTag: string,
  req: ChatCompletionRequest
): Promise<string> {
  if (!rule.preferredModels.length) {
    return req.model;
  }

  const promptTokens = estimatePromptTokens(req);
  const completionBudget = req.max_tokens ?? req.max_completion_tokens ?? 1024;

  let selected = rule.preferredModels[0];

  for (const candidate of rule.preferredModels) {
    if (rule.costCeilingUsd !== null) {
      const estimate = estimateRequestCostUsd(candidate, promptTokens, completionBudget);
      if (estimate > rule.costCeilingUsd) {
        selected = candidate;
        continue;
      }
    }

    if (rule.latencyThresholdMs !== null) {
      const withinLatency = await isLatencyWithinThreshold(userId, endpointTag, candidate, rule.latencyThresholdMs);
      if (!withinLatency) {
        selected = candidate;
        continue;
      }
    }

    return candidate;
  }

  return selected;
}

export async function applyRoutingRules(
  userId: string,
  endpointTag: string,
  req: ChatCompletionRequest
): Promise<ChatCompletionRequest> {
  try {
    const rules = await getActiveRulesForUser(userId);
    if (!rules.length) {
      return req;
    }

    const rule = pickEndpointRule(rules, endpointTag);
    if (!rule) {
      return req;
    }

    const nextReq: ChatCompletionRequest = { ...req };

    if (rule.maxTokens !== null) {
      nextReq.max_tokens = rule.maxTokens;
    }

    if (rule.preferredModels.length > 0) {
      nextReq.model = await chooseModel(rule, userId, endpointTag, nextReq);
    }

    return nextReq;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.warn("[inferix] rules engine bypass due to error:", message);
    return req;
  }
}

export async function listRulesForUser(userId: string): Promise<RoutingRule[]> {
  await ensureDefaultRule(userId);
  return prisma.routingRule.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
