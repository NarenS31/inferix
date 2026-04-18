import type { Metadata } from "next";
import { MarketingLayout, PageHero, ContentSection, FeatureGrid } from "@/components/marketing-layout";

export const metadata: Metadata = {
  title: "Request Logs | Inferix",
  description: "Every LLM request logged, searchable, and broken down by cost, latency, provider, and model.",
};

export default function LogsPage() {
  return (
    <MarketingLayout>
      <PageHero
        label="Logs"
        title="Full visibility into every request."
        subtitle="See exactly what was sent, what model responded, how long it took, and what it cost — for every single call."
      />

      <ContentSection>
        <FeatureGrid items={[
          { title: "Per-request breakdown", description: "Prompt tokens, completion tokens, cost in USD, latency in ms, and status code for every request.", icon: "📋" },
          { title: "Provider & model tracking", description: "Know exactly which provider handled a request and at what model tier — even when rules rerouted mid-chain.", icon: "🔍" },
          { title: "Cache hit visualization", description: "Instantly see which requests were served from cache and how much was saved.", icon: "⚡" },
          { title: "Error surfacing", description: "Failed requests are flagged with the upstream error message so you can debug without digging through provider consoles.", icon: "🚨" },
        ]} />
      </ContentSection>

      <ContentSection className="border-t border-[#1E2A38]">
        <h2 className="text-3xl font-bold tracking-[-0.04em] text-[#F1F5F9]">What you get out of the box</h2>
        <ul className="mt-8 space-y-4">
          {[
            "30-day rolling log retention",
            "Requests per day / month breakdowns",
            "Cost aggregated by provider, model, and endpoint tag",
            "Latency percentiles (p50, p95, p99)",
            "Filterable log table in the dashboard",
            "REST API access to your own logs",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-[#94A3B8]">
              <span className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-[#06B6D4]/10 flex items-center justify-center text-[#06B6D4] text-xs">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection className="border-t border-[#1E2A38] text-center">
        <p className="text-lg text-[#94A3B8]">Stop guessing where your LLM spend goes.</p>
        <a href="/login" className="mt-6 inline-flex items-center rounded-full bg-[#06B6D4] px-8 py-4 text-base font-semibold text-[#080C10] transition-opacity hover:opacity-90">Start for free →</a>
      </ContentSection>
    </MarketingLayout>
  );
}
