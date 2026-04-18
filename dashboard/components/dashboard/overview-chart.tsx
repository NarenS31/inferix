"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DailySeriesPoint } from "@/lib/dashboard-data";

interface TooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3.5 py-2.5 text-xs">
      <p className="mb-2 text-[12px] text-mutedForeground">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1 last:mb-0">
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: entry.color }}
          />
          <span className="text-mutedForeground capitalize">{entry.name}</span>
          <span className="ml-auto pl-4 font-semibold text-foreground tabular-nums">
            {entry.name === "cost" ? `$${entry.value.toFixed(4)}` : entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export function OverviewChart({ data }: { data: DailySeriesPoint[] }): JSX.Element {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 0, right: 4, top: 8, bottom: 0 }}>
          <XAxis
            dataKey="day"
            stroke="transparent"
            tick={{ fill: "#888888", fontSize: 11, fontFamily: "Inter" }}
            tickLine={false}
            axisLine={false}
            interval={4}
          />
          <YAxis
            yAxisId="left"
            stroke="transparent"
            tick={{ fill: "#888888", fontSize: 11, fontFamily: "Inter" }}
            tickLine={false}
            axisLine={false}
            width={36}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="transparent"
            tick={{ fill: "#888888", fontSize: 11, fontFamily: "Inter" }}
            tickLine={false}
            axisLine={false}
            width={48}
            tickFormatter={(v: number) => `$${v.toFixed(3)}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.06)", strokeWidth: 1 }} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="requests"
            stroke="#06B6D4"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3, fill: "#06B6D4", strokeWidth: 0 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="cost"
            stroke="#555555"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3, fill: "#555555", strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
