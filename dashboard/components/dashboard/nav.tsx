"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, List, GitBranch, Settings } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/logs", label: "Logs", icon: List },
  { href: "/dashboard/rules", label: "Rules", icon: GitBranch },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardNav(): JSX.Element {
  const pathname = usePathname();

  return (
    <nav className="flex border-b border-border">
      {items.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium transition-colors select-none",
              active
                ? "text-foreground"
                : "text-[#666666] hover:text-mutedForeground"
            )}
          >
            <Icon size={13} strokeWidth={active ? 2.5 : 2} className="text-[#555555]" />
            {item.label}
            {active && (
              <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-t-sm bg-accent" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
