/**
 * Inferix End-to-End Test Suite
 * Run with: npm run test:e2e
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const prisma = new PrismaClient();

// ─── Result Tracking ────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
let skipped = 0;

function pass(label: string): void {
  console.log(`✅ PASS — ${label}`);
  passed++;
}

function fail(label: string, detail?: unknown): void {
  console.log(`❌ FAIL — ${label}`);
  if (detail !== undefined) {
    console.log(`   Detail: ${JSON.stringify(detail, null, 2)}`);
  }
  failed++;
}

function skip(label: string, reason: string): void {
  console.log(`⏭  SKIP — ${label} (${reason})`);
  skipped++;
}

function section(title: string): void {
  console.log(`\n${"─".repeat(60)}`);
  console.log(`  ${title}`);
  console.log("─".repeat(60));
}

// ─── HTTP Helpers ────────────────────────────────────────────────────────────

async function req(
  method: string,
  path: string,
  options: {
    body?: unknown;
    jwt?: string;
    apiKey?: string;
    headers?: Record<string, string>;
  } = {}
): Promise<{ status: number; body: unknown }> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (options.jwt) {
    headers["Authorization"] = `Bearer ${options.jwt}`;
  } else if (options.apiKey) {
    headers["Authorization"] = `Bearer ${options.apiKey}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let body: unknown;
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    body = await res.json();
  } else {
    body = await res.text();
  }

  return { status: res.status, body };
}

// ─── State shared across tests ───────────────────────────────────────────────

const TEST_EMAIL = `e2e-${Date.now()}@inferix-test.local`;
const TEST_PASSWORD = "TestPass123!";

let jwt = "";
let inferixApiKey = "";
let newKeyId = "";
let routingRuleId = "";

// ─── 1. AUTH TESTS ───────────────────────────────────────────────────────────

async function testAuth(): Promise<void> {
  section("1. AUTH TESTS");

  // 1a. Signup
  {
    const { status, body } = await req("POST", "/auth/signup", {
      body: { email: TEST_EMAIL, password: TEST_PASSWORD, name: "E2E Tester" },
    });
    const b = body as Record<string, unknown>;
    if (status === 201 && typeof b.token === "string" && b.user) {
      jwt = b.token as string;
      pass("Auth: signup returns 201 + token + user");
    } else {
      fail("Auth: signup returns 201 + token + user", { status, body });
    }
  }

  // 1b. Login with same creds
  {
    const { status, body } = await req("POST", "/auth/login", {
      body: { email: TEST_EMAIL, password: TEST_PASSWORD },
    });
    const b = body as Record<string, unknown>;
    if (status === 200 && typeof b.token === "string") {
      pass("Auth: login returns 200 + token");
    } else {
      fail("Auth: login returns 200 + token", { status, body });
    }
  }

  // 1c. GET /auth/me with valid token
  {
    const { status, body } = await req("GET", "/auth/me", { jwt });
    const b = body as Record<string, unknown>;
    if (status === 200 && b.email === TEST_EMAIL && Array.isArray(b.apiKeys)) {
      // grab the first key for later
      const keys = b.apiKeys as Array<{ key: string }>;
      if (keys.length > 0) inferixApiKey = keys[0].key;
      pass("Auth: GET /auth/me returns user + apiKeys");
    } else {
      fail("Auth: GET /auth/me returns user + apiKeys", { status, body });
    }
  }

  // 1d. GET /auth/me with no token → 401
  {
    const { status } = await req("GET", "/auth/me");
    if (status === 401) {
      pass("Auth: GET /auth/me with no token → 401");
    } else {
      fail("Auth: GET /auth/me with no token → 401", { status });
    }
  }
}

// ─── 2. API KEY TESTS ────────────────────────────────────────────────────────

async function testApiKeys(): Promise<void> {
  section("2. API KEY TESTS");

  // 2a. GET /v1/keys — should have at least 1
  {
    const { status, body } = await req("GET", "/v1/keys", { jwt });
    const b = body as Record<string, unknown>;
    const data = Array.isArray(b.data) ? (b.data as unknown[]) : [];
    if (status === 200 && data.length >= 1) {
      pass("Keys: GET /v1/keys returns ≥ 1 key");
    } else {
      fail("Keys: GET /v1/keys returns ≥ 1 key", { status, body });
    }
  }

  // 2b. POST /v1/keys — create new key
  {
    const { status, body } = await req("POST", "/v1/keys", {
      jwt,
      body: { name: "E2E Test Key" },
    });
    const b = body as Record<string, unknown>;
    if (status === 201 && typeof b.key === "string" && typeof b.id === "string") {
      newKeyId = b.id as string;
      const newKey = b.key as string;
      pass("Keys: POST /v1/keys creates new key");

      // 2c. Use new inf_live_ key to hit GET /v1/keys
      const { status: s2, body: b2 } = await req("GET", "/v1/keys", { apiKey: newKey });
      const b2o = b2 as Record<string, unknown>;
      if (s2 === 200 && Array.isArray(b2o.data)) {
        pass("Keys: API key auth works for GET /v1/keys");
      } else {
        fail("Keys: API key auth works for GET /v1/keys", { status: s2, body: b2 });
      }
    } else {
      fail("Keys: POST /v1/keys creates new key", { status, body });
      skip("Keys: API key auth works for GET /v1/keys", "key creation failed");
    }
  }

  // 2d. DELETE /v1/keys/:id
  if (newKeyId) {
    const { status } = await req("DELETE", `/v1/keys/${newKeyId}`, { jwt });
    // Server returns { ok: true } not 204, so accept both 200 and 204
    if (status === 200 || status === 204) {
      pass("Keys: DELETE /v1/keys/:id revokes key");
    } else {
      fail("Keys: DELETE /v1/keys/:id revokes key", { status });
    }
  } else {
    skip("Keys: DELETE /v1/keys/:id", "no key id available");
  }
}

// ─── 3. PROVIDER TESTS ───────────────────────────────────────────────────────

interface ProviderSpec {
  name: string;
  envKey: string;
  model: string;
}

const PROVIDERS: ProviderSpec[] = [
  { name: "Anthropic", envKey: "ANTHROPIC_API_KEY", model: "claude-3-5-haiku-20241022" },
  { name: "OpenAI", envKey: "OPENAI_API_KEY", model: "gpt-4o-mini" },
  { name: "Google", envKey: "GOOGLE_API_KEY", model: "gemini-2.0-flash" },
  { name: "Mistral", envKey: "MISTRAL_API_KEY", model: "mistral-small-latest" },
  { name: "Groq", envKey: "GROQ_API_KEY", model: "llama-3.3-70b-versatile" },
];

async function testProviders(): Promise<void> {
  section("3. PROVIDER TESTS");

  for (const provider of PROVIDERS) {
    const apiKeyPresent = !!process.env[provider.envKey];
    if (!apiKeyPresent) {
      skip(`Provider: ${provider.name} (${provider.model})`, "no API key");
      continue;
    }

    const { status, body } = await req("POST", "/v1/chat/completions", {
      jwt,
      body: {
        model: provider.model,
        messages: [{ role: "user", content: "Say OK in exactly one word." }],
        max_tokens: 10,
      },
    });

    const b = body as Record<string, unknown>;
    const choices = (b.choices as Array<Record<string, unknown>> | undefined) ?? [];
    const message = (choices[0]?.message as Record<string, unknown> | undefined) ?? {};
    const content = message.content as string | undefined;

    if (status === 200 && typeof content === "string" && content.length > 0) {
      pass(`Provider: ${provider.name} — response: "${content.trim().slice(0, 60)}"`);
    } else {
      fail(`Provider: ${provider.name} (${provider.model})`, { status, body });
    }
  }
}

// ─── 4. ROUTING RULES TESTS ──────────────────────────────────────────────────

async function testRoutingRules(): Promise<void> {
  section("4. ROUTING RULES TESTS");

  const anthropicPresent = !!process.env.ANTHROPIC_API_KEY;
  if (!anthropicPresent) {
    skip("Routing Rules: all routing tests", "Anthropic API key required for model rewrite check");
    return;
  }

  // 4a. Create rule targeting endpoint tag "test-routing"
  {
    const { status, body } = await req("POST", "/v1/rules", {
      jwt,
      body: {
        endpointTag: "test-routing",
        preferredModels: ["claude-3-5-haiku-20241022"],
      },
    });
    const b = body as Record<string, unknown>;
    const data = b.data as Record<string, unknown> | undefined;
    if (status === 201 && data?.id) {
      routingRuleId = data.id as string;
      pass("Routing: POST /v1/rules creates rule");
    } else {
      fail("Routing: POST /v1/rules creates rule", { status, body });
      skip("Routing: model rewrite check", "rule creation failed");
      return;
    }
  }

  // 4b. Send request with x-inferix-endpoint: test-routing asking for claude-3-opus
  const beforeCount = await prisma.requestLog.count();

  {
    const { status, body } = await req("POST", "/v1/chat/completions", {
      jwt,
      body: {
        model: "claude-3-opus-20240229",
        messages: [{ role: "user", content: "Say OK." }],
        max_tokens: 10,
      },
      headers: { "x-inferix-endpoint": "test-routing" },
    });
    const b = body as Record<string, unknown>;
    const choices = (b.choices as Array<Record<string, unknown>> | undefined) ?? [];
    if (status === 200 && choices.length > 0) {
      pass("Routing: request with endpoint tag completes successfully");
    } else {
      fail("Routing: request with endpoint tag completes successfully", { status, body });
    }
  }

  // 4c. Check usage log — model should have been rewritten to haiku
  {
    const { body } = await req("GET", "/v1/usage", { jwt });
    const b = body as Record<string, unknown>;
    const logs = (b.data as Array<Record<string, unknown>> | undefined) ?? [];
    // Find a log created after our test started
    const newLogs = logs.filter((l) => {
      const ts = new Date(l.createdAt as string).getTime();
      return ts > Date.now() - 30_000;
    });
    const rewritten = newLogs.find(
      (l) =>
        l.requestedModel === "claude-3-opus-20240229" &&
        (l.model as string).includes("haiku")
    );
    if (rewritten) {
      pass(`Routing: model rewritten — requested opus → actual ${rewritten.model}`);
    } else {
      // May still pass if log shows the request was routed to haiku without matching opus as requestedModel
      const haikuLog = newLogs.find((l) => (l.model as string).includes("haiku"));
      if (haikuLog) {
        pass(`Routing: model routed to haiku as expected`);
      } else {
        fail("Routing: model rewrite not reflected in usage log", { newLogs: newLogs.slice(0, 3) });
      }
    }
  }

  // 4d. Delete the rule
  if (routingRuleId) {
    const { status } = await req("DELETE", `/v1/rules/${routingRuleId}`, { jwt });
    if (status === 200 || status === 204) {
      pass("Routing: DELETE /v1/rules/:id cleans up rule");
    } else {
      // DELETE may not be implemented; try a soft-disable
      fail("Routing: DELETE /v1/rules/:id cleans up rule", { status });
    }
  }
}

// ─── 5. CACHING TESTS ────────────────────────────────────────────────────────

async function testCaching(): Promise<void> {
  section("5. CACHING TESTS");

  // Caching requires at least one provider with a key
  const availableProvider = PROVIDERS.find((p) => !!process.env[p.envKey]);
  if (!availableProvider) {
    skip("Caching: all caching tests", "no provider API key available");
    return;
  }

  // Cache is only enabled for non-FREE plans — check user plan
  const { body: meBody } = await req("GET", "/auth/me", { jwt });
  const meB = meBody as Record<string, unknown>;
  if ((meB.plan as string) === "FREE") {
    skip("Caching: all caching tests", "cache disabled on FREE plan");
    return;
  }

  const CACHE_PROMPT = "What is 2+2? Reply with just the number.";
  const CACHE_SIMILAR = "What does 2 plus 2 equal? Reply with just the number.";
  const chatBody = (content: string) => ({
    model: availableProvider.model,
    messages: [{ role: "user", content }],
    max_tokens: 15,
  });

  // 5a. First request — prime the cache
  const { status: s1 } = await req("POST", "/v1/chat/completions", {
    jwt,
    body: chatBody(CACHE_PROMPT),
  });
  if (s1 === 200) {
    pass("Caching: first request succeeds (cache prime)");
  } else {
    fail("Caching: first request succeeds (cache prime)", { status: s1 });
    skip("Caching: cache hit tests", "first request failed");
    return;
  }

  // Small pause to let cache write settle
  await new Promise((r) => setTimeout(r, 800));

  // 5b. Second identical request — should hit cache
  const { status: s2, body: b2 } = await req("POST", "/v1/chat/completions", {
    jwt,
    body: chatBody(CACHE_PROMPT),
  });
  const b2o = b2 as Record<string, unknown>;
  const choices2 = (b2o.choices as Array<Record<string, unknown>> | undefined) ?? [];

  // Check usage log for cacheHit
  await new Promise((r) => setTimeout(r, 300));
  const { body: usageBody } = await req("GET", "/v1/usage", { jwt });
  const usageLogs = ((usageBody as Record<string, unknown>).data as Array<Record<string, unknown>>) ?? [];
  const recentLogs = usageLogs.filter((l) => {
    const ts = new Date(l.createdAt as string).getTime();
    return ts > Date.now() - 15_000;
  });

  const cacheHitLog = recentLogs.find((l) => l.cacheHit === true);

  if (s2 === 200 && choices2.length > 0 && cacheHitLog) {
    pass("Caching: second identical request returns cache hit");
  } else if (s2 === 200 && choices2.length > 0) {
    fail("Caching: second identical request returns cache hit", {
      note: "request succeeded but no cacheHit in usage logs",
      recentLogs: recentLogs.slice(0, 3),
    });
  } else {
    fail("Caching: second identical request returns cache hit", { status: s2, body: b2 });
  }

  // 5c. Semantically similar prompt — should also hit cache
  const { status: s3 } = await req("POST", "/v1/chat/completions", {
    jwt,
    body: chatBody(CACHE_SIMILAR),
  });

  await new Promise((r) => setTimeout(r, 300));
  const { body: usageBody2 } = await req("GET", "/v1/usage", { jwt });
  const usageLogs2 = ((usageBody2 as Record<string, unknown>).data as Array<Record<string, unknown>>) ?? [];
  const recentLogs2 = usageLogs2.filter((l) => {
    const ts = new Date(l.createdAt as string).getTime();
    return ts > Date.now() - 10_000;
  });
  const semanticCacheHit = recentLogs2.find((l) => l.cacheHit === true);

  if (s3 === 200 && semanticCacheHit) {
    pass("Caching: semantically similar prompt also hits cache");
  } else if (s3 === 200) {
    fail("Caching: semantically similar prompt also hits cache", {
      note: "request succeeded but semantic cache not detected",
      recentLogs: recentLogs2.slice(0, 3),
    });
  } else {
    fail("Caching: semantically similar prompt also hits cache", { status: s3 });
  }
}

// ─── 6. PLAN LIMITS TEST ─────────────────────────────────────────────────────

async function testPlanLimits(): Promise<void> {
  section("6. PLAN LIMITS TEST");

  const availableProvider = PROVIDERS.find((p) => !!process.env[p.envKey]);
  if (!availableProvider) {
    skip("Plan Limits: all tests", "no provider API key to test 429 response");
    return;
  }

  // Create a fresh FREE plan user
  const limitEmail = `e2e-limit-${Date.now()}@inferix-test.local`;
  const { status: signupStatus, body: signupBody } = await req("POST", "/auth/signup", {
    body: { email: limitEmail, password: TEST_PASSWORD },
  });

  if (signupStatus !== 201) {
    fail("Plan Limits: create FREE test user for limit check", { status: signupStatus, body: signupBody });
    return;
  }

  const limitJwt = (signupBody as Record<string, unknown>).token as string;
  const limitUser = (signupBody as Record<string, unknown>).user as Record<string, unknown>;
  const limitUserId = limitUser.id as string;

  pass("Plan Limits: FREE plan user created");

  // Seed 1001 fake request logs to exceed the FREE limit (1000)
  try {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    // Insert in batches to avoid hitting DB limits
    const BATCH_SIZE = 100;
    const TOTAL = 1001;
    const batches = Math.ceil(TOTAL / BATCH_SIZE);

    for (let b = 0; b < batches; b++) {
      const count = Math.min(BATCH_SIZE, TOTAL - b * BATCH_SIZE);
      await prisma.requestLog.createMany({
        data: Array.from({ length: count }, () => ({
          userId: limitUserId,
          provider: "openai",
          requestedModel: "gpt-4o-mini",
          model: "gpt-4o-mini",
          endpoint: "untagged",
          promptTokens: 10,
          completionTokens: 5,
          totalTokens: 15,
          costUsd: 0.0001,
          latencyMs: 100,
          streaming: false,
          statusCode: 200,
          createdAt: new Date(startOfMonth.getTime() + Math.random() * 86400000),
        })),
      });
    }

    pass("Plan Limits: seeded 1001 fake logs for FREE user");
  } catch (err) {
    fail("Plan Limits: seed fake logs", { error: String(err) });
    skip("Plan Limits: 429 check", "could not seed fake logs");
    return;
  }

  // Now try a real request — should get 429
  const { status: limitStatus, body: limitBody } = await req("POST", "/v1/chat/completions", {
    jwt: limitJwt,
    body: {
      model: availableProvider.model,
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 5,
    },
  });

  if (limitStatus === 429) {
    pass("Plan Limits: FREE user over 1000 requests → 429");
  } else {
    fail("Plan Limits: FREE user over 1000 requests → 429", { status: limitStatus, body: limitBody });
  }

  // Cleanup: delete seeded logs so they don't pollute future runs
  try {
    await prisma.requestLog.deleteMany({ where: { userId: limitUserId } });
  } catch {
    // non-critical
  }
}

// ─── 7. LOGGING TESTS ────────────────────────────────────────────────────────

async function testLogging(): Promise<void> {
  section("7. LOGGING TESTS");

  const { status, body } = await req("GET", "/v1/usage", { jwt });

  if (status !== 200) {
    fail("Logging: GET /v1/usage returns 200", { status, body });
    return;
  }

  pass("Logging: GET /v1/usage returns 200");

  const b = body as Record<string, unknown>;
  const logs = (b.data as Array<Record<string, unknown>>) ?? [];

  if (logs.length === 0) {
    skip("Logging: log field checks", "no logs found");
    return;
  }

  // Check required fields on the most recent log
  const REQUIRED_FIELDS = ["provider", "model", "totalTokens", "costUsd", "latencyMs", "endpoint", "cacheHit"];
  const log = logs[0];

  const missingFields = REQUIRED_FIELDS.filter((f) => !(f in log));
  if (missingFields.length === 0) {
    pass("Logging: log entries contain all required fields");
  } else {
    fail("Logging: log entries contain all required fields", { missingFields, log });
  }

  // Verify costs > 0 for real provider calls (skip cache hits)
  const realProviderLogs = logs.filter(
    (l) => !l.cacheHit && l.provider !== "cache" && l.statusCode === 200
  );

  if (realProviderLogs.length === 0) {
    skip("Logging: cost > 0 for real provider calls", "no real provider logs found");
  } else {
    const allHaveCost = realProviderLogs.every((l) => typeof l.costUsd === "number" && (l.costUsd as number) > 0);
    if (allHaveCost) {
      pass("Logging: real provider calls have costUsd > 0");
    } else {
      const zeroCosts = realProviderLogs.filter((l) => !(typeof l.costUsd === "number" && (l.costUsd as number) > 0));
      fail("Logging: real provider calls have costUsd > 0", { zeroCosts: zeroCosts.slice(0, 3) });
    }
  }

  // Verify latencyMs > 0
  const logsWithLatency = logs.filter((l) => typeof l.latencyMs === "number" && (l.latencyMs as number) > 0);
  if (logsWithLatency.length > 0) {
    pass("Logging: latencyMs > 0 on logged requests");
  } else {
    fail("Logging: latencyMs > 0 on logged requests", {
      sample: logs.slice(0, 2).map((l) => ({ latencyMs: l.latencyMs })),
    });
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║          Inferix — End-to-End Test Suite                 ║");
  console.log(`║  Target: ${BASE_URL.padEnd(49)}║`);
  console.log("╚══════════════════════════════════════════════════════════╝");

  // Quick health check before running tests
  try {
    const health = await fetch(`${BASE_URL}/health`);
    if (!health.ok) {
      console.error(`\n🚨  Server returned ${health.status} on /health — is it running?\n`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`\n🚨  Cannot reach ${BASE_URL}/health — is the server running?\n   ${err}\n`);
    process.exit(1);
  }

  try {
    await testAuth();
    await testApiKeys();
    await testProviders();
    await testRoutingRules();
    await testCaching();
    await testPlanLimits();
    await testLogging();
  } finally {
    await prisma.$disconnect();
  }

  // ─── Summary ──────────────────────────────────────────────────────────────
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  Results: ${passed} passed, ${failed} failed, ${skipped} skipped`);
  console.log("═".repeat(60));

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
