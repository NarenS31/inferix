import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Accent = "default" | "success" | "warning" | "danger";

interface MetricCardProps {
  title: string;
  value: string;
  hint?: string;
  subtitle?: string;
  icon?: LucideIcon;
  accent?: Accent;
  size?: "default" | "large";
  className?: string;
}

export function MetricCard({
  title,
  value,
  hint,
  subtitle,
  icon: Icon,
  accent = "default",
  size = "default",
  className,
}: MetricCardProps): JSX.Element {
  void Icon;
  void accent;

  const padding = size === "large" ? "py-8 px-6" : "p-6";
  const valueSize = size === "large" ? "text-4xl" : "text-[32px]";

  return (
    <div className={cn("metric-card rounded-lg border border-border bg-card", padding, className)}>
      <div>
        <p className="text-[13px] font-normal leading-tight tracking-[0.01em] text-[#999999]">{title}</p>
        <p className={cn("mt-3 font-semibold leading-none tracking-tight tabular-nums text-[#F0F0F0]", valueSize)}>
          {value}
        </p>
        {subtitle && (
          <p className="mt-2 text-[13px] leading-relaxed text-[#666666]">{subtitle}</p>
        )}
        {hint && <p className="mt-2 text-[12px] text-mutedForeground">{hint}</p>}
      </div>
    </div>
  );
}
