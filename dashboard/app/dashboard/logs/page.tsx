import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { formatDateTime } from "@/lib/date";
import { getLogs, type LogRow } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

const USER_ID = process.env.INFERIX_API_KEY ?? "inferix-...";

function modelCostBand(model: string): "cheap" | "mid" | "expensive" {
  const lower = model.toLowerCase();
  if (lower.includes("haiku") || lower.includes("mini") || lower.includes("small") || lower.includes("flash")) {
    return "cheap";
  }
  if (lower.includes("sonnet") || lower.includes("4o") || lower.includes("large")) {
    return "mid";
  }
  return "expensive";
}

function modelBadgeClass(model: string): string {
  const band = modelCostBand(model);
  if (band === "cheap") return "bg-success/20 text-success";
  if (band === "mid") return "bg-warning/20 text-warning";
  return "bg-danger/20 text-danger";
}

function rowClass(log: LogRow): string {
  return log.cacheHit ? "bg-blue-500/10" : "";
}

interface LogsPageProps {
  searchParams: {
    provider?: string;
    endpoint?: string;
    start?: string;
    end?: string;
  };
}

export default async function LogsPage({ searchParams }: LogsPageProps): Promise<JSX.Element> {
  const logs: LogRow[] = await getLogs(USER_ID, {
    provider: searchParams.provider,
    endpoint: searchParams.endpoint,
    start: searchParams.start ? new Date(searchParams.start) : undefined,
    end: searchParams.end ? new Date(searchParams.end) : undefined,
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Request Logs (Last 100)</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4" method="GET">
            <Select name="provider" defaultValue={searchParams.provider ?? "all"}>
              <option value="all">All Providers</option>
              <option value="anthropic">Anthropic</option>
              <option value="openai">OpenAI</option>
              <option value="google">Google</option>
              <option value="mistral">Mistral</option>
              <option value="groq">Groq</option>
            </Select>
            <Select name="endpoint" defaultValue={searchParams.endpoint ?? "all"}>
              <option value="all">All Endpoints</option>
              <option value="chat">chat</option>
              <option value="dashboard">dashboard</option>
              <option value="support">support</option>
              <option value="untagged">untagged</option>
            </Select>
            <input type="date" name="start" defaultValue={searchParams.start} className="h-9 rounded-md border border-border bg-muted px-3 text-sm" />
            <input type="date" name="end" defaultValue={searchParams.end} className="h-9 rounded-md border border-border bg-muted px-3 text-sm" />
            <button
              type="submit"
              className="h-9 rounded-md border border-border bg-card px-4 text-sm font-medium text-foreground md:col-span-4 md:justify-self-end"
            >
              Apply Filters
            </button>
          </form>
          <div className="overflow-x-auto">
            <Table>
              <THead>
                <TR>
                  <TH>Time</TH>
                  <TH>Endpoint</TH>
                  <TH>Model</TH>
                  <TH>Provider</TH>
                  <TH>Tokens</TH>
                  <TH>Cost</TH>
                  <TH>Latency</TH>
                  <TH>Status</TH>
                </TR>
              </THead>
              <TBody>
                {logs.map((log: LogRow) => (
                  <TR key={log.id} className={rowClass(log)}>
                    <TD>{formatDateTime(log.createdAt)}</TD>
                    <TD>{log.endpoint}</TD>
                    <TD>
                      <Badge className={modelBadgeClass(log.model)}>{log.model}</Badge>
                    </TD>
                    <TD>{log.cacheHit ? "cache" : log.provider}</TD>
                    <TD>{log.totalTokens.toLocaleString()}</TD>
                    <TD>${log.costUsd.toFixed(5)}</TD>
                    <TD>{log.latencyMs}ms</TD>
                    <TD>{log.statusCode}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
