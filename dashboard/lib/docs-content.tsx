import type { ReactNode } from "react";
import {
  ApiEndpoint,
  DocsCallout,
  DocsCard,
  DocsCodeBlock,
  DocsKeyValueTable,
  DocsList,
  DocsSection,
  InlineCode,
} from "@/components/docs/primitives";

export interface DocsPageDefinition {
  slug: string;
  href: string;
  title: string;
  description: string;
  category: string;
  sections: Array<{ id: string; title: string }>;
  render: () => JSX.Element;
}

export const defaultDocSlug = "getting-started";

export const docsNavigation = [
  {
    title: "Basics",
    items: [
      { slug: "getting-started", label: "Getting Started" },
      { slug: "installation", label: "Installation" },
    ],
  },
  {
    title: "Optimization",
    items: [
      { slug: "routing-rules", label: "Routing Rules" },
      { slug: "caching", label: "Caching" },
      { slug: "dashboard", label: "Dashboard" },
    ],
  },
  {
    title: "Reference",
    items: [
      { slug: "api-reference", label: "API Reference" },
      { slug: "self-hosted", label: "Self-Hosted" },
    ],
  },
] as const;

const keyword = (text: string): JSX.Element => <span className="text-[#C084FC]">{text}</span>;
const stringToken = (text: string): JSX.Element => <span className="text-[#86EFAC]">{text}</span>;
const property = (text: string): JSX.Element => <span className="text-[#7DD3FC]">{text}</span>;
const symbol = (text: string): JSX.Element => <span className="text-[#F8FAFC]">{text}</span>;
const comment = (text: string): JSX.Element => <span className="text-[#64748B]">{text}</span>;
const numberToken = (text: string): JSX.Element => <span className="text-[#FBBF24]">{text}</span>;

