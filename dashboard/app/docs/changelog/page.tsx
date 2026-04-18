import type { Metadata } from "next";
import { MarketingLayout, PageHero, ContentSection } from "@/components/marketing-layout";

export const metadata: Metadata = {
  title: "Changelog | Inferix",
  description: "New features, improvements, and fixes in Inferix.",
};

const entries = [
  {
    date: "April 2026",
    version: "v0.9",
    items: [
      { type: "new", text: "Waitlist and early-access onboarding flow" },
      { type: "new", text: "Semantic cache per-endpoint TTL configuration" },
      { type: "new", text: "User API key management via dashboard" },
      { type: "improved", text: "Routing rule fire count tracking (7-day window)" },
      { type: "fix", text: "Cache similarity threshold now applied correctly per request" },
    ],
  },
  {
    date: "March 2026",
    version: "v0.8",
    items: [
      { type: "new", text: "Request logs with cost, latency, and provider breakdown" },
      { type: "new", text: "Groq provider support" },
      { type: "new", text: "Mistral provider support" },
      { type: "improved", text: "Google Gemini model detection improved" },
      { type: "fix", text: "Edge case in OpenAI streaming response forwarding fixed" },
    ],
  },
  {
    date: "February 2026",
    version: "v0.7",
    items: [
      { type: "new", text: "Initial routing rules engine" },
      { type: "new", text: "Semantic caching with pgvector embeddings" },
      { type: "new", text: "Dashboard overview with spend, cache hit rate, and latency cards" },
      { type: "new", text: "Anthropic, OpenAI, and Google providers added" },
    ],
  },
];

const typeStyles: Record<string, string> = {
  new: "bg-[#052E16] text-[#86EFAC] border-[#14532D]",
  improved: "bg-[#0C1B33] text-[#7DD3FC] border-[#1E3A5F]",
  fix: "bg-[#1C0A00] text-[#FDBA74] border-[#431407]",
};

export default function ChangelogPage() {
  return (
    <MarketingLayout>
      <PageHero
        label="Changelog"
        title="What's new."
        subtitle="A running log of features shipped, things improved, and bugs squashed."
      />
      <ContentSection>
        <div className="space-y-12">
          {entries.map((entry) => (
            <div key={entry.version}>
              <div className="mb-6 flex items-center gap-4">
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#64748B]">{entry.date}</div>
                <div className="rounded-full border border-[#1E2A38] bg-[#0D1117] px-3 py-1 text-xs font-medium text-[#94A3B8]">{entry.version}</div>
                <div className="flex-1 border-t border-[#1E2A38]" />
              </div>
              <div className="space-y-3">
                {entry.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-2xl border border-[#1E2A38] bg-[#0B1015] px-5 py-4">
                    <span className={`mt-0.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${typeStyles[item.type]}`}>{item.type}</span>
                    <span className="text-sm text-[#94A3B8]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ContentSection>
    </MarketingLayout>
  );
}
