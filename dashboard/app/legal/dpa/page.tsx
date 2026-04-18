import type { Metadata } from "next";
import { MarketingLayout, PageHero, ContentSection } from "@/components/marketing-layout";

export const metadata: Metadata = {
  title: "Data Processing Agreement | Inferix",
  description: "Inferix Data Processing Agreement (DPA) for GDPR compliance.",
};

export default function DPAPage() {
  return (
    <MarketingLayout>
      <PageHero label="Legal" title="Data Processing Agreement" subtitle="Last updated: April 2026" />
      <ContentSection>
        <div className="space-y-8 text-[#94A3B8] [&_h2]:text-[#F1F5F9] [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
          <p>This Data Processing Agreement (&ldquo;DPA&rdquo;) forms part of the Terms of Service between Inferix and you (the &ldquo;Controller&rdquo;). It governs Inferix&apos;s processing of personal data on your behalf.</p>

          <h2>1. Definitions</h2>
          <ul>
            <li><strong>Personal data</strong>: any information relating to an identified or identifiable natural person.</li>
            <li><strong>Processing</strong>: any operation performed on personal data.</li>
            <li><strong>Controller</strong>: you, the entity that determines the purposes of processing.</li>
            <li><strong>Processor</strong>: Inferix, acting on your instructions.</li>
          </ul>

          <h2>2. Scope of processing</h2>
          <p>Inferix processes request metadata (model, token counts, latency, cost estimates) on behalf of the Controller to provide the service. Inferix does not process the content of LLM prompts or completions.</p>

          <h2>3. Processor obligations</h2>
          <ul>
            <li>Process personal data only on documented instructions from the Controller.</li>
            <li>Ensure that authorized personnel are bound by confidentiality obligations.</li>
            <li>Implement appropriate technical and organizational security measures.</li>
            <li>Assist the Controller in responding to data subject requests.</li>
            <li>Delete or return personal data upon termination of the service.</li>
          </ul>

          <h2>4. Sub-processors</h2>
          <p>Inferix uses infrastructure sub-processors (hosting, database, monitoring) to deliver the service. A current list of sub-processors is available on request.</p>

          <h2>5. International transfers</h2>
          <p>Where personal data is transferred outside the EEA, Inferix relies on Standard Contractual Clauses as the legal transfer mechanism.</p>

          <h2>6. Execution</h2>
          <p>To execute this DPA for your organization, contact <a href="mailto:legal@inferix.dev" className="text-[#06B6D4] hover:underline">legal@inferix.dev</a>.</p>
        </div>
      </ContentSection>
    </MarketingLayout>
  );
}
