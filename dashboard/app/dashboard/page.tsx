import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/metric-card";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { getOverview } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

const USER_ID = process.env.INFERIX_API_KEY ?? "inferix-...";

export default async function OverviewPage(): Promise<JSX.Element> {
  const overview = await getOverview(USER_ID);
  const isEmpty = overview.totalRequestsMonth === 0;

  return (
    <div className="space-y-4">
      {/* Row 1 — Money row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr_1fr]">
        <MetricCard
          title="Cost this month"
          value={`$${overview.totalCostMonth.toFixed(4)}`}
          size="large"
        />
        <MetricCard
          title="Routing savings (30 days)"
          value={`$${overview.costSavingsUsd.toFixed(2)}`}
          size="large"
        />
        <MetricCard
          title="Saved by cache"
          value={`$${overview.savedByCacheUsd.toFixed(2)}`}
          hint="This month"
          size="large"
        />
      </div>

      {/* Row 2 — Activity row */}
      <div className="metric-grid grid grid-cols-2 gap-4 xl:grid-cols-4">
        <MetricCard
          title="Requests today"
          value={overview.totalRequestsToday.toLocaleString()}
        />
        <MetricCard
          title="Requests this month"
          value={overview.totalRequestsMonth.toLocaleString()}
        />
        <MetricCard
          title="Average latency"
          value={`${overview.averageLatencyMs}ms`}
          hint="Across billing month"
        />
        <MetricCard
          title="Cache hit rate"
          value={`${overview.cacheHitRate.toFixed(1)}%`}
        />
        <MetricCard
          title="Cache hits"
          value={overview.cacheHitsMonth.toLocaleString()}
          subtitle={`${overview.cacheHitsToday.toLocaleString()} today`}
          hint="This month"
        />
      </div>

      {isEmpty && (
        <p className="pt-2 text-center text-[13px] text-[#555555]">
          No requests yet — point your app at Inferix to start seeing data
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Requests &amp; Cost — Last 30 Days</CardTitle>
            <div className="flex items-center gap-4 text-xs text-mutedForeground">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-[2px] w-3 rounded-full bg-accent" />
                Requests
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-[2px] w-3 rounded-full bg-[#555555]" />
                Cost ($)
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <OverviewChart data={overview.series} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
