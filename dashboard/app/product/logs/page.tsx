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
          { title: "Per-request breakdown", description: "Prompt tokens, completion tokens, cost in USD, latency in ms, and status code for every request.", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="13" y2="15"/></svg> },
          { title: "Provider & model tracking", description: "Know exactly which provider handled a request and at what model tier — even when rules rerouted mid-chain.", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
          { title: "Cache hit visualization", description: "Instantly see which requests were served from cache and how much was saved.", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
          { title: "Error surfacing", description: "Failed requests are flagged with the upstream error message so you can debug without digging through provider consoles.", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
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
              <span className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-[#06B6D4]/10 flex items-center justify-center text-[#06B6D4]"><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
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
