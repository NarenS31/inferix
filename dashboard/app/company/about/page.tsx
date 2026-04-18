import type { Metadata } from "next";
import { MarketingLayout, PageHero, ContentSection, FeatureGrid } from "@/components/marketing-layout";

export const metadata: Metadata = {
  title: "About | Inferix",
  description: "Learn about the team and mission behind Inferix.",
};

export default function AboutPage() {
  return (
    <MarketingLayout>
      <PageHero
        label="About"
        title="Built for teams that ship."
        subtitle="Inferix exists to make routing AI traffic intelligent, observable, and affordable — without touching your application code."
      />
      <ContentSection>
        <div className="space-y-16">
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              { label: "Mission", body: "Remove the cost and complexity tax from production AI. Every dollar saved on inference is a dollar teams can reinvest in building." },
              { label: "Approach", body: "A transparent proxy, not a black box. You keep your provider contracts. Inferix sits in the middle, makes smart decisions, and gets out of the way." },
              { label: "Values", body: "Reliability over cleverness. We'd rather an obvious, boring solution that never fails than a sophisticated one that occasionally surprises you." },
              { label: "Stage", body: "Early access. We're a small team that moves fast and listens to every customer. If you're on the waitlist, expect a direct line to the people building this." },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-[#1E2A38] bg-[#0B1015] p-6">
                <div className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#06B6D4]">{item.label}</div>
                <p className="text-[#94A3B8]">{item.body}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="mb-6 text-xl font-semibold text-[#F1F5F9]">Why we built this</h2>
            <div className="space-y-4 text-[#94A3B8] leading-relaxed">
              <p>Teams integrating LLMs into production are writing the same boilerplate over and over: retry logic, cost tracking, fallback handling, provider A/B testing. It&apos;s all at the application layer, coupled into business logic, and impossible to audit across thousands of daily requests.</p>
              <p>Inferix moves that infrastructure to the network layer. Drop-in a single endpoint change, configure routing rules in the dashboard, and you immediately get per-request cost tracking, semantic caching, intelligent failover, and a complete audit log — with zero changes to your codebase.</p>
              <p>We're starting with the most common pain points: unexpected costs, opaque latency, and vendor lock-in. There's a lot more to build.</p>
            </div>
          </div>
        </div>
      </ContentSection>
    </MarketingLayout>
  );
}
