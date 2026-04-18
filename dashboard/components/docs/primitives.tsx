import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function DocsSection({
  id,
  title,
  summary,
  children,
}: {
  id: string;
  title: string;
  summary?: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <section id={id} className="scroll-mt-24 space-y-5 border-t border-border/70 pt-12 first:border-t-0 first:pt-0">
      <div className="space-y-2.5">
        <h2 className="text-[28px] font-semibold tracking-[-0.035em] text-foreground md:text-[34px]">{title}</h2>
        {summary ? <p className="max-w-3xl text-base leading-8 text-mutedForeground">{summary}</p> : null}
      </div>
      <div className="space-y-5 text-[15px] leading-8 text-foreground/90">{children}</div>
    </section>
  );
}

export function DocsCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}): JSX.Element {
  return <Card className={cn("rounded-xl border-border/70 bg-card p-5 shadow-none", className)}>{children}</Card>;
}

export function DocsCallout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <div className="border-l-2 border-[#6A8FA8] bg-muted/25 px-5 py-4">
      <div className="text-sm font-semibold tracking-[-0.01em] text-foreground">{title}</div>
      <div className="mt-2 text-sm leading-7 text-mutedForeground">{children}</div>
    </div>
  );
}

export function DocsCodeBlock({
  title,
  language,
  badge,
  lines,
}: {
  title: string;
  language: string;
  badge?: string;
  lines: ReactNode[];
}): JSX.Element {
  return (
    <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-none">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 bg-muted/25 px-5 py-3">
        <div>
          <div className="text-sm font-medium text-foreground">{title}</div>
          <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-mutedForeground">{language}</div>
        </div>
        {badge ? (
          <Badge className="border border-border/80 bg-transparent px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-mutedForeground">
            {badge}
          </Badge>
        ) : null}
      </div>
      <div className="overflow-x-auto px-0 py-4 font-mono text-[13px] leading-7 text-foreground/90">
        {lines.map((line, index) => (
          <div key={`${title}-${index + 1}`} className="grid grid-cols-[48px_minmax(0,1fr)] gap-0 px-5 even:bg-muted/[0.14]">
            <span className="select-none pr-4 text-right text-mutedForeground/60">{index + 1}</span>
            <span>{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function InlineCode({ children }: { children: ReactNode }): JSX.Element {
  return (
    <code className="rounded border border-border/70 bg-muted/35 px-1.5 py-0.5 font-mono text-[0.92em] text-foreground">
      {children}
    </code>
  );
}

export function DocsList({ items }: { items: ReactNode[] }): JSX.Element {
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3 text-mutedForeground">
          <span className="mt-[13px] h-px w-3 shrink-0 bg-[#6A8FA8]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function DocsKeyValueTable({
  rows,
  headers = ["Field", "Value"],
}: {
  rows: Array<[ReactNode, ReactNode]>;
  headers?: [string, string];
}): JSX.Element {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-none">
      <div className="overflow-x-auto">
        <Table>
          <THead>
            <TR className="hover:bg-transparent">
              <TH className="px-5">{headers[0]}</TH>
              <TH className="px-5">{headers[1]}</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map(([key, value], index) => (
              <TR key={index} className="border-border/80 hover:bg-muted/30">
                <TD className="px-5 font-mono text-[13px] text-foreground">{key}</TD>
                <TD className="px-5 text-mutedForeground">{value}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}

export function ApiEndpoint({
  method,
  path,
  description,
  children,
}: {
  method: string;
  path: string;
  description: string;
  children: ReactNode;
}): JSX.Element {
  const methodTone = {
    POST: "text-[#8FB7D4]",
    GET: "text-[#A8C0D1]",
    PUT: "text-[#9CB4C5]",
    DELETE: "text-[#B7C6D1]",
  } as const;

  const tone = methodTone[method as keyof typeof methodTone] ?? "text-[#9CB4C5]";

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-none">
      <div className="flex flex-wrap items-center gap-3 border-b border-border/70 pb-4">
        <Badge className={cn("border border-border/80 bg-muted/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em]", tone)}>
          {method}
        </Badge>
        <code className="font-mono text-sm text-foreground">{path}</code>
      </div>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-mutedForeground">{description}</p>
      <div className="mt-6 space-y-6">{children}</div>
    </div>
  );
}
