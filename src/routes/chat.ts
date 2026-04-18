import { Router, type Request, type Response } from "express";
import type { ChatCompletionRequest, ChatCompletionChunk, ChatCompletionResponse } from "../types";
import { detectProvider } from "../utils/provider-detect";
import { getAdapter } from "../adapters";
import { applyRoutingRules } from "../lib/rules";
import { checkCache, extractPromptText, storeCache } from "../lib/cache";

const router = Router();

router.post("/chat/completions", async (req: Request, res: Response) => {
  const startedAt = Date.now();
  const endpointTagHeader = req.header("x-inferix-endpoint");
  const endpointTag = endpointTagHeader && endpointTagHeader.trim() ? endpointTagHeader.trim() : "untagged";
  const requestBody = req.body as ChatCompletionRequest;
  const requestedModel = requestBody.model;
  const userId = (res.locals.userId as string | undefined) ?? "anonymous";
  let body = requestBody;
  let provider: ReturnType<typeof detectProvider>;

  if (!requestBody.model) {
    res.status(400).json({ error: { message: "Missing required field: model", type: "invalid_request_error" } });
    return;
  }

  if (!requestBody.messages?.length) {
    res.status(400).json({ error: { message: "Missing required field: messages", type: "invalid_request_error" } });
    return;
  }

  const promptText = extractPromptText(requestBody);
  const cacheHit = await checkCache(userId, endpointTag, promptText);
  if (cacheHit) {
    const usage = cacheHit.response.usage;
    res.locals.requestLog = {
      provider: "cache",
      requestedModel,
      model: cacheHit.response.model,
      endpoint: endpointTag,
      promptTokens: usage.prompt_tokens,
      completionTokens: usage.completion_tokens,
      totalTokens: usage.total_tokens,
      latencyMs: Date.now() - startedAt,
      streaming: Boolean(requestBody.stream),
      statusCode: 200,
      userId,
      error: null,
      cacheHit: true,
      cacheSimilarity: cacheHit.similarity,
    };

    if (requestBody.stream) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no");
      res.flushHeaders();

      const content = typeof cacheHit.response.choices[0]?.message.content === "string"
        ? cacheHit.response.choices[0].message.content
        : "";

      const chunk: ChatCompletionChunk = {
        id: cacheHit.response.id,
        object: "chat.completion.chunk",
        created: cacheHit.response.created,
        model: cacheHit.response.model,
        choices: [{ index: 0, delta: { content }, finish_reason: "stop" }],
        usage: cacheHit.response.usage,
      };

      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      res.write("data: [DONE]\n\n");
      res.end();
      return;
    }

    res.json(cacheHit.response);
    return;
  }

  body = await applyRoutingRules(userId, endpointTag, requestBody);

  try {
    provider = detectProvider(body.model);
  } catch (err) {
    res.status(400).json({ error: { message: (err as Error).message, type: "invalid_request_error" } });
    return;
  }

  const baseLog = {
    provider,
    requestedModel,
    model: body.model,
    endpoint: endpointTag,
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
    latencyMs: 0,
    streaming: Boolean(body.stream),
    statusCode: 200,
    userId,
    error: null as string | null,
    cacheHit: false,
    cacheSimilarity: null as number | null,
  };

  const adapter = getAdapter(provider);

  if (body.stream) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    const usage = {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
    };

    try {
      await adapter.stream(body, (chunk: ChatCompletionChunk) => {
        if (chunk.usage) {
          usage.promptTokens = chunk.usage.prompt_tokens;
          usage.completionTokens = chunk.usage.completion_tokens;
          usage.totalTokens = chunk.usage.total_tokens;
        }
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      });
      res.write("data: [DONE]\n\n");
      res.locals.requestLog = {
        ...baseLog,
        provider,
        promptTokens: usage.promptTokens,
        completionTokens: usage.completionTokens,
        totalTokens: usage.totalTokens,
        latencyMs: Date.now() - startedAt,
        statusCode: res.statusCode,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      res.write(`data: ${JSON.stringify({ error: { message, type: "provider_error" } })}\n\n`);
      res.locals.requestLog = {
        ...baseLog,
        provider,
        latencyMs: Date.now() - startedAt,
        statusCode: res.statusCode,
        error: message,
      };
    } finally {
      res.end();
    }
  } else {
    try {
      const response = await adapter.complete(body);
      await storeCache(userId, endpointTag, promptText, response, response.model, provider);
      res.locals.requestLog = {
        ...baseLog,
        provider,
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens,
        latencyMs: Date.now() - startedAt,
        statusCode: 200,
        cacheHit: false,
        cacheSimilarity: null,
      };
      res.json(response);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      const status = message.includes("401") || message.includes("Unauthorized") ? 401 : 502;
      res.locals.requestLog = {
        ...baseLog,
        provider,
        latencyMs: Date.now() - startedAt,
        statusCode: status,
        error: message,
      };
      res.status(status).json({ error: { message, type: "provider_error" } });
    }
  }
});

export default router;
