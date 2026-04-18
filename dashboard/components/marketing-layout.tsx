import Image from "next/image";
import Link from "next/link";

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#080C10] text-[#F1F5F9]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#1E2A38] bg-[rgba(13,17,23,0.78)] backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-[1100px] items-center justify-between px-6">
          <Link href="/landing" className="flex items-center gap-2 text-base font-semibold tracking-[-0.02em] text-[#F1F5F9]">
            <Image src="/brand/icon-mark.svg" alt="Inferix" width={18} height={18} className="h-[18px] w-[18px]" />
            Inferix
          </Link>
          <nav className="hidden items-center gap-10 md:flex">
            <Link href="/landing#features" className="text-sm text-[#94A3B8] transition-colors hover:text-[#F1F5F9]">Features</Link>
            <Link href="/landing#pricing" className="text-sm text-[#94A3B8] transition-colors hover:text-[#F1F5F9]">Pricing</Link>
            <Link href="/docs" className="text-sm text-[#94A3B8] transition-colors hover:text-[#F1F5F9]">Docs</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="inline-flex items-center rounded-full border border-[#1E2A38] px-4 py-2 text-sm font-medium text-[#F1F5F9] transition-colors hover:border-[#2B3B4C] hover:bg-[#0D1117]">Sign in</Link>
            <Link href="/login" className="inline-flex items-center rounded-full bg-[#06B6D4] px-4 py-2 text-sm font-semibold text-[#080C10] transition-opacity hover:opacity-90">Get started</Link>
          </div>
        </div>
      </header>
      <main className="pt-16">{children}</main>
      <footer className="border-t border-[#1E2A38] px-6 py-16">
        <div className="mx-auto max-w-[1100px] flex flex-col gap-4 text-sm text-[#64748B] md:flex-row md:items-center md:justify-between">
          <Link href="/landing" className="flex items-center gap-2 font-medium text-[#94A3B8]">
            <Image src="/brand/icon-mark.svg" alt="Inferix" width={16} height={16} />
            Inferix
          </Link>
          <div>© 2026 Inferix. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

export function PageHero({ label, title, subtitle }: { label: string; title: string; subtitle: string }) {
  return (
    <section className="px-6 pb-16 pt-28 md:pt-36">
      <div className="mx-auto max-w-[820px] text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#1E2A38] bg-[#0D1117] px-4 py-2 text-sm font-medium text-[#94A3B8]">
          <span className="h-2 w-2 rounded-full bg-[#06B6D4]" />
          {label}
        </div>
        <h1 className="mt-8 text-5xl font-black tracking-[-0.05em] text-[#F1F5F9] md:text-7xl" style={{ lineHeight: 1 }}>{title}</h1>
        <p className="mx-auto mt-6 max-w-[600px] text-xl leading-relaxed text-[#94A3B8]">{subtitle}</p>
      </div>
    </section>
  );
}

export function ContentSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`px-6 py-16 ${className}`}>
      <div className="mx-auto max-w-[820px]">{children}</div>
    </section>
  );
}

export function FeatureGrid({ items }: { items: { title: string; description: string; icon?: string }[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.title} className="rounded-2xl border border-[#1E2A38] bg-[#0B1015] p-6">
          {item.icon && <div className="mb-4 text-3xl">{item.icon}</div>}
          <h3 className="text-lg font-semibold text-[#F1F5F9]">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
