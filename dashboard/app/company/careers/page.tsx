import type { Metadata } from "next";
import { MarketingLayout, PageHero, ContentSection } from "@/components/marketing-layout";

export const metadata: Metadata = {
  title: "Careers | Inferix",
  description: "Work on AI infrastructure at Inferix.",
};

const openRoles = [
  {
    title: "Founding Engineer — Backend",
    type: "Full-time · Remote",
    description: "Own the proxy core: routing engine, streaming forwarding, cache layer. TypeScript / Node.js, Postgres, Redis.",
  },
  {
    title: "Founding Engineer — Frontend",
    type: "Full-time · Remote",
    description: "Build the dashboard that teams use daily to understand their AI costs and configure routing. Next.js, Tailwind.",
  },
  {
    title: "Developer Advocate",
    type: "Full-time · Remote",
    description: "Help developers integrate Inferix, write guides, publish examples, and represent users internally.",
  },
];

export default function CareersPage() {
  return (
    <MarketingLayout>
      <PageHero
        label="Careers"
        title="Come build the infrastructure layer for AI."
        subtitle="We're a small, early-stage team. Everyone owns something meaningful from day one."
      />
      <ContentSection>
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Fully remote", body: "Work from anywhere. We care about output, not timezone overlap." },
            { label: "Early equity", body: "Meaningful ownership. You're building the foundation, you should own a piece of it." },
            { label: "Direct impact", body: "No layers of management. You'll talk to customers and ship things that affect real workloads." },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-[#1E2A38] bg-[#0B1015] p-5">
              <div className="mb-1 text-sm font-semibold text-[#06B6D4]">{item.label}</div>
              <p className="text-sm text-[#64748B]">{item.body}</p>
            </div>
          ))}
        </div>

        <h2 className="mb-6 text-lg font-semibold text-[#F1F5F9]">Open roles</h2>
        <div className="space-y-4">
          {openRoles.map((role) => (
            <div key={role.title} className="flex flex-col gap-3 rounded-2xl border border-[#1E2A38] bg-[#0B1015] p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-1 font-semibold text-[#F1F5F9]">{role.title}</div>
                <div className="mb-2 text-xs text-[#06B6D4]">{role.type}</div>
                <p className="text-sm text-[#64748B]">{role.description}</p>
              </div>
              <a href="mailto:careers@inferix.dev" className="shrink-0 rounded-full border border-[#1E2A38] px-5 py-2 text-sm font-medium text-[#94A3B8] hover:border-[#06B6D4] hover:text-[#F1F5F9] transition-colors">
                Apply
              </a>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-[#64748B]">Don't see your role? We still want to hear from you — <a href="mailto:careers@inferix.dev" className="text-[#94A3B8] underline underline-offset-4 hover:text-[#F1F5F9]">careers@inferix.dev</a>.</p>
      </ContentSection>
    </MarketingLayout>
  );
}
