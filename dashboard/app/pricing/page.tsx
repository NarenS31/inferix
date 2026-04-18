import type { Metadata } from "next";
import { MarketingLayout, PageHero, ContentSection } from "@/components/marketing-layout";

export const metadata: Metadata = {
  title: "Pricing | Inferix",
  description: "Simple, usage-based pricing. Start free, scale as you grow.",
};

const plans = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    description: "For early products shipping their first production traffic.",
    cta: "Start with Starter",
    featured: false,
    features: [
      "Up to 500K requests per month",
      "Smart model routing",
      "Semantic caching",
      "Full request logs",
      "Email support",
    ],
  },
  {
    name: "Growth",
    price: "$199",
    period: "/month",
    description: "For teams optimizing spend across multiple providers and models.",
    cta: "Start with Growth",
    featured: true,
    features: [
      "Up to 5M requests per month",
      "Advanced routing rules",
      "Cost and latency alerts",
      "Five team seats",
      "Priority support",
    ],
  },
  {
    name: "Scale",
    price: "$499",
    period: "/month",
    description: "For high-volume platforms that need tighter controls and guarantees.",
    cta: "Talk to sales",
    featured: false,
    features: [
      "Unlimited requests",
      "Custom routing logic",
      "99.99% SLA",
      "Dedicated Slack channel",
      "SSO and audit logs",
    ],
  },
];

export default function PricingPage() {
  return (
    <MarketingLayout>
      <PageHero
        label="Pricing"
        title="Pay for what you use."
        subtitle="No hidden fees, no per-seat gotchas. One monthly plan, unlimited team members."
      />

      <ContentSection>
        <div id="pricing" className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                plan.featured
                  ? "border-[#06B6D4] bg-[#0B1520]"
                  : "border-[#1E2A38] bg-[#0B1015]"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#06B6D4] px-4 py-1 text-xs font-semibold text-[#080C10]">
                  Most popular
                </div>
              )}
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#64748B]">{plan.name}</div>
              <div className="mt-4 flex items-end gap-1">
                <span className="text-5xl font-black tracking-[-0.05em] text-[#F1F5F9]">{plan.price}</span>
                <span className="mb-1 text-sm text-[#64748B]">{plan.period}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#94A3B8]">{plan.description}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#94A3B8]">
                    <span className="mt-0.5 shrink-0 text-[#06B6D4]"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/login"
                className={`mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90 ${
                  plan.featured
                    ? "bg-[#06B6D4] text-[#080C10]"
                    : "border border-[#1E2A38] text-[#F1F5F9] hover:bg-[#0D1117]"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection className="border-t border-[#1E2A38]">
        <h2 className="text-2xl font-bold tracking-[-0.04em] text-[#F1F5F9]">Frequently asked questions</h2>
        <div className="mt-8 space-y-6">
          {[
            { q: "Is there a free trial?", a: "Every plan starts with a 14-day free trial. No credit card required." },
            { q: "What counts as a request?", a: "One call to /v1/chat/completions counts as one request, regardless of token count." },
            { q: "What happens if I go over my limit?", a: "We'll notify you at 80% and 100% of your limit. We won't cut you off — overage is billed at $0.10 per 1,000 requests." },
            { q: "Can I change plans?", a: "Yes, upgrade or downgrade at any time. Changes apply immediately and are prorated." },
          ].map((item) => (
            <div key={item.q} className="rounded-2xl border border-[#1E2A38] bg-[#0B1015] p-6">
              <h3 className="font-semibold text-[#F1F5F9]">{item.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">{item.a}</p>
            </div>
          ))}
        </div>
      </ContentSection>
    </MarketingLayout>
  );
}
