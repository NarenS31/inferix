import type { Metadata } from "next";
import { MarketingLayout, PageHero, ContentSection } from "@/components/marketing-layout";

export const metadata: Metadata = {
  title: "Terms of Service | Inferix",
  description: "Terms governing use of the Inferix service.",
};

export default function TermsPage() {
  return (
    <MarketingLayout>
      <PageHero label="Legal" title="Terms of Service" subtitle="Last updated: April 2026" />
      <ContentSection>
        <div className="space-y-8 text-[#94A3B8] [&_h2]:text-[#F1F5F9] [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
          <p>By accessing or using Inferix you agree to these terms. If you do not agree, do not use the service.</p>

          <h2>1. Service</h2>
          <p>Inferix provides an AI inference proxy and management dashboard. We reserve the right to modify or discontinue the service with reasonable notice.</p>

          <h2>2. Account</h2>
          <p>You are responsible for maintaining the confidentiality of your API keys and account credentials. Notify us immediately of any unauthorized use.</p>

          <h2>3. Acceptable use</h2>
          <ul>
            <li>You may not use Inferix to violate applicable laws or the terms of your AI provider.</li>
            <li>You may not attempt to reverse-engineer, abuse, or overload the service.</li>
            <li>You are responsible for the content of requests sent through your API keys.</li>
          </ul>

          <h2>4. Fees and billing</h2>
          <p>Paid plans are billed in advance. Overages are billed at the end of each billing period. All fees are non-refundable except where required by law.</p>

          <h2>5. Limitation of liability</h2>
          <p>Inferix is provided &ldquo;as is&rdquo;. We are not liable for indirect, incidental, or consequential damages arising from your use of the service, including costs incurred with third-party AI providers.</p>

          <h2>6. Governing law</h2>
          <p>These terms are governed by the laws of the State of Delaware, USA, without regard to conflict-of-law provisions.</p>

          <h2>7. Contact</h2>
          <p>Legal questions: <a href="mailto:legal@inferix.dev" className="text-[#06B6D4] hover:underline">legal@inferix.dev</a>.</p>
        </div>
      </ContentSection>
    </MarketingLayout>
  );
}
