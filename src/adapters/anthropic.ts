import Anthropic from "@anthropic-ai/sdk";
import { v4 as uuidv4 } from "uuid";
import type {
  ChatCompletionRequest,
  ChatCompletionResponse,
  ChatCompletionChunk,
  ChatMessage,
  ProviderAdapter,
} from "../types";
import { stripProviderPrefix } from "../utils/provider-detect";

function toAnthropicMessages(messages: ChatMessage[]): {
  system: string | undefined;
  messages: Anthropic.MessageParam[];
} {
  let system: string | undefined;
  const converted: Anthropic.MessageParam[] = [];

  for (const msg of messages) {
    if (msg.role === "system") {
      system = typeof msg.content === "string" ? msg.content : "";
      continue;
    }

    const role = msg.role === "assistant" ? "assistant" : "user";
    let content: Anthropic.MessageParam["content"];

    if (typeof msg.content === "string") {
      content = msg.content;
    } else if (Array.isArray(msg.content)) {
      content = msg.content.map((part) => {
        if (part.type === "text") return { type: "text" as const, text: part.text ?? "" };
        if (part.type === "image_url" && part.image_url) {
          const url = part.image_url.url;
          if (url.startsWith("data:")) {
            const [header, data] = url.split(",");
            const mediaType = header.split(":")[1].split(";")[0] as
              | "image/jpeg"
              | "image/png"
              | "image/gif"
              | "image/webp";
            return { type: "image" as const, source: { type: "base64" as const, media_type: mediaType, data } };
          }
          // URL images require base64 fetch; for now treat as empty text
          return { type: "text" as const, text: `[image: ${url}]` };
        }
        return { type: "text" as const, text: "" };
      });
    } else {
      content = "";
    }

    converted.push({ role, content });
  }

  return { system, messages: converted };
}

export class AnthropicAdapter implements ProviderAdapter {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  async complete(req: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const { system, messages } = toAnthropicMessages(req.messages);
    const model = stripProviderPrefix(req.model);

    const response = await this.client.messages.create({
      model,
      messages,
      system,
      max_tokens: req.max_tokens ?? req.max_completion_tokens ?? 4096,
      temperature: req.temperature,
      top_p: req.top_p,
      stop_sequences: typeof req.stop === "string" ? [req.stop] : req.stop,
    });

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as Anthropic.TextBlock).text)
      .join("");

    return {
      id: response.id,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: response.model,
      choices: [
        {
          index: 0,
          message: { role: "assistant", content: text },
          finish_reason: response.stop_reason === "end_turn" ? "stop" : "length",
          logprobs: null,
        },
      ],
      usage: {
        prompt_tokens: response.usage.input_tokens,
        completion_tokens: response.usage.output_tokens,
        total_tokens: response.usage.input_tokens + response.usage.output_tokens,
      },
    };
  }

  async stream(req: ChatCompletionRequest, onChunk: (chunk: ChatCompletionChunk) => void): Promise<void> {
    const { system, messages } = toAnthropicMessages(req.messages);
    const model = stripProviderPrefix(req.model);
    const id = `chatcmpl-${uuidv4()}`;
    const created = Math.floor(Date.now() / 1000);

    const stream = this.client.messages.stream({
      model,
      messages,
      system,
      max_tokens: req.max_tokens ?? req.max_completion_tokens ?? 4096,
      temperature: req.temperature,
      top_p: req.top_p,
      stop_sequences: typeof req.stop === "string" ? [req.stop] : req.stop,
    });

    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        onChunk({
          id,
          object: "chat.completion.chunk",
          created,
          model: req.model,
          choices: [{ index: 0, delta: { content: event.delta.text }, finish_reason: null }],
        });
      } else if (event.type === "message_stop") {
        onChunk({
          id,
          object: "chat.completion.chunk",
          created,
          model: req.model,
          choices: [{ index: 0, delta: {}, finish_reason: "stop" }],
        });
      }
    }
  }
}
