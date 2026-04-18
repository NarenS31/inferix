import type { Metadata } from "next";
import { MarketingLayout, PageHero, ContentSection } from "@/components/marketing-layout";

export const metadata: Metadata = {
  title: "Privacy Policy | Inferix",
  description: "How Inferix collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <MarketingLayout>
      <PageHero label="Legal" title="Privacy Policy" subtitle={`Last updated: April 2026`} />
      <ContentSection>
        <div className="prose prose-invert max-w-none space-y-8 text-[#94A3B8] [&_h2]:text-[#F1F5F9] [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
          <p>Inferix (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates the Inferix API proxy service and dashboard. This policy describes how we handle your information.</p>

          <h2>Information we collect</h2>
          <ul>
            <li>Account data: email address and hashed password when you sign up.</li>
            <li>Usage data: request metadata including provider, model, token counts, latency, cost estimates, and cache hit status. We do <strong>not</strong> store the content of your LLM prompts or completions.</li>
            <li>Billing data: payment details processed by our payment provider. We do not store raw card numbers.</li>
          </ul>

          <h2>How we use your data</h2>
          <ul>
            <li>To operate and improve the service.</li>
            <li>To display usage metrics in your dashboard.</li>
            <li>To communicate service updates and important notices.</li>
          </ul>

          <h2>Data retention</h2>
          <p>Request logs are retained for 30 days by default. You may delete your account and associated data at any time via the dashboard or by contacting us.</p>

          <h2>Third parties</h2>
          <p>We use infrastructure providers (hosting, database) to operate the service. We do not sell your data to third parties or use it for advertising.</p>

          <h2>Security</h2>
          <p>All data is transmitted over TLS. API keys are stored hashed and never returned in plaintext after creation.</p>

          <h2>Contact</h2>
          <p>Questions about this policy: <a href="mailto:privacy@inferix.dev" className="text-[#06B6D4] hover:underline">privacy@inferix.dev</a>.</p>
        </div>
      </ContentSection>
    </MarketingLayout>
  );
}
