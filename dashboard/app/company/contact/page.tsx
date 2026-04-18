import type { Metadata } from "next";
import { MarketingLayout, PageHero, ContentSection } from "@/components/marketing-layout";

export const metadata: Metadata = {
  title: "Contact | Inferix",
  description: "Get in touch with the Inferix team.",
};

export default function ContactPage() {
  return (
    <MarketingLayout>
      <PageHero
        label="Contact"
        title="Let's talk."
        subtitle="We reply to every message. No forms, no support queues — just email."
      />
      <ContentSection>
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            {
              label: "General",
              description: "Questions about Inferix, how it works, or whether it fits your stack.",
              email: "hello@inferix.dev",
            },
            {
              label: "Sales & Pricing",
              description: "Custom plans, volume pricing, or onboarding help for your team.",
              email: "sales@inferix.dev",
            },
            {
              label: "Security",
              description: "Responsible disclosure, security questions, or compliance inquiries.",
              email: "security@inferix.dev",
            },
            {
              label: "Support",
              description: "Having trouble with your account, API keys, or routing rules?",
              email: "support@inferix.dev",
            },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-[#1E2A38] bg-[#0B1015] p-6">
              <div className="mb-1 text-sm font-semibold uppercase tracking-[0.18em] text-[#06B6D4]">{item.label}</div>
              <p className="mb-4 text-sm text-[#64748B]">{item.description}</p>
              <a href={`mailto:${item.email}`} className="text-sm font-medium text-[#94A3B8] underline underline-offset-4 hover:text-[#F1F5F9] transition-colors">
                {item.email}
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-[#1E2A38] bg-[#0B1015] p-8 text-center">
          <p className="text-[#94A3B8]">Prefer async? Find us on <a href="https://twitter.com/inferixdev" className="text-[#06B6D4] hover:underline">X&nbsp;(Twitter)</a>.</p>
        </div>
      </ContentSection>
    </MarketingLayout>
  );
}