function GettingStartedContent(): JSX.Element {
  return (
    <>
      <DocsSection
        id="what-is-inferix"
        title="What is Inferix"
        summary="Inferix sits in front of OpenAI-compatible traffic, picks the right provider for the request, and records the outcome in one control plane."
      >
        <p>
          Inferix is an OpenAI-compatible routing layer for teams running prompts across Anthropic,
          OpenAI, Google, Mistral, and Groq. Instead of wiring provider-specific clients into your
          application, you send every request to one endpoint and let Inferix handle provider
          choice, routing rules, semantic caching, and request logging.
        </p>
        <DocsList
          items={[
            <>Keep your existing request shape and toolchain.</>,
            <>Apply cost ceilings and escalation chains without changing application code.</>,
            <>Measure savings, latency, cache hits, and failures from one dashboard.</>,
          ]}
        />
      </DocsSection>

      <DocsSection
        id="quick-start"
        title="Quick start"
        summary="The fastest integration is one URL change. Keep your model and message format exactly the same."
      >
        <DocsCodeBlock
          title="Switch your base URL"
          language="TypeScript"
          badge="one line changed"
          lines={[
            <>{keyword("import")} {symbol("OpenAI")} {keyword("from")} {stringToken('"openai"')};</>,
            "",
            <>{keyword("const")} {symbol("client")} = {keyword("new")} {symbol("OpenAI")}({"{"}</>,
            <>&nbsp;&nbsp;{property("apiKey")}: {symbol("process")}.{symbol("env")}.{property("INFERIX_API_KEY")},</>,
            <>&nbsp;&nbsp;{property("baseURL")}: {stringToken('"https://api.inferix.ai/v1"')},</>,
            <>{"});"}</>,
          ]}
        />
        <DocsCallout title="Authentication">
          Inferix uses the same <InlineCode>Authorization: Bearer ...</InlineCode> flow as other
          OpenAI-compatible APIs. If <InlineCode>INFERIX_API_KEY</InlineCode> is not set on the
          server, requests are accepted in development mode.
        </DocsCallout>
      </DocsSection>

      <DocsSection
        id="first-request"
        title="Your first request"
        summary="Once the base URL points at Inferix, your first request looks like any other chat completion."
      >
        <DocsCodeBlock
          title="POST /v1/chat/completions"
          language="bash"
          badge="openai-compatible"
          lines={[
            <>{keyword("curl")} {stringToken('"https://api.inferix.ai/v1/chat/completions"')} \\</>,
            <>&nbsp;&nbsp;-H {stringToken('"Authorization: Bearer inferix-demo-key"')} \\</>,
            <>&nbsp;&nbsp;-H {stringToken('"Content-Type: application/json"')} \\</>,
            <>&nbsp;&nbsp;-d {stringToken("'{\"model\":\"gpt-4o\",\"messages\":[{\"role\":\"user\",\"content\":\"Summarize request routing in one sentence.\"}]}'")}</>,
          ]}
        />
        <DocsCard>
          <div className="space-y-3">
            <div className="text-sm font-semibold text-foreground">What happens next</div>
            <p className="text-sm leading-7 text-mutedForeground">
              Inferix validates the request, checks semantic cache for a close prompt match,
              applies any routing rules for the endpoint tag, selects the final provider, and then
              returns an OpenAI-compatible response body. If you request streaming, Inferix proxies
              server-sent events and preserves usage metadata when the provider returns it.
            </p>
          </div>
        </DocsCard>
      </DocsSection>

      <DocsSection
        id="supported-providers"
        title="Supported providers"
        summary="Inferix routes to the providers already implemented in the service today."
      >
        <DocsKeyValueTable
          headers={["Provider", "How Inferix uses it"]}
          rows={[
            ["Anthropic", "Primary completion provider and semantic cache embedding source."],
            ["OpenAI", "Direct OpenAI-compatible completions and model substitution targets."],
            ["Google", "Gemini routing targets for lower-latency or lower-cost paths."],
            ["Mistral", "Cost-efficient fallback and escalation targets."],
            ["Groq", "Ultra-low-latency paths for fast response requirements."],
          ]}
        />
      </DocsSection>
    </>
  );
}

function InstallationContent(): JSX.Element {
  return (
    <>
      <DocsSection
        id="python-example"
        title="Python example"
        summary="The Python integration uses the official OpenAI client with Inferix as the base URL."
      >
        <DocsCodeBlock
          title="Python quickstart"
          language="Python"
          lines={[
            <>{keyword("from")} {symbol("openai")} {keyword("import")} {symbol("OpenAI")}</>,
            "",
            <>{symbol("client")} = {symbol("OpenAI")}({"("}</>,
            <>&nbsp;&nbsp;{property("api_key")}= {stringToken('"inferix-demo-key"')},</>,
            <>&nbsp;&nbsp;{property("base_url")}= {stringToken('"https://api.inferix.ai/v1"')},</>,
            <>{")"}</>,
            "",
            <>{symbol("response")} = {symbol("client")}.{symbol("chat")}.{symbol("completions")}.{symbol("create")}({"("}</>,
            <>&nbsp;&nbsp;{property("model")}= {stringToken('"gpt-4o"')},</>,
            <>&nbsp;&nbsp;{property("messages")}= [{"{"}{stringToken('"role"')}: {stringToken('"user"')}, {stringToken('"content"')}: {stringToken('"Explain routing rules in one paragraph."')}{"}"}],</>,
            <>{")"}</>,
            <>{keyword("print")}({symbol("response")}.{symbol("choices")}[0].{symbol("message")}.{symbol("content")})</>,
          ]}
        />
      </DocsSection>

      <DocsSection
        id="nodejs-example"
        title="Node.js example"
        summary="Node.js uses the same client and payload shape. Only the API base changes."
      >
        <DocsCodeBlock
          title="Node.js quickstart"
          language="TypeScript"
          lines={[
            <>{keyword("import")} {symbol("OpenAI")} {keyword("from")} {stringToken('"openai"')};</>,
            "",
            <>{keyword("const")} {symbol("client")} = {keyword("new")} {symbol("OpenAI")}({"{"}</>,
            <>&nbsp;&nbsp;{property("apiKey")}: {symbol("process")}.{symbol("env")}.{property("INFERIX_API_KEY")},</>,
            <>&nbsp;&nbsp;{property("baseURL")}: {stringToken('"https://api.inferix.ai/v1"')},</>,
            <>{"});"}</>,
            "",
            <>{keyword("const")} {symbol("response")} = {keyword("await")} {symbol("client")}.{symbol("chat")}.{symbol("completions")}.{symbol("create")}({"{"}</>,
            <>&nbsp;&nbsp;{property("model")}: {stringToken('"claude-sonnet-4-6"')},</>,
            <>&nbsp;&nbsp;{property("messages")}: [{"{"}{property("role")}: {stringToken('"user"')}, {property("content")}: {stringToken('"List the active providers."')}{"}"}],</>,
            <>{"});"}</>,
            "",
            <>{symbol("console")}.{symbol("log")}({symbol("response")}.{symbol("choices")}[0]?.{symbol("message")}.{symbol("content")});</>,
          ]}
        />
      </DocsSection>

      <DocsSection
        id="openai-compatible-sdk"
        title="Any OpenAI-compatible SDK example"
        summary="If a client lets you override the base URL, it can usually talk to Inferix unchanged."
      >
        <DocsCodeBlock
          title="Generic compatible client"
          language="Pseudo-code"
          lines={[
            comment("# Keep your client, request body, and response parsing the same"),
            <>{symbol("client")} = {symbol("CompatibleSDKClient")}({"{"}</>,
            <>&nbsp;&nbsp;{property("apiKey")}: {stringToken('"inferix-demo-key"')},</>,
            <>&nbsp;&nbsp;{property("baseURL")}: {stringToken('"https://api.inferix.ai/v1"')},</>,
            <>{"}"}</>,
            "",
            <>{symbol("client")}.{symbol("chat")}.{symbol("completions")}.{symbol("create")}({"{"} ...existingPayload {"}"})</>,
          ]}
        />
        <DocsList
          items={[
            <>Keep the request model name you want Inferix to start from.</>,
            <>Set the authorization header to your Inferix API key.</>,
            <>Leave response parsing untouched because the response shape stays OpenAI-compatible.</>,
          ]}
        />
      </DocsSection>
    </>
  );
}

function RoutingRulesContent(): JSX.Element {
  return (
    <>
      <DocsSection
        id="what-rules-do"
        title="What rules do"
        summary="Routing rules let you cap spend, prefer model sequences, and react to latency without branching inside your app code."
      >
        <p>
          Every rule is scoped to a user and an <InlineCode>endpointTag</InlineCode>. Inferix reads the
          matching rules before dispatching a request and can swap the final model, reject an overly
          expensive path, or fall through to a cheaper or faster model. The control point lives in
          Inferix, not in every application repository.
        </p>
        <DocsList
          items={[
            <>Use <InlineCode>preferredModels</InlineCode> to define an ordered routing path.</>,
            <>Use <InlineCode>costCeilingUsd</InlineCode> to stop costly models from being selected.</>,
            <>Use <InlineCode>latencyThresholdMs</InlineCode> to pivot to a faster model when speed matters.</>,
          ]}
        />
      </DocsSection>

      <DocsSection
        id="creating-your-first-rule"
        title="Creating your first rule"
        summary="A simple starter rule pins an endpoint to a preferred model list and a hard cost ceiling."
      >
        <DocsCodeBlock
          title="POST /v1/rules"
          language="JSON"
          lines={[
            "{",
            <>&nbsp;&nbsp;{stringToken('"endpointTag"')}: {stringToken('"support-bot"')},</>,
            <>&nbsp;&nbsp;{stringToken('"preferredModels"')}: [{stringToken('"claude-sonnet-4-6"')}, {stringToken('"gpt-4o-mini"')}],</>,
            <>&nbsp;&nbsp;{stringToken('"costCeilingUsd"')}: {numberToken("0.02")},</>,
            <>&nbsp;&nbsp;{stringToken('"latencyThresholdMs"')}: {numberToken("1200")},</>,
            <>&nbsp;&nbsp;{stringToken('"active"')}: {keyword("true")},</>,
            <>&nbsp;&nbsp;{stringToken('"maxTokens"')}: {numberToken("1200")}</>,
            "}",
          ]}
        />
      </DocsSection>

      <DocsSection
        id="cost-ceiling-explained"
        title="Cost ceiling explained"
        summary="Cost ceilings are guardrails, not rough suggestions. If a candidate model would cross the ceiling, Inferix moves on to the next valid option."
      >
        <DocsCallout title="Practical rule of thumb">
          Start with a ceiling slightly above your current median request cost, then tighten it per
          endpoint after you have a week of usage data. The best ceilings are endpoint-specific,
          because a retrieval-heavy support flow and a creative generation flow have very different
          cost profiles.
        </DocsCallout>
      </DocsSection>

      <DocsSection
        id="model-escalation-chains"
        title="Model escalation chains"
        summary="Preferred models are evaluated in order, so you can start cheap and only escalate when needed."
      >
        <DocsKeyValueTable
          headers={["Chain", "Recommended use"]}
          rows={[
            ["gpt-4o-mini -> gpt-4o", "Default path for general product copilots."],
            ["mistral-small-latest -> claude-sonnet-4-6", "Cost-first support and ops flows."],
            ["groq/llama-3.1-8b-instant -> gpt-4o-mini", "Latency-first endpoints that still need fallback depth."],
          ]}
        />
      </DocsSection>

      <DocsSection
        id="latency-fallback"
        title="Latency fallback"
        summary="Latency thresholds are useful when the endpoint has a strict user-facing response budget."
      >
        <DocsCodeBlock
          title="Latency-sensitive rule"
          language="JSON"
          lines={[
            "{",
            <>&nbsp;&nbsp;{stringToken('"endpointTag"')}: {stringToken('"autocomplete"')},</>,
            <>&nbsp;&nbsp;{stringToken('"preferredModels"')}: [{stringToken('"groq/llama-3.1-8b-instant"')}, {stringToken('"gpt-4o-mini"')}],</>,
            <>&nbsp;&nbsp;{stringToken('"latencyThresholdMs"')}: {numberToken("350")},</>,
            <>&nbsp;&nbsp;{stringToken('"active"')}: {keyword("true")}</>,
            "}",
          ]}
        />
      </DocsSection>
    </>
  );
}

function CachingContent(): JSX.Element {
  return (
    <>
      <DocsSection
        id="how-semantic-caching-works"
        title="How semantic caching works"
        summary="Inferix hashes the prompt, computes or reuses an embedding, and looks for a sufficiently similar previous response before calling a provider."
      >
        <DocsList
          items={[
            <>Prompt text is extracted from the chat payload and normalized.</>,
            <>Inferix checks for an exact or semantically similar prompt above the configured threshold.</>,
            <>On a hit, Inferix returns the cached OpenAI-compatible response immediately and logs the similarity score.</>,
          ]}
        />
        <DocsCallout title="Embedding behavior">
          Inferix tries to generate semantic embeddings with Anthropic first. If that is unavailable,
          it falls back to a deterministic embedding method so the cache remains usable in degraded or
          self-hosted environments.
        </DocsCallout>
      </DocsSection>

      <DocsSection
        id="cache-hit-rates"
        title="Cache hit rates"
        summary="High hit rates come from repeating requests that are stable enough to share answers."
      >
        <p>
          Good cache candidates include support macros, knowledge-base lookups, and structured prompt
          templates with a narrow answer space. Expect lower hit rates on highly personalized or
          long-context generation. The dashboard records hit rate, saved cost, and similarity scores so
          you can see whether the cache is helping or being too conservative.
        </p>
      </DocsSection>

      <DocsSection
        id="configuring-ttl-and-threshold"
        title="Configuring TTL and threshold"
        summary="Cache settings are stored per endpoint tag, with wildcard defaults available through the same API."
      >
        <DocsCodeBlock
          title="POST /v1/cache/settings"
          language="JSON"
          lines={[
            "{",
            <>&nbsp;&nbsp;{stringToken('"endpointTag"')}: {stringToken('"support-bot"')},</>,
            <>&nbsp;&nbsp;{stringToken('"ttlSeconds"')}: {numberToken("21600")},</>,
            <>&nbsp;&nbsp;{stringToken('"similarityThreshold"')}: {numberToken("0.94")},</>,
            <>&nbsp;&nbsp;{stringToken('"enabled"')}: {keyword("true")}</>,
            "}",
          ]}
        />
        <DocsKeyValueTable
          headers={["Setting", "What it controls"]}
          rows={[
            ["ttlSeconds", "How long a cached response stays eligible before expiration."],
            ["similarityThreshold", "How close a prompt must be to count as a semantic match."],
            ["enabled", "Whether caching is active for the endpoint tag."],
          ]}
        />
      </DocsSection>

      <DocsSection
        id="clearing-cache"
        title="Clearing cache"
        summary="You can inspect cache entries or delete them entirely when prompts or source data change."
      >
        <DocsCodeBlock
          title="Inspect and clear cache"
          language="bash"
          lines={[
            <>{keyword("curl")} {stringToken('"https://api.inferix.ai/v1/cache"')} -H {stringToken('"Authorization: Bearer inferix-demo-key"')}</>,
            "",
            <>{keyword("curl")} -X {symbol("DELETE")} {stringToken('"https://api.inferix.ai/v1/cache"')} \\</>,
            <>&nbsp;&nbsp;-H {stringToken('"Authorization: Bearer inferix-demo-key"')}</>,
          ]}
        />
      </DocsSection>
    </>
  );
}

function DashboardContent(): JSX.Element {
  return (
    <>
      <DocsSection
        id="overview-metrics-explained"
        title="Overview metrics explained"
        summary="The dashboard is designed to answer three questions quickly: how much traffic is flowing, how much it costs, and how much Inferix is saving."
      >
        <DocsKeyValueTable
          headers={["Metric", "How to read it"]}
          rows={[
            ["Requests today / month", "Raw traffic volume through Inferix."],
            ["Cost today / month", "Billed provider spend captured from request logs."],
            ["Cache hit rate", "Share of requests served from semantic cache."],
            ["Saved by cache", "Estimated provider cost avoided because cached responses were reused."],
            ["Routing savings", "Estimated delta between requested model cost and routed model cost."],
          ]}
        />
      </DocsSection>

      <DocsSection
        id="reading-your-logs"
        title="Reading your logs"
        summary="Each log entry captures the requested model, the final provider and model, token counts, latency, HTTP status, and cache metadata."
      >
        <DocsCodeBlock
          title="Sample usage row"
          language="JSON"
          lines={[
            "{",
            <>&nbsp;&nbsp;{stringToken('"provider"')}: {stringToken('"cache"')},</>,
            <>&nbsp;&nbsp;{stringToken('"requestedModel"')}: {stringToken('"gpt-4o"')},</>,
            <>&nbsp;&nbsp;{stringToken('"model"')}: {stringToken('"gpt-4o-mini"')},</>,
            <>&nbsp;&nbsp;{stringToken('"endpoint"')}: {stringToken('"support-bot"')},</>,
            <>&nbsp;&nbsp;{stringToken('"latencyMs"')}: {numberToken("42")},</>,
            <>&nbsp;&nbsp;{stringToken('"cacheHit"')}: {keyword("true")},</>,
            <>&nbsp;&nbsp;{stringToken('"cacheSimilarity"')}: {numberToken("0.97")}</>,
            "}",
          ]}
        />
      </DocsSection>

      <DocsSection
        id="understanding-cost-savings"
        title="Understanding cost savings"
        summary="Savings are directional metrics built from data you can inspect, not opaque estimates."
      >
        <DocsList
          items={[
            <>Routing savings compare the originally requested model against the final routed model.</>,
            <>Cache savings estimate the provider cost avoided by serving a cached completion.</>,
            <>If an endpoint uses more than one optimization path, read savings together with latency and quality outcomes before tightening rules further.</>,
          ]}
        />
      </DocsSection>
    </>
  );
}

function ApiReferenceContent(): JSX.Element {
  return (
    <>
      <DocsSection
        id="chat-completions"
        title="POST /v1/chat/completions"
        summary="OpenAI-compatible chat completion endpoint with optional streaming, routing, and cache interception."
      >
        <ApiEndpoint
          method="POST"
          path="/v1/chat/completions"
          description="Accepts a standard chat completion payload. Inferix requires a model and at least one message."
        >
          <DocsCodeBlock
            title="Request body"
            language="JSON"
            lines={[
              "{",
              <>&nbsp;&nbsp;{stringToken('"model"')}: {stringToken('"gpt-4o"')},</>,
              <>&nbsp;&nbsp;{stringToken('"messages"')}: [{"{"}{stringToken('"role"')}: {stringToken('"user"')}, {stringToken('"content"')}: {stringToken('"Summarize today\'s request volume."')}{"}"}],</>,
              <>&nbsp;&nbsp;{stringToken('"stream"')}: {keyword("false")}</>,
              "}",
            ]}
          />
          <DocsCodeBlock
            title="Response body"
            language="JSON"
            lines={[
              "{",
              <>&nbsp;&nbsp;{stringToken('"id"')}: {stringToken('"chatcmpl_123"')},</>,
              <>&nbsp;&nbsp;{stringToken('"object"')}: {stringToken('"chat.completion"')},</>,
              <>&nbsp;&nbsp;{stringToken('"model"')}: {stringToken('"gpt-4o-mini"')},</>,
              <>&nbsp;&nbsp;{stringToken('"choices"')}: [{"{"}{stringToken('"index"')}: {numberToken("0")}, {stringToken('"message"')}: {"{"}{stringToken('"role"')}: {stringToken('"assistant"')}, {stringToken('"content"')}: {stringToken('"Traffic is up 18% over yesterday."')}{"}"}{"}"}],</>,
              <>&nbsp;&nbsp;{stringToken('"usage"')}: {"{"}{stringToken('"prompt_tokens"')}: {numberToken("24")}, {stringToken('"completion_tokens"')}: {numberToken("12")}, {stringToken('"total_tokens"')}: {numberToken("36")}{"}"}</>,
              "}",
            ]}
          />
        </ApiEndpoint>
      </DocsSection>

      <DocsSection
        id="usage"
        title="GET /v1/usage"
        summary="Returns the latest logged requests, ordered by creation time descending."
      >
        <ApiEndpoint
          method="GET"
          path="/v1/usage"
          description="Use this endpoint for recent request logs, provider attribution, cache hit data, and latency inspection."
        >
          <DocsCodeBlock
            title="Response body"
            language="JSON"
            lines={[
              "{",
              <>&nbsp;&nbsp;{stringToken('"data"')}: [</>,
              <>&nbsp;&nbsp;&nbsp;&nbsp;{"{"}{stringToken('"provider"')}: {stringToken('"openai"')}, {stringToken('"model"')}: {stringToken('"gpt-4o-mini"')}, {stringToken('"statusCode"')}: {numberToken("200")}{"}"}</>,
              <>&nbsp;&nbsp;]</>,
              "}",
            ]}
          />
        </ApiEndpoint>
      </DocsSection>

      <DocsSection
        id="rules"
        title="GET, POST, PUT, DELETE /v1/rules"
        summary="Manage endpoint-level routing policy through the rules API."
      >
        <ApiEndpoint
          method="GET"
          path="/v1/rules"
          description="Returns all rules for the authenticated user."
        >
          <DocsCodeBlock
            title="Response body"
            language="JSON"
            lines={[
              "{",
              <>&nbsp;&nbsp;{stringToken('"data"')}: [{"{"}{stringToken('"id"')}: {stringToken('"rule_123"')}, {stringToken('"endpointTag"')}: {stringToken('"support-bot"')}{"}"}]</>,
              "}",
            ]}
          />
        </ApiEndpoint>
        <ApiEndpoint
          method="POST"
          path="/v1/rules"
          description="Creates a new rule. Successful creation returns HTTP 201 with the created rule in a data envelope."
        >
          <DocsCodeBlock
            title="Minimal request body"
            language="JSON"
            lines={[
              "{",
              <>&nbsp;&nbsp;{stringToken('"endpointTag"')}: {stringToken('"support-bot"')},</>,
              <>&nbsp;&nbsp;{stringToken('"preferredModels"')}: [{stringToken('"gpt-4o-mini"')}],</>,
              <>&nbsp;&nbsp;{stringToken('"active"')}: {keyword("true")}</>,
              "}",
            ]}
          />
        </ApiEndpoint>
        <ApiEndpoint
          method="PUT"
          path="/v1/rules/:id"
          description="Updates a user-owned rule in place. Fields omitted from the payload keep their previous values."
        >
          <DocsCodeBlock
            title="Update body"
            language="JSON"
            lines={[
              "{",
              <>&nbsp;&nbsp;{stringToken('"costCeilingUsd"')}: {numberToken("0.015")},</>,
              <>&nbsp;&nbsp;{stringToken('"latencyThresholdMs"')}: {numberToken("900")}</>,
              "}",
            ]}
          />
        </ApiEndpoint>
        <ApiEndpoint
          method="DELETE"
          path="/v1/rules/:id"
          description="Deletes a rule and returns HTTP 204 when successful."
        >
          <DocsCallout title="Delete response">
            A successful delete returns an empty body with status <InlineCode>204</InlineCode>. If the
            rule does not belong to the authenticated user, Inferix returns <InlineCode>404</InlineCode>.
          </DocsCallout>
        </ApiEndpoint>
      </DocsSection>

      <DocsSection
        id="cache"
        title="GET and DELETE /v1/cache"
        summary="Inspect cache entries, delete a single entry, or clear the entire cache for the authenticated user."
      >
        <ApiEndpoint
          method="GET"
          path="/v1/cache"
          description="Returns current cache entries and any active cache settings."
        >
          <DocsCodeBlock
            title="Response body"
            language="JSON"
            lines={[
              "{",
              <>&nbsp;&nbsp;{stringToken('"data"')}: [],</>,
              <>&nbsp;&nbsp;{stringToken('"settings"')}: [{"{"}{stringToken('"endpointTag"')}: {stringToken('"*"')}, {stringToken('"ttlSeconds"')}: {numberToken("86400")}{"}"}]</>,
              "}",
            ]}
          />
        </ApiEndpoint>
        <ApiEndpoint
          method="DELETE"
          path="/v1/cache"
          description="Clears all cache entries for the authenticated user and returns the number of deleted records."
        >
          <DocsCodeBlock
            title="Clear-all response"
            language="JSON"
            lines={[
              "{",
              <>&nbsp;&nbsp;{stringToken('"deletedCount"')}: {numberToken("42")}</>,
              "}",
            ]}
          />
        </ApiEndpoint>
        <ApiEndpoint
          method="DELETE"
          path="/v1/cache/:id"
          description="Deletes a single cache entry and returns HTTP 204 when successful."
        >
          <DocsCallout title="Entry deletion">
            Use the cache entry id from <InlineCode>GET /v1/cache</InlineCode> when you need to flush one
            stale answer without clearing the full cache.
          </DocsCallout>
        </ApiEndpoint>
      </DocsSection>
    </>
  );
}

function SelfHostedContent(): JSX.Element {
  return (
    <>
      <DocsSection
        id="docker-setup"
        title="Docker setup"
        summary="Inferix only needs the API service and Postgres. Redis is optional and improves cache lookup speed when present."
      >
        <DocsCodeBlock
          title="docker-compose.yml"
          language="YAML"
          lines={[
            <>{stringToken("services:")}</>,
            <>&nbsp;&nbsp;{stringToken("postgres:")}</>,
            <>&nbsp;&nbsp;&nbsp;&nbsp;{stringToken("image:")} postgres:16</>,
            <>&nbsp;&nbsp;&nbsp;&nbsp;{stringToken("environment:")}</>,
            <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;POSTGRES_USER: inferix</>,
            <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;POSTGRES_PASSWORD: inferix</>,
            <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;POSTGRES_DB: inferix</>,
            <>&nbsp;&nbsp;{stringToken("redis:")}</>,
            <>&nbsp;&nbsp;&nbsp;&nbsp;{stringToken("image:")} redis:7</>,
            <>&nbsp;&nbsp;{stringToken("inferix:")}</>,
            <>&nbsp;&nbsp;&nbsp;&nbsp;{stringToken("build:")} .</>,
            <>&nbsp;&nbsp;&nbsp;&nbsp;{stringToken("ports:")} ["3000:3000"]</>,
            <>&nbsp;&nbsp;&nbsp;&nbsp;{stringToken("environment:")}</>,
            <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PORT: 3000</>,
            <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DATABASE_URL: postgresql://inferix:inferix@postgres:5432/inferix</>,
            <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;REDIS_URL: redis://redis:6379</>,
            <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;INFERIX_API_KEY: inferix-local-key</>,
          ]}
        />
      </DocsSection>

      <DocsSection
        id="environment-variables"
        title="Environment variables"
        summary="These are the variables the current service actually reads in the codebase today."
      >
        <DocsKeyValueTable
          headers={["Variable", "Required for"]}
          rows={[
            ["PORT", "HTTP bind port. Defaults to 3000."],
            ["DATABASE_URL", "Required. Postgres connection used by Prisma."],
            ["INFERIX_API_KEY", "Optional in development, recommended in any shared environment."],
            ["REDIS_URL", "Optional. Enables Redis-backed cache lookup and embedding reuse."],
            ["OPENAI_API_KEY", "Required if routing to OpenAI models."],
            ["ANTHROPIC_API_KEY", "Required for Anthropic completions and preferred for semantic embeddings."],
            ["GOOGLE_API_KEY", "Required if routing to Google Gemini models."],
            ["MISTRAL_API_KEY", "Required if routing to Mistral models."],
            ["GROQ_API_KEY", "Required if routing to Groq models."],
          ]}
        />
      </DocsSection>

      <DocsSection
        id="running-locally"
        title="Running locally"
        summary="Local development is straightforward: install, migrate the database, then start the server and dashboard."
      >
        <DocsCodeBlock
          title="Local commands"
          language="bash"
          lines={[
            <>{keyword("npm")} install</>,
            <>{keyword("npx")} prisma migrate deploy --schema prisma/schema.prisma</>,
            <>{keyword("npm")} run dev</>,
            comment("# In a second terminal"),
            <>{keyword("cd")} dashboard &amp;&amp; {keyword("npm")} install &amp;&amp; {keyword("npm")} run dev</>,
          ]}
        />
      </DocsSection>
    </>
  );
}

export const docsPages: DocsPageDefinition[] = [
  {
    slug: "getting-started",
    href: "/docs/getting-started",
    title: "Getting Started",
    description: "What Inferix is, the one URL change, your first request, and the providers supported today.",
    category: "Basics",
    sections: [
      { id: "what-is-inferix", title: "What is Inferix" },
      { id: "quick-start", title: "Quick start" },
      { id: "first-request", title: "Your first request" },
      { id: "supported-providers", title: "Supported providers" },
    ],
    render: GettingStartedContent,
  },
  {
    slug: "installation",
    href: "/docs/installation",
    title: "Installation",
    description: "Python, Node.js, and generic OpenAI-compatible client examples for Inferix.",
    category: "Basics",
    sections: [
      { id: "python-example", title: "Python example" },
      { id: "nodejs-example", title: "Node.js example" },
      { id: "openai-compatible-sdk", title: "Any OpenAI-compatible SDK" },
    ],
    render: InstallationContent,
  },
  {
    slug: "routing-rules",
    href: "/docs/routing-rules",
    title: "Routing Rules",
    description: "Define endpoint-specific routing behavior with cost ceilings, ordered model chains, and latency fallbacks.",
    category: "Optimization",
    sections: [
      { id: "what-rules-do", title: "What rules do" },
      { id: "creating-your-first-rule", title: "Creating your first rule" },
      { id: "cost-ceiling-explained", title: "Cost ceiling explained" },
      { id: "model-escalation-chains", title: "Model escalation chains" },
      { id: "latency-fallback", title: "Latency fallback" },
    ],
    render: RoutingRulesContent,
  },
  {
    slug: "caching",
    href: "/docs/caching",
    title: "Caching",
    description: "How semantic caching works, how to tune it, and how to clear entries when prompts change.",
    category: "Optimization",
    sections: [
      { id: "how-semantic-caching-works", title: "How semantic caching works" },
      { id: "cache-hit-rates", title: "Cache hit rates" },
      { id: "configuring-ttl-and-threshold", title: "TTL and threshold" },
      { id: "clearing-cache", title: "Clearing cache" },
    ],
    render: CachingContent,
  },
  {
    slug: "dashboard",
    href: "/docs/dashboard",
    title: "Dashboard",
    description: "Read the control plane metrics, logs, and savings calculations with confidence.",
    category: "Optimization",
    sections: [
      { id: "overview-metrics-explained", title: "Overview metrics explained" },
      { id: "reading-your-logs", title: "Reading your logs" },
      { id: "understanding-cost-savings", title: "Understanding cost savings" },
    ],
    render: DashboardContent,
  },
  {
    slug: "api-reference",
    href: "/docs/api-reference",
    title: "API Reference",
    description: "Reference docs for chat completions, usage, rules, and cache management endpoints.",
    category: "Reference",
    sections: [
      { id: "chat-completions", title: "POST /v1/chat/completions" },
      { id: "usage", title: "GET /v1/usage" },
      { id: "rules", title: "Rules endpoints" },
      { id: "cache", title: "Cache endpoints" },
    ],
    render: ApiReferenceContent,
  },
  {
    slug: "self-hosted",
    href: "/docs/self-hosted",
    title: "Self-Hosted",
    description: "Run Inferix locally with Docker, Postgres, optional Redis, and provider credentials.",
    category: "Reference",
    sections: [
      { id: "docker-setup", title: "Docker setup" },
      { id: "environment-variables", title: "Environment variables" },
      { id: "running-locally", title: "Running locally" },
    ],
    render: SelfHostedContent,
  },
];

export function getDocPage(slug: string): DocsPageDefinition | undefined {
  return docsPages.find((page) => page.slug === slug);
}
