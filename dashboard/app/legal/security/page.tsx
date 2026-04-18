import type { Metadata } from "next";
import { MarketingLayout, PageHero, ContentSection } from "@/components/marketing-layout";

export const metadata: Metadata = {
  title: "Security | Inferix",
  description: "Inferix security practices and responsible disclosure.",
};

export default function SecurityPage() {
  return (
    <MarketingLayout>
      <PageHero label="Security" title="Security at Inferix." subtitle="How we protect your data and how to report a vulnerability." />
      <ContentSection>
        <div className="grid gap-6 sm:grid-cols-2 mb-12">
          {[
            { label: "TLS everywhere", body: "All traffic between clients and Inferix is encrypted in transit using TLS 1.2+." },
            { label: "Hashed API keys", body: "API keys are stored as bcrypt hashes and never returned in plaintext after creation." },
            { label: "Scoped credentials", body: "Each API key has an associated plan and rate limit. Keys do not grant access to account management functions." },
            { label: "No prompt storage", body: "We do not persist the content of your LLM prompts or completions. Only metadata (model, tokens, latency) is logged." },
            { label: "Database encryption", body: "Data at rest is encrypted by our managed database provider." },
            { label: "Access controls", body: "Production access is restricted to a small set of engineers with MFA-enforced accounts." },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-[#1E2A38] bg-[#0B1015] p-5">
              <div className="mb-1 text-sm font-semibold text-[#06B6D4]">{item.label}</div>
              <p className="text-sm text-[#64748B]">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-[#1E2A38] bg-[#0B1015] p-8">
          <h2 className="mb-3 text-lg font-semibold text-[#F1F5F9]">Responsible disclosure</h2>
          <p className="mb-4 text-[#94A3B8] leading-relaxed">
            If you believe you have found a security vulnerability in Inferix, please disclose it responsibly. We ask that you not exploit the issue or disclose it publicly before we have had a reasonable time to address it.
          </p>
          <p className="text-[#94A3B8]">
            Report vulnerabilities to{" "}
            <a href="mailto:security@inferix.dev" className="text-[#06B6D4] hover:underline">
              security@inferix.dev
            </a>
            . We will acknowledge receipt within 48 hours.
          </p>
        </div>
      </ContentSection>
    </MarketingLayout>
  );
}
