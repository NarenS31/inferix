import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RulesEditor } from "@/components/dashboard/rules-editor";
import { getRuleFireStats } from "@/lib/dashboard-data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const USER_ID = process.env.INFERIX_API_KEY ?? "inferix-...";

export default async function RulesPage(): Promise<JSX.Element> {
  const [rules, fireCounts] = await Promise.all([
    prisma.routingRule.findMany({ where: { userId: USER_ID }, orderBy: { createdAt: "desc" } }),
    getRuleFireStats(USER_ID),
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Routing Rules</CardTitle>
      </CardHeader>
      <CardContent>
        <RulesEditor
          initialRules={rules.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))}
          fireCounts={fireCounts}
        />
      </CardContent>
    </Card>
  );
}
