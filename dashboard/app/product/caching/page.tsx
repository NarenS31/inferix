import type { Metadata } from "next";
import { MarketingLayout, PageHero, ContentSection, FeatureGrid } from "@/components/marketing-layout";

export const metadata: Metadata = {
  title: "Semantic Caching | Inferix",
  description: "Cache LLM responses at the semantic level. Serve similar questions from cache instead of hitting the API.",
};

export default function CachingPage() {
  return (
    <MarketingLayout>
      <PageHero
        label="Caching"
        title="Answer once. Serve forever."
        subtitle="Inferix's semantic cache serves near-duplicate prompts from cache, slashing both tokens and latency."
      />

      <ContentSection>
        <FeatureGrid items={[
          { title: "Semantic matching", description: "Responses are matched by meaning, not exact text. 'Summarize this article' and 'Give me a summary' hit the same cache entry.", icon: "🧠" },
          { title: "Configurable thresholds", description: "Tune the similarity threshold per endpoint. Higher = stricter cache hits. Lower = more savings.", icon: "🎚️" },
          { title: "TTL per endpoint", description: "Set how long cached responses live. Short for volatile data, long for stable reference content.", icon: "⏱️" },
          { title: "Instant invalidation", description: "Clear cache entries via API when your underlying data changes without waiting for TTL expiry.", icon: "🗑️" },
        ]} />
      </ContentSection>

      <ContentSection className="border-t border-[#1E2A38]">
        <h2 className="text-3xl font-bold tracking-[-0.04em] text-[#F1F5F9]">Average cache impact</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { metric: "42%", label: "Average cache hit rate", note: "Across all Inferix users" },
            { metric: "0ms", label: "LLM latency on cache hits", note: "Response served from store" },
            { metric: "100%", label: "Token savings on cache hits", note: "Zero tokens consumed" },
          ].map((item) => (
            <div key={item.metric} className="rounded-2xl border border-[#1E2A38] bg-[#0B1015] p-6 text-center">
              <div className="text-5xl font-black tracking-[-0.05em] text-[#06B6D4]">{item.metric}</div>
              <div className="mt-3 font-medium text-[#F1F5F9]">{item.label}</div>
              <div className="mt-1 text-sm text-[#64748B]">{item.note}</div>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection className="border-t border-[#1E2A38] text-center">
        <p className="text-lg text-[#94A3B8]">Start caching your LLM responses today.</p>
        <a href="/login" className="mt-6 inline-flex items-center rounded-full bg-[#06B6D4] px-8 py-4 text-base font-semibold text-[#080C10] transition-opacity hover:opacity-90">Get started →</a>
      </ContentSection>
    </MarketingLayout>
  );
}
