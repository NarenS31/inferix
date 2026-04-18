import { GoogleGenerativeAI, type Content, type Part } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";
import type {
  ChatCompletionRequest,
  ChatCompletionResponse,
  ChatCompletionChunk,
  ChatMessage,
  ProviderAdapter,
} from "../types";
import { stripProviderPrefix } from "../utils/provider-detect";

function toGoogleContents(messages: ChatMessage[]): { system: string | undefined; history: Content[] } {
  let system: string | undefined;
  const history: Content[] = [];

  for (const msg of messages) {
    if (msg.role === "system") {
      system = typeof msg.content === "string" ? msg.content : "";
      continue;
    }

    const role = msg.role === "assistant" ? "model" : "user";
    let parts: Part[];

    if (typeof msg.content === "string") {
      parts = [{ text: msg.content }];
    } else if (Array.isArray(msg.content)) {
      parts = msg.content.map((p) => {
        if (p.type === "text") return { text: p.text ?? "" };
        if (p.type === "image_url" && p.image_url?.url.startsWith("data:")) {
          const [header, data] = p.image_url.url.split(",");
          const mimeType = header.split(":")[1].split(";")[0];
          return { inlineData: { mimeType, data } };
        }
        return { text: "" };
      });
    } else {
      parts = [{ text: "" }];
    }

    history.push({ role, parts });
  }

  return { system, history };
}

export class GoogleAdapter implements ProviderAdapter {
  private client: GoogleGenerativeAI;

  constructor() {
    this.client = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY ?? "");
  }

  async complete(req: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const modelName = stripProviderPrefix(req.model);
    const { system, history } = toGoogleContents(req.messages);

    const model = this.client.getGenerativeModel({
      model: modelName,
      systemInstruction: system,
    });

    const lastMessage = history.pop();
    if (!lastMessage) throw new Error("No messages provided");

    const chat = model.startChat({
      history,
      generationConfig: {
        temperature: req.temperature,
        topP: req.top_p,
        maxOutputTokens: req.max_tokens ?? req.max_completion_tokens,
        stopSequences: typeof req.stop === "string" ? [req.stop] : req.stop,
      },
    });

    const userText = lastMessage.parts.map((p) => ("text" in p ? p.text : "")).join("");
    const result = await chat.sendMessage(userText);
    const response = result.response;
    const text = response.text();
    const usage = response.usageMetadata;

    return {
      id: `chatcmpl-${uuidv4()}`,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: req.model,
      choices: [
        {
          index: 0,
          message: { role: "assistant", content: text },
          finish_reason:
            response.candidates?.[0]?.finishReason === "STOP" ? "stop" : "length",
          logprobs: null,
        },
      ],
      usage: {
        prompt_tokens: usage?.promptTokenCount ?? 0,
        completion_tokens: usage?.candidatesTokenCount ?? 0,
        total_tokens: usage?.totalTokenCount ?? 0,
      },
    };
  }

  async stream(req: ChatCompletionRequest, onChunk: (chunk: ChatCompletionChunk) => void): Promise<void> {
    const modelName = stripProviderPrefix(req.model);
    const { system, history } = toGoogleContents(req.messages);
    const id = `chatcmpl-${uuidv4()}`;
    const created = Math.floor(Date.now() / 1000);

    const model = this.client.getGenerativeModel({
      model: modelName,
      systemInstruction: system,
    });

    const lastMessage = history.pop();
    if (!lastMessage) throw new Error("No messages provided");

    const chat = model.startChat({
      history,
      generationConfig: {
        temperature: req.temperature,
        topP: req.top_p,
        maxOutputTokens: req.max_tokens ?? req.max_completion_tokens,
      },
    });

    const userText = lastMessage.parts.map((p) => ("text" in p ? p.text : "")).join("");
    const result = await chat.sendMessageStream(userText);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        onChunk({
          id,
          object: "chat.completion.chunk",
          created,
          model: req.model,
          choices: [{ index: 0, delta: { content: text }, finish_reason: null }],
        });
      }
    }

    onChunk({
      id,
      object: "chat.completion.chunk",
      created,
      model: req.model,
      choices: [{ index: 0, delta: {}, finish_reason: "stop" }],
    });
  }
}
