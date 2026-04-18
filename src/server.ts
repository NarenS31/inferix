import "dotenv/config";
import express from "express";
import { authMiddleware } from "./middleware/auth";
import { planLimitsMiddleware } from "./middleware/plan-limits";
import authRouter from "./routes/auth";
import chatRouter from "./routes/chat";
import usageRouter from "./routes/usage";
import rulesRouter from "./routes/rules";
import cacheRouter from "./routes/cache";
import keysRouter from "./routes/keys";
import { requestLoggingMiddleware } from "./middleware/request-logging";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json({ limit: "10mb" }));

// Health check (no auth required)
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "inferix", version: "0.1.0" });
});

// Models list (OpenAI-compatible)
app.get("/v1/models", authMiddleware, (_req, res) => {
  const models = [
    // Anthropic
    "claude-opus-4-7", "claude-sonnet-4-6", "claude-haiku-4-5-20251001",
    "claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022", "claude-3-opus-20240229",
    // OpenAI
    "gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "o1", "o1-mini", "o3-mini",
    // Google
    "gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash",
    // Mistral
    "mistral-large-latest", "mistral-small-latest", "codestral-latest",
    // Groq
    "groq/llama-3.3-70b-versatile", "groq/llama-3.1-8b-instant", "groq/mixtral-8x7b-32768",
  ];

  res.json({
    object: "list",
    data: models.map((id) => ({
      id,
      object: "model",
      created: 1700000000,
      owned_by: "inferix",
    })),
  });
});

app.use(requestLoggingMiddleware);
app.use("/auth", authRouter);
app.use("/v1", authMiddleware, planLimitsMiddleware, chatRouter);
app.use("/v1", authMiddleware, usageRouter);
app.use("/v1", authMiddleware, rulesRouter);
app.use("/v1", authMiddleware, cacheRouter);
app.use("/v1", authMiddleware, keysRouter);
app.use("/v1", authMiddleware, planLimitsMiddleware, chatRouter);
app.use("/v1", authMiddleware, usageRouter);
app.use("/v1", authMiddleware, rulesRouter);
app.use("/v1", authMiddleware, cacheRouter);
app.use("/v1", authMiddleware, keysRouter);

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[inferix] Unhandled error:", err);
  res.status(500).json({ error: { message: "Internal server error", type: "server_error" } });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Inferix proxy running on http://localhost:${PORT}`);
  console.log(`   OpenAI-compatible endpoint: http://localhost:${PORT}/v1`);
  console.log(`   Health check: http://localhost:${PORT}/health\n`);
});

export default app;
