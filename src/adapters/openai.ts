import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import type {
  ChatCompletionRequest,
  ChatCompletionResponse,
  ChatCompletionChunk,
  ProviderAdapter,
} from "../types";
import { stripProviderPrefix } from "../utils/provider-detect";

export class OpenAIAdapter implements ProviderAdapter {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async complete(req: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const model = stripProviderPrefix(req.model);
    const response = await this.client.chat.completions.create({
      model,
      messages: req.messages as OpenAI.ChatCompletionMessageParam[],
      temperature: req.temperature,
      top_p: req.top_p,
      n: req.n,
      stop: req.stop,
      max_tokens: req.max_tokens,
      max_completion_tokens: req.max_completion_tokens,
      presence_penalty: req.presence_penalty,
      frequency_penalty: req.frequency_penalty,
      user: req.user,
      tools: req.tools as OpenAI.ChatCompletionTool[] | undefined,
      stream: false,
    });

    return {
      id: response.id,
      object: "chat.completion",
      created: response.created,
      model: response.model,
      choices: response.choices.map((c) => ({
        index: c.index,
        message: {
          role: c.message.role,
          content: c.message.content ?? "",
        },
        finish_reason: (c.finish_reason as ChatCompletionResponse["choices"][0]["finish_reason"]) ?? null,
        logprobs: null,
      })),
      usage: {
        prompt_tokens: response.usage?.prompt_tokens ?? 0,
        completion_tokens: response.usage?.completion_tokens ?? 0,
        total_tokens: response.usage?.total_tokens ?? 0,
      },
    };
  }

  async stream(req: ChatCompletionRequest, onChunk: (chunk: ChatCompletionChunk) => void): Promise<void> {
    const model = stripProviderPrefix(req.model);
    const id = `chatcmpl-${uuidv4()}`;
    const created = Math.floor(Date.now() / 1000);

    const stream = await this.client.chat.completions.create({
      model,
      messages: req.messages as OpenAI.ChatCompletionMessageParam[],
      temperature: req.temperature,
      top_p: req.top_p,
      stop: req.stop,
      max_tokens: req.max_tokens,
      max_completion_tokens: req.max_completion_tokens,
      stream: true,
      stream_options: { include_usage: true },
    });

    for await (const chunk of stream) {
      const choice = chunk.choices[0];
      if (!choice) continue;

      onChunk({
        id: chunk.id || id,
        object: "chat.completion.chunk",
        created: chunk.created || created,
        model: chunk.model || req.model,
        choices: [
          {
            index: choice.index,
            delta: { content: choice.delta.content ?? undefined },
            finish_reason: (choice.finish_reason as ChatCompletionChunk["choices"][0]["finish_reason"]) ?? null,
          },
        ],
        usage: chunk.usage
          ? {
              prompt_tokens: chunk.usage.prompt_tokens,
              completion_tokens: chunk.usage.completion_tokens,
              total_tokens: chunk.usage.total_tokens,
            }
          : undefined,
      });
    }
  }
}
