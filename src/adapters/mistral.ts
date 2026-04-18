import { Mistral } from "@mistralai/mistralai";
import { v4 as uuidv4 } from "uuid";
import type {
  ChatCompletionRequest,
  ChatCompletionResponse,
  ChatCompletionChunk,
  ChatMessage,
  ProviderAdapter,
} from "../types";
import { stripProviderPrefix } from "../utils/provider-detect";

type MistralRole = "system" | "user" | "assistant" | "tool";

function toMistralMessages(messages: ChatMessage[]) {
  return messages.map((m) => ({
    role: m.role as MistralRole,
    content: typeof m.content === "string" ? m.content : "",
  }));
}

export class MistralAdapter implements ProviderAdapter {
  private client: Mistral;

  constructor() {
    this.client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY ?? "" });
  }

  async complete(req: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const model = stripProviderPrefix(req.model);
    const response = await this.client.chat.complete({
      model,
      messages: toMistralMessages(req.messages),
      temperature: req.temperature,
      topP: req.top_p,
      maxTokens: req.max_tokens ?? req.max_completion_tokens,
      stop: typeof req.stop === "string" ? [req.stop] : req.stop,
    });

    const choice = response.choices?.[0];
    const content = typeof choice?.message?.content === "string" ? choice.message.content : "";

    return {
      id: response.id ?? `chatcmpl-${uuidv4()}`,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: response.model ?? req.model,
      choices: [
        {
          index: 0,
          message: { role: "assistant", content },
          finish_reason: choice?.finishReason === "stop" ? "stop" : "length",
          logprobs: null,
        },
      ],
      usage: {
        prompt_tokens: response.usage?.promptTokens ?? 0,
        completion_tokens: response.usage?.completionTokens ?? 0,
        total_tokens: response.usage?.totalTokens ?? 0,
      },
    };
  }

  async stream(req: ChatCompletionRequest, onChunk: (chunk: ChatCompletionChunk) => void): Promise<void> {
    const model = stripProviderPrefix(req.model);
    const id = `chatcmpl-${uuidv4()}`;
    const created = Math.floor(Date.now() / 1000);

    const stream = await this.client.chat.stream({
      model,
      messages: toMistralMessages(req.messages),
      temperature: req.temperature,
      topP: req.top_p,
      maxTokens: req.max_tokens ?? req.max_completion_tokens,
    });

    for await (const event of stream) {
      const choice = event.data.choices[0];
      if (!choice) continue;

      const delta = choice.delta;
      const content = typeof delta?.content === "string" ? delta.content : "";
      const finishReason = choice.finishReason;

      onChunk({
        id,
        object: "chat.completion.chunk",
        created,
        model: req.model,
        choices: [
          {
            index: 0,
            delta: { content },
            finish_reason: finishReason === "stop" ? "stop" : finishReason ? "length" : null,
          },
        ],
      });
    }
  }
}
