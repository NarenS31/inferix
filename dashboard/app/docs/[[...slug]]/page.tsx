import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Boxes, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { defaultDocSlug, docsNavigation, docsPages, getDocPage } from "@/lib/docs-content";

interface DocsPageProps {
  params: {
    slug?: string[];
  };
}

function resolvePage(params: DocsPageProps["params"]) {
  if (params.slug && params.slug.length > 1) {
    return undefined;
  }

  const slug = params.slug?.[0] ?? defaultDocSlug;
  return getDocPage(slug);
}

export function generateStaticParams(): Array<{ slug?: string[] }> {
  return [{}, ...docsPages.map((page) => ({ slug: [page.slug] }))];
}

export function generateMetadata({ params }: DocsPageProps): Metadata {
  const page = resolvePage(params);

  if (!page) {
    return {
      title: "Inferix Docs",
    };
  }

  return {
    title: `${page.title} | Inferix Docs`,
    description: page.description,
  };
}

export default function DocsPage({ params }: DocsPageProps): JSX.Element {
  const page = resolvePage(params);

  if (!page) {
    notFound();
  }

  const currentIndex = docsPages.findIndex((item) => item.slug === page.slug);
  const previousPage = currentIndex > 0 ? docsPages[currentIndex - 1] : null;
  const nextPage = currentIndex < docsPages.length - 1 ? docsPages[currentIndex + 1] : null;

  return (
    <div className="dashboard-shell min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(130,165,190,0),rgba(130,165,190,0.38),rgba(130,165,190,0))]" />
        <div className="pointer-events-none absolute left-20 top-0 h-20 w-48 bg-[radial-gradient(circle_at_top,rgba(120,170,205,0.16),transparent_70%)]" />
        <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/docs" className="flex items-center gap-2 text-[16px] font-semibold tracking-[-0.015em] text-foreground">
              <Image src="/brand/icon-mark.svg" alt="Inferix" width={16} height={16} className="h-4 w-4" />
              Inferix Docs
            </Link>
            <Badge className="hidden border border-border/70 bg-transparent px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-mutedForeground md:inline-flex">
              Control Plane
            </Badge>
          </div>
          <div className="flex items-center gap-5 text-[13px] font-medium tracking-[0.01em] text-mutedForeground">
            <Link href="/landing" className="hidden transition-colors hover:text-foreground sm:inline-flex">
              Product
            </Link>
            <Link href="/dashboard" className="hidden transition-colors hover:text-foreground sm:inline-flex">
              Dashboard
            </Link>
            <Link href="/docs/api-reference" className="inline-flex items-center gap-1 rounded-md border border-border/70 bg-muted/20 px-2.5 py-1 transition-colors hover:border-border hover:text-foreground">
              API reference
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1320px] gap-10 px-6 py-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_200px]">
        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          <div className="border-b border-border/70 pb-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <BookOpen size={16} className="text-accent" />
              Documentation
            </div>
            <p className="mt-3 text-sm leading-7 text-mutedForeground">
              OpenAI-compatible setup, routing control, semantic caching, and API reference for
              running Inferix in production.
            </p>
          </div>

          <nav className="border-l border-border/70 pl-3">
            {docsNavigation.map((group, groupIndex) => (
              <div key={group.title} className={cn("pr-2", groupIndex > 0 && "mt-5 pt-5 border-t border-border/70")}>
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-mutedForeground">
                  {group.title}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const targetPage = getDocPage(item.slug);
                    if (!targetPage) {
                      return null;
                    }

                    const active = targetPage.slug === page.slug;
                    return (
                      <Link
                        key={item.slug}
                        href={targetPage.href}
                        className={cn(
                          "block border-l px-3 py-2 text-sm transition-colors",
                          active
                            ? "border-[#6A8FA8] text-foreground"
                            : "border-transparent text-mutedForeground hover:border-border hover:text-foreground"
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        <div className="min-w-0">
          <div className="border-b border-border/70 pb-8 md:pb-10">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="border border-border/70 bg-transparent px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-mutedForeground">
                {page.category}
              </Badge>
              <span className="inline-flex items-center gap-2 text-sm text-mutedForeground">
                <Boxes size={15} />
                {page.sections.length} sections
              </span>
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-[-0.05em] text-foreground md:text-[56px]">
              {page.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-mutedForeground md:text-xl">
              {page.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm text-mutedForeground">
              {page.sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="border-b border-transparent pb-1 transition-colors hover:border-border hover:text-foreground"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </div>

          <article className="mt-10 space-y-10 px-0">
            {page.render()}
          </article>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {previousPage ? (
              <Link
                href={previousPage.href}
                className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted/25"
              >
                <div className="flex items-center gap-2 text-sm text-mutedForeground">
                  <ArrowLeft size={15} />
                  Previous
                </div>
                <div className="mt-3 text-lg font-semibold tracking-[-0.03em] text-foreground">
                  {previousPage.title}
                </div>
              </Link>
            ) : (
              <div className="hidden md:block" />
            )}

            {nextPage ? (
              <Link
                href={nextPage.href}
                className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted/25 md:text-right"
              >
                <div className="flex items-center justify-end gap-2 text-sm text-mutedForeground">
                  Next
                  <ArrowRight size={15} />
                </div>
                <div className="mt-3 text-lg font-semibold tracking-[-0.03em] text-foreground">
                  {nextPage.title}
                </div>
              </Link>
            ) : null}
          </div>
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-24 border-l border-border/70 pl-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mutedForeground">
              On this page
            </div>
            <div className="mt-4 space-y-3">
              {page.sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block text-sm leading-6 text-mutedForeground transition-colors hover:text-foreground"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
