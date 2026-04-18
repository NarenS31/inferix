import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Inferix | Cut your LLM costs by 30-50% automatically",
  description:
    "One URL change. Works with every provider. No code rewrites.",
};

const providers = ["Anthropic", "OpenAI", "Google", "Mistral", "Groq"];

const valueProps = [
  {
    stat: "30-50%",
    label: "Lower inference spend",
    description: "Route to the cheapest model that still clears your quality bar.",
  },
  {
    stat: "5 providers",
    label: "One API edge",
    description: "Swap providers instantly without reworking prompts, SDKs, or fallbacks.",
  },
  {
    stat: "<10ms",
    label: "Added overhead",
    description: "Decisions happen at the edge fast enough to stay out of the way.",
  },
];

const steps = [
  {
    number: "01",
    title: "Point to Inferix",
    description: "Replace your provider base URL with Inferix and keep the rest of your code intact.",
  },
  {
    number: "02",
    title: "Route every request",
    description: "Inferix chooses the right provider, model, and cache path for each call in real time.",
  },
  {
    number: "03",
    title: "Watch costs fall",
    description: "Track savings, latency, and request logs from one dashboard instead of five consoles.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$49",
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

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Routing", href: "/product/routing" },
      { label: "Caching", href: "/product/caching" },
      { label: "Logs", href: "/product/logs" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Docs",
    links: [
      { label: "Quickstart", href: "/docs/quickstart" },
      { label: "API", href: "/docs/api" },
      { label: "Providers", href: "/docs/providers" },
      { label: "Changelog", href: "/docs/changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/company/about" },
      { label: "Customers", href: "/company/customers" },
      { label: "Contact", href: "/company/contact" },
      { label: "Careers", href: "/company/careers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
      { label: "Security", href: "/legal/security" },
      { label: "DPA", href: "/legal/dpa" },
    ],
  },
];

function DashboardScreenshot() {
  return (
    <div
      className="overflow-hidden rounded-[24px] border border-[#1E2A38] bg-[#0D1117]"
      style={{ boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}
    >
      <div className="flex h-11 items-center gap-2 border-b border-[#1E2A38] bg-[#0B1015] px-5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#1E2A38]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#1E2A38]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#1E2A38]" />
        <div className="ml-4 h-7 flex-1 rounded-full border border-[#1E2A38] bg-[#0F151C] px-4 text-center text-[11px] leading-7 text-[#64748B]">
          app.inferix.ai/dashboard
        </div>
      </div>

      <div className="grid gap-0 md:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="border-b border-[#1E2A38] bg-[#0A0F14] p-5 md:border-b-0 md:border-r">
          <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#F1F5F9]">
            <span className="h-2 w-2 rounded-full bg-[#06B6D4]" />
            Inferix
          </div>
          <div className="space-y-2 text-sm text-[#64748B]">
            {[
              "Overview",
              "Routing Rules",
              "Logs",
              "Caches",
              "Usage",
              "Settings",
            ].map((item, index) => (
              <div
                key={item}
                className={`rounded-xl border px-3 py-2 ${
                  index === 0
                    ? "border-[#1E2A38] bg-[#0D1117] text-[#F1F5F9]"
                    : "border-transparent bg-transparent"
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </aside>

        <div className="space-y-6 bg-[#0D1117] p-5 md:p-6">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Spend saved", "$18,420", "+34%"],
              ["Cache hit rate", "42.8%", "+11%"],
              ["Median latency", "684ms", "-18%"],
            ].map(([label, value, delta]) => (
              <div key={label} className="rounded-2xl border border-[#1E2A38] bg-[#0B1015] p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-[#64748B]">{label}</div>
                <div className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#F1F5F9]">
                  {value}
                </div>
                <div className="mt-2 text-sm text-[#06B6D4]">{delta} this month</div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <div className="rounded-2xl border border-[#1E2A38] bg-[#0B1015] p-5">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-[#F1F5F9]">Routing performance</div>
                  <div className="mt-1 text-sm text-[#64748B]">Quality held flat while average request cost fell.</div>
                </div>
                <div className="rounded-full border border-[#1E2A38] px-3 py-1 text-xs text-[#64748B]">
                  Last 30 days
                </div>
              </div>
              <div className="flex h-52 items-end gap-3 rounded-[20px] border border-[#141C25] bg-[#0A0F14] px-4 pb-4 pt-6">
                {[44, 52, 61, 58, 71, 76, 82, 87, 94].map((height, index) => (
                  <div key={height} className="flex flex-1 flex-col items-center gap-3">
                    <div
                      className="w-full rounded-t-full bg-[#06B6D4]"
                      style={{ height: `${height}%`, opacity: 0.3 + index * 0.05 }}
                    />
                    <span className="text-[11px] text-[#64748B]">W{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#1E2A38] bg-[#0B1015] p-5">
              <div className="text-sm font-medium text-[#F1F5F9]">Top routing rules</div>
              <div className="mt-5 space-y-3">
                {[
                  ["gpt-4.1 -> gpt-4.1-mini", "1.2M req", "Saved $6,780"],
                  ["claude-sonnet -> mistral-medium", "620K req", "Saved $4,120"],
                  ["Repeat prompts -> cache", "2.8M hits", "Saved $7,520"],
                ].map(([title, volume, saved]) => (
                  <div key={title} className="rounded-[18px] border border-[#1E2A38] bg-[#0A0F14] p-4">
                    <div className="text-sm font-medium text-[#F1F5F9]">{title}</div>
                    <div className="mt-2 flex items-center justify-between text-xs text-[#64748B]">
                      <span>{volume}</span>
                      <span>{saved}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CodeWindow() {
  const beforeLines: Array<{ content: ReactNode; highlighted?: boolean }> = [
    {
      content: (
        <>
          <span className="text-[#C084FC]">import</span>{" "}
          <span className="text-[#F8FAFC]">OpenAI</span>{" "}
          <span className="text-[#C084FC]">from</span>{" "}
          <span className="text-[#86EFAC]">&quot;openai&quot;</span>;
        </>
      ),
    },
    { content: "" },
    {
      content: (
        <>
          <span className="text-[#C084FC]">const</span>{" "}
          <span className="text-[#F8FAFC]">client</span>{" = "}
          <span className="text-[#C084FC]">new</span>{" "}
          <span className="text-[#F8FAFC]">OpenAI</span>({"{"}
        </>
      ),
    },
    {
      content: (
        <>
          <span className="text-[#F8FAFC]">  apiKey</span>: <span className="text-[#F8FAFC]">process</span>.
          <span className="text-[#F8FAFC]">env</span>.
          <span className="text-[#7DD3FC]">OPENAI_API_KEY</span>,
        </>
      ),
    },
    {
      content: (
        <>
          <span className="text-[#F8FAFC]">  baseURL</span>: <span className="text-[#86EFAC]">&quot;https://api.openai.com/v1&quot;</span>,
        </>
      ),
      highlighted: true,
    },
    { content: "});" },
    { content: "" },
    {
      content: (
        <>
          <span className="text-[#C084FC]">export default</span>{" "}
          <span className="text-[#F8FAFC]">client</span>;
        </>
      ),
    },
  ];

  const afterLines: Array<{ content: ReactNode; highlighted?: boolean }> = [
    {
      content: (
        <>
          <span className="text-[#C084FC]">import</span>{" "}
          <span className="text-[#F8FAFC]">OpenAI</span>{" "}
          <span className="text-[#C084FC]">from</span>{" "}
          <span className="text-[#86EFAC]">&quot;openai&quot;</span>;
        </>
      ),
    },
    { content: "" },
    {
      content: (
        <>
          <span className="text-[#C084FC]">const</span>{" "}
          <span className="text-[#F8FAFC]">client</span>{" = "}
          <span className="text-[#C084FC]">new</span>{" "}
          <span className="text-[#F8FAFC]">OpenAI</span>({"{"}
        </>
      ),
    },
    {
      content: (
        <>
          <span className="text-[#F8FAFC]">  apiKey</span>: <span className="text-[#F8FAFC]">process</span>.
          <span className="text-[#F8FAFC]">env</span>.
          <span className="text-[#7DD3FC]">OPENAI_API_KEY</span>,
        </>
      ),
    },
    {
      content: (
        <>
          <span className="text-[#F8FAFC]">  baseURL</span>: <span className="text-[#86EFAC]">&quot;https://api.inferix.ai/v1&quot;</span>,
        </>
      ),
      highlighted: true,
    },
    { content: "});" },
    { content: "" },
    {
      content: (
        <>
          <span className="text-[#C084FC]">export default</span>{" "}
          <span className="text-[#F8FAFC]">client</span>;
        </>
      ),
    },
  ];

  return (
    <div
      className="overflow-hidden rounded-[24px] border border-[#1E2A38] bg-[#0D1117]"
      style={{ boxShadow: "0 28px 60px rgba(0,0,0,0.45)" }}
    >
      <div className="flex items-center justify-between border-b border-[#1E2A38] bg-[#0B1015] px-5 py-4">
        <div>
          <div className="text-sm font-medium text-[#F1F5F9]">client.ts</div>
          <div className="mt-1 text-xs text-[#64748B]">Before and after your integration</div>
        </div>
        <span className="rounded-full border border-[#14532D] bg-[#052E16] px-3 py-1 text-xs font-medium text-[#86EFAC]">
          1 line changed
        </span>
      </div>

      <div className="grid lg:grid-cols-2">
        <div className="border-b border-[#1E2A38] lg:border-b-0 lg:border-r">
          <div className="border-b border-[#1E2A38] px-5 py-3 text-xs uppercase tracking-[0.2em] text-[#64748B]">
            Before
          </div>
          <div className="overflow-x-auto px-0 py-4 font-mono text-[14px] leading-7 text-[#CBD5E1]">
            {beforeLines.map((line, index) => (
              <div
                key={`before-${index + 1}`}
                className={`grid grid-cols-[56px_minmax(0,1fr)] px-5 ${
                  line.highlighted ? "bg-[rgba(239,68,68,0.08)]" : ""
                }`}
              >
                <span className="select-none pr-4 text-right text-[#475569]">{index + 1}</span>
                <span>{line.content}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="border-b border-[#1E2A38] px-5 py-3 text-xs uppercase tracking-[0.2em] text-[#64748B]">
            After
          </div>
          <div className="overflow-x-auto px-0 py-4 font-mono text-[14px] leading-7 text-[#CBD5E1]">
            {afterLines.map((line, index) => (
              <div
                key={`after-${index + 1}`}
                className={`grid grid-cols-[56px_minmax(0,1fr)] px-5 ${
                  line.highlighted ? "bg-[rgba(16,185,129,0.08)]" : ""
                }`}
              >
                <span className="select-none pr-4 text-right text-[#475569]">{index + 1}</span>
                <span>{line.content}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080C10] text-[#F1F5F9]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#1E2A38] bg-[rgba(13,17,23,0.78)] backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-[1100px] items-center justify-between px-6">
          <a href="/landing" className="flex items-center gap-2 text-base font-semibold tracking-[-0.02em] text-[#F1F5F9]">
            <Image src="/brand/icon-mark.svg" alt="Inferix" width={18} height={18} className="h-[18px] w-[18px]" />
            Inferix
          </a>

          <nav className="hidden items-center gap-10 md:flex">
            <a href="#features" className="text-sm text-[#94A3B8] transition-colors hover:text-[#F1F5F9]">
              Features
            </a>
            <a href="#pricing" className="text-sm text-[#94A3B8] transition-colors hover:text-[#F1F5F9]">
              Pricing
            </a>
            <a href="/docs" className="text-sm text-[#94A3B8] transition-colors hover:text-[#F1F5F9]">
              Docs
            </a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href="/login"
              className="inline-flex items-center rounded-full border border-[#1E2A38] px-4 py-2 text-sm font-medium text-[#F1F5F9] transition-colors hover:border-[#2B3B4C] hover:bg-[#0D1117]"
            >
              Sign in
            </a>
            <a
              href="/login"
              className="inline-flex items-center rounded-full bg-[#06B6D4] px-4 py-2 text-sm font-semibold text-[#080C10] transition-opacity hover:opacity-90"
            >
              Get started
            </a>
          </div>

          <a
            href="/login"
            className="inline-flex items-center rounded-full bg-[#06B6D4] px-4 py-2 text-sm font-semibold text-[#080C10] md:hidden"
          >
            Get started
          </a>
        </div>
      </header>

      <main>
        <section className="overflow-hidden px-6 pb-8 pt-[140px] md:pb-12 md:pt-[164px]">
          <div className="mx-auto max-w-[1100px] text-center">
            <div className="relative mx-auto max-w-[960px]">
              <div
                className="pointer-events-none absolute left-1/2 top-[-140px] h-[340px] w-[340px] -translate-x-1/2 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(6,182,212,0.18) 0%, rgba(6,182,212,0) 72%)" }}
              />

              <div className="relative inline-flex items-center gap-2 rounded-full border border-[#1E2A38] bg-[#0D1117] px-4 py-2 text-sm font-medium text-[#94A3B8]">
                <span className="h-2 w-2 rounded-full bg-[#06B6D4]" />
                LLM Infrastructure
              </div>

              <h1
                className="relative mt-8 text-[52px] font-black tracking-[-0.06em] text-[#F1F5F9] md:text-[80px] lg:text-[96px]"
                style={{ lineHeight: 0.98 }}
              >
                Cut your LLM costs
                <br />
                by <span className="text-[#06B6D4]">30-50%</span>. Automatically.
              </h1>

              <p className="mx-auto mt-8 max-w-[760px] text-[20px] font-light leading-[1.45] text-[#94A3B8] md:text-[24px]">
                One URL change. Works with every provider. No code rewrites.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="/login"
                  className="inline-flex min-w-[220px] items-center justify-center rounded-full bg-[#06B6D4] px-7 py-4 text-lg font-semibold text-[#080C10] transition-opacity hover:opacity-90"
                >
                  Start for free -&gt;
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex min-w-[220px] items-center justify-center rounded-full border border-[#1E2A38] px-7 py-4 text-lg font-medium text-[#F1F5F9] transition-colors hover:border-[#2B3B4C] hover:bg-[#0D1117]"
                >
                  See how it works
                </a>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm text-[#94A3B8]">
                <span className="w-full md:w-auto">Works with Anthropic, OpenAI, Google, Mistral, Groq</span>
                {providers.map((provider) => (
                  <span
                    key={provider}
                    className="rounded-full border border-[#1E2A38] bg-[#0D1117] px-3 py-1.5 text-sm text-[#94A3B8]"
                  >
                    {provider}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-16 md:mt-20">
              <div className="mx-auto max-w-[1020px] [transform:perspective(2400px)_rotateX(7deg)] md:[transform:perspective(2400px)_rotateX(7deg)_rotateY(-3deg)]">
                <DashboardScreenshot />
              </div>
            </div>
          </div>
        </section>

        <section id="code" className="px-6 py-20 md:py-32">
          <div className="mx-auto grid max-w-[1100px] items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
            <div>
              <div className="text-sm font-medium uppercase tracking-[0.22em] text-[#64748B]">Integration</div>
              <h2 className="mt-5 max-w-[420px] text-4xl font-bold tracking-[-0.05em] text-[#F1F5F9] md:text-6xl">
                One line of code.
              </h2>
              <p className="mt-6 max-w-[430px] text-lg leading-8 text-[#94A3B8] md:text-xl">
                Change your base_url. That&apos;s it. Your existing code works unchanged.
              </p>
            </div>

            <CodeWindow />
          </div>
        </section>

        <section id="features" className="px-6 py-20 md:py-32">
          <div className="mx-auto max-w-[1100px] border-y border-[#1E2A38] md:grid md:grid-cols-3">
            {valueProps.map((item, index) => (
              <div
                key={item.label}
                className={`px-6 py-10 md:px-10 md:py-12 ${
                  index < valueProps.length - 1 ? "md:border-r md:border-[#1E2A38]" : ""
                } ${index < valueProps.length - 1 ? "border-b border-[#1E2A38] md:border-b-0" : ""}`}
              >
                <div className="text-5xl font-black tracking-[-0.06em] text-[#F1F5F9] md:text-6xl">
                  {item.stat}
                </div>
                <div className="mt-4 text-base font-medium text-[#94A3B8]">{item.label}</div>
                <p className="mt-4 max-w-[280px] text-base leading-7 text-[#64748B]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="px-6 py-20 md:py-32">
          <div className="mx-auto max-w-[1100px]">
            <div className="max-w-[560px]">
              <div className="text-sm font-medium uppercase tracking-[0.22em] text-[#64748B]">How it works</div>
              <h2 className="mt-5 text-4xl font-bold tracking-[-0.05em] text-[#F1F5F9] md:text-6xl">
                Infrastructure that disappears into your stack.
              </h2>
            </div>

            <div className="relative mt-14 grid gap-10 md:mt-20 md:grid-cols-3 md:gap-8">
              <div className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-16 hidden border-t border-dashed border-[#1E2A38] md:block" />
              {steps.map((step) => (
                <div key={step.number} className="relative min-h-[240px] pt-10">
                  <div className="absolute left-0 top-0 text-[120px] font-black leading-none tracking-[-0.06em] text-[rgba(6,182,212,0.15)]">
                    {step.number}
                  </div>
                  <div className="relative z-10 pt-14">
                    <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[#F1F5F9]">
                      {step.title}
                    </h3>
                    <p className="mt-5 max-w-[290px] text-lg leading-8 text-[#94A3B8]">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 md:py-24">
          <div className="mx-auto max-w-[1100px] border-y border-[#1E2A38] py-12 md:py-14">
            <div className="text-center">
              <div className="text-sm font-medium uppercase tracking-[0.22em] text-[#64748B]">Trusted by teams building on</div>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-6 text-center md:grid-cols-5">
              {providers.map((provider) => (
                <div
                  key={provider}
                  className="text-xl font-semibold tracking-[-0.03em] text-[rgba(241,245,249,0.38)]"
                >
                  {provider}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="px-6 py-20 md:py-32">
          <div className="mx-auto max-w-[1100px]">
            <div className="max-w-[620px]">
              <div className="text-sm font-medium uppercase tracking-[0.22em] text-[#64748B]">Pricing</div>
              <h2 className="mt-5 text-4xl font-bold tracking-[-0.05em] text-[#F1F5F9] md:text-6xl">
                Clean pricing for teams already shipping requests.
              </h2>
            </div>

            <div className="mt-14 grid gap-6 md:mt-16 md:grid-cols-3 md:items-end">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-[28px] border bg-[#0D1117] p-8 ${
                    plan.featured
                      ? "border-[#06B6D4] md:-translate-y-4"
                      : "border-[#1E2A38]"
                  }`}
                  style={{
                    boxShadow: plan.featured
                      ? "0 24px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(6,182,212,0.14)"
                      : "none",
                  }}
                >
                  <div className="flex min-h-[32px] items-center justify-between gap-4">
                    <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[#F1F5F9]">
                      {plan.name}
                    </h3>
                    {plan.featured ? (
                      <span className="rounded-full border border-[#0E7490] bg-[rgba(6,182,212,0.12)] px-3 py-1 text-xs font-medium text-[#67E8F9]">
                        Most popular
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-6 flex items-end gap-2">
                    <span className="text-5xl font-black tracking-[-0.06em] text-[#F1F5F9]">
                      {plan.price}
                    </span>
                    <span className="pb-1 text-sm text-[#64748B]">/ month</span>
                  </div>
                  <p className="mt-5 min-h-[72px] text-base leading-7 text-[#94A3B8]">
                    {plan.description}
                  </p>
                  <a
                    href="/login"
                    className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors ${
                      plan.featured
                        ? "bg-[#06B6D4] text-[#080C10] hover:opacity-90"
                        : "border border-[#1E2A38] text-[#F1F5F9] hover:border-[#2B3B4C] hover:bg-[#0B1015]"
                    }`}
                  >
                    {plan.cta}
                  </a>
                  <div className="mt-8 space-y-4 border-t border-[#1E2A38] pt-8">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3 text-sm leading-6 text-[#CBD5E1]">
                        <span className="mt-0.5 shrink-0 text-[#06B6D4]"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#1E2A38] px-6 py-16 md:py-20">
        <div className="mx-auto max-w-[1100px]">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#64748B]">
                  {column.title}
                </div>
                <div className="mt-5 space-y-3 text-sm text-[#94A3B8]">
                  {column.links.map((link) => (
                    <div key={link.label}>
                      <a href={link.href} className="hover:text-[#F1F5F9] transition-colors">{link.label}</a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-col gap-4 border-t border-[#1E2A38] pt-8 text-sm text-[#64748B] md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 font-medium text-[#94A3B8]">
              <Image src="/brand/icon-mark.svg" alt="Inferix" width={16} height={16} className="h-4 w-4" />
              Inferix
            </div>
            <div>© 2026 Inferix. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
