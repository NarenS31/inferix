import type { Metadata } from "next";
import { MarketingLayout, PageHero, ContentSection } from "@/components/marketing-layout";

export const metadata: Metadata = {
  title: "Customers | Inferix",
  description: "Teams using Inferix to cut AI costs and improve reliability.",
};

const testimonials = [
  {
    quote: "We cut our OpenAI spend by 38% in two weeks just by enabling caching. The routing rules took another hour to set up and now our p95 latency is half what it was.",
    author: "Engineering Lead",
    company: "Series A SaaS",
  },
  {
    quote: "Our team doesn't touch provider SDKs directly anymore. Inferix gives us a single endpoint and a dashboard. It's the first piece of AI infrastructure we've actually trusted.",
    author: "CTO",
    company: "AI-native startup",
  },
  {
    quote: "The logs page alone was worth it. We had no idea how much redundant traffic we were sending until we saw the cache hit rate on day one.",
    author: "Backend Engineer",
    company: "Developer tools company",
  },
];

export default function CustomersPage() {
  return (
    <MarketingLayout>
      <PageHero
        label="Customers"
        title="Teams that ship faster, spend less."
        subtitle="Early-access companies sharing what changed when they dropped in Inferix."
      />
      <ContentSection>
        <div className="space-y-6">
          {testimonials.map((t, i) => (
            <div key={i} className="rounded-2xl border border-[#1E2A38] bg-[#0B1015] p-8">
              <blockquote className="mb-6 text-[#F1F5F9] text-lg leading-relaxed before:content-['\u201c'] after:content-['\u201d']">
                {t.quote}
              </blockquote>
              <div className="text-sm text-[#64748B]">
                <span className="text-[#94A3B8]">{t.author}</span> &mdash; {t.company}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-dashed border-[#1E2A38] bg-[#0B1015] p-10 text-center">
          <div className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#06B6D4]">Early access</div>
          <h3 className="mb-3 text-xl font-semibold text-[#F1F5F9]">Be one of the first teams.</h3>
          <p className="mx-auto mb-6 max-w-md text-[#94A3B8]">We&apos;re onboarding a small cohort of teams. If you&apos;re spending on LLM APIs and want more control, we&apos;d love to talk.</p>
          <a href="/landing#waitlist" className="inline-block rounded-full bg-[#06B6D4] px-6 py-2.5 text-sm font-semibold text-[#080C10] hover:bg-[#22D3EE] transition-colors">
            Join the waitlist
          </a>
        </div>
      </ContentSection>
    </MarketingLayout>
  );
}
