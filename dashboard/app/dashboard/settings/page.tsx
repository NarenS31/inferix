import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ApiKeyRow } from "@/components/dashboard/api-key-row";

export const dynamic = "force-dynamic";

const PLAN_LIMIT_USD = 200;

function providerStatus(name: string, key?: string): { name: string; connected: boolean } {
  return { name, connected: Boolean(key) };
}

export default async function SettingsPage(): Promise<JSX.Element> {
  const currentUser = await getCurrentUser();
  const userId = currentUser?.userId ?? "";

  const [period, apiKeys] = await Promise.all([
    prisma.requestLog.aggregate({
      where: {
        userId,
        createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
      _sum: { costUsd: true },
    }),
    prisma.apiKey.findMany({
      where: { userId, active: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const used = Number(period._sum.costUsd ?? 0);
  const providers = [
    providerStatus("Anthropic", process.env.ANTHROPIC_API_KEY),
    providerStatus("OpenAI", process.env.OPENAI_API_KEY),
    providerStatus("Google", process.env.GOOGLE_API_KEY),
    providerStatus("Mistral", process.env.MISTRAL_API_KEY),
    providerStatus("Groq", process.env.GROQ_API_KEY),
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {apiKeys.map((k) => (
            <ApiKeyRow
              key={k.id}
              id={k.id}
              name={k.name}
              keyValue={k.key}
              lastUsedAt={k.lastUsedAt ? k.lastUsedAt.toISOString() : null}
            />
          ))}
          {apiKeys.length === 0 && (
            <p className="text-[13px] text-mutedForeground">No active API keys. Create one via the API.</p>
          )}
          <p className="text-[11px] text-mutedForeground pt-1">
            Use this key as the <code>api_key</code> in your OpenAI client pointed at Inferix.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connected Providers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {providers.map((provider) => (
            <div key={provider.name} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
              <span>{provider.name}</span>
              <span className={provider.connected ? "text-success" : "text-danger"}>
                {provider.connected ? "Connected" : "Missing"}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Billing Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-display text-3xl">${used.toFixed(4)} / ${PLAN_LIMIT_USD.toFixed(2)}</p>
          <div className="mt-3 h-2 rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-foreground"
              style={{ width: `${Math.min(100, (used / PLAN_LIMIT_USD) * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-mutedForeground">Current billing period usage against default plan limit.</p>
        </CardContent>
      </Card>
    </div>
  );
}
