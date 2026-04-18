import type { Metadata } from "next";
import { MarketingLayout, PageHero, ContentSection, FeatureGrid } from "@/components/marketing-layout";

export const metadata: Metadata = {
  title: "Smart Routing | Inferix",
  description: "Automatically route every LLM request to the cheapest model that meets your quality bar.",
};

export default function RoutingPage() {
  return (
    <MarketingLayout>
      <PageHero
        label="Routing"
        title="Route smarter. Spend less."
        subtitle="Inferix evaluates cost, latency, and quality on every request, then picks the right model automatically."
      />

      <ContentSection>
        <FeatureGrid items={[
          { title: "Cost ceilings", description: "Set a max spend-per-request threshold. Inferix routes to the cheapest model that fits.", icon: "💰" },
          { title: "Model escalation chains", description: "Define an ordered list of models. Inferix falls back up the chain when cheaper options can't handle the request.", icon: "⛓️" },
          { title: "Latency fallback", description: "When a model is slow, Inferix automatically switches to a faster alternative mid-chain.", icon: "⚡" },
          { title: "Per-endpoint rules", description: "Apply different routing logic to each endpoint tag so creative tasks and classification tasks use different models.", icon: "🎯" },
        ]} />
      </ContentSection>

      <ContentSection className="border-t border-[#1E2A38]">
        <h2 className="text-3xl font-bold tracking-[-0.04em] text-[#F1F5F9]">How it works</h2>
        <div className="mt-8 space-y-6">
          {[
            { step: "01", title: "Tag your requests", body: "Add an X-Endpoint-Tag header to group requests by purpose. E.g. chat, summarize, classify." },
            { step: "02", title: "Define rules in the dashboard", body: "Set preferred models, cost ceilings, and latency thresholds per tag. Disable a rule at any time without code changes." },
            { step: "03", title: "Inferix routes in real time", body: "Each incoming request is evaluated against your rules and dispatched to the best provider within milliseconds." },
          ].map((item) => (
            <div key={item.step} className="flex gap-6 rounded-2xl border border-[#1E2A38] bg-[#0B1015] p-6">
              <div className="text-4xl font-black text-[#1E2A38]">{item.step}</div>
              <div>
                <h3 className="font-semibold text-[#F1F5F9]">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#94A3B8]">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection className="border-t border-[#1E2A38] text-center">
        <p className="text-lg text-[#94A3B8]">Ready to cut routing costs?</p>
        <a href="/login" className="mt-6 inline-flex items-center rounded-full bg-[#06B6D4] px-8 py-4 text-base font-semibold text-[#080C10] transition-opacity hover:opacity-90">Start for free →</a>
      </ContentSection>
    </MarketingLayout>
  );
}
