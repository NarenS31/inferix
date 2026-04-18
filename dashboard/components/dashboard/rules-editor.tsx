"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Rule {
  id: string;
  endpointTag: string;
  preferredModels: string[];
  costCeilingUsd: number | null;
  latencyThresholdMs: number | null;
  maxTokens: number | null;
  active: boolean;
  createdAt: string;
}

interface RulesEditorProps {
  initialRules: Rule[];
  fireCounts: Record<string, number>;
}

export function RulesEditor({ initialRules, fireCounts }: RulesEditorProps): JSX.Element {
  const [rules, setRules] = useState(initialRules);
  const [draft, setDraft] = useState({ endpointTag: "*", preferredModels: "", costCeilingUsd: "", latencyThresholdMs: "", maxTokens: "" });

  const topRule = useMemo(() => {
    return [...rules].sort((a, b) => (fireCounts[b.id] ?? 0) - (fireCounts[a.id] ?? 0))[0];
  }, [rules, fireCounts]);

  async function refreshRules(): Promise<void> {
    const response = await fetch("/api/inferix/rules");
    const json = await response.json();
    setRules(json.data ?? []);
  }

  async function createRule(): Promise<void> {
    await fetch("/api/inferix/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        endpointTag: draft.endpointTag,
        preferredModels: draft.preferredModels.split(",").map((s) => s.trim()).filter(Boolean),
        costCeilingUsd: draft.costCeilingUsd ? Number(draft.costCeilingUsd) : null,
        latencyThresholdMs: draft.latencyThresholdMs ? Number(draft.latencyThresholdMs) : null,
        maxTokens: draft.maxTokens ? Number(draft.maxTokens) : null,
      }),
    });
    setDraft({ endpointTag: "*", preferredModels: "", costCeilingUsd: "", latencyThresholdMs: "", maxTokens: "" });
    await refreshRules();
  }

  async function updateRule(id: string, patch: Partial<Rule>): Promise<void> {
    await fetch(`/api/inferix/rules/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    await refreshRules();
  }

  async function deleteRule(id: string): Promise<void> {
    await fetch(`/api/inferix/rules/${id}`, { method: "DELETE" });
    await refreshRules();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border bg-card p-4">
        <h3 className="font-display text-lg">Create Rule</h3>
        <div className="mt-3 grid gap-2 md:grid-cols-5">
          <Input placeholder="endpointTag" value={draft.endpointTag} onChange={(e) => setDraft((p) => ({ ...p, endpointTag: e.target.value }))} />
          <Input placeholder="modelA,modelB" value={draft.preferredModels} onChange={(e) => setDraft((p) => ({ ...p, preferredModels: e.target.value }))} />
          <Input placeholder="cost ceiling" value={draft.costCeilingUsd} onChange={(e) => setDraft((p) => ({ ...p, costCeilingUsd: e.target.value }))} />
          <Input placeholder="latency ms" value={draft.latencyThresholdMs} onChange={(e) => setDraft((p) => ({ ...p, latencyThresholdMs: e.target.value }))} />
          <Input placeholder="max tokens" value={draft.maxTokens} onChange={(e) => setDraft((p) => ({ ...p, maxTokens: e.target.value }))} />
        </div>
        <Button className="mt-3" onClick={createRule}>Add Rule</Button>
      </div>

      <div className="rounded-md border border-border bg-card p-4">
        <p className="text-sm text-mutedForeground">
          Most fired rule in last 7 days: <span className="text-foreground">{topRule ? `${topRule.endpointTag} (${fireCounts[topRule.id] ?? 0} hits)` : "No data"}</span>
        </p>
      </div>

      {rules.map((rule) => (
        <div key={rule.id} className="rounded-md border border-border bg-card p-4">
          <div className="grid gap-2 md:grid-cols-6">
            <Input value={rule.endpointTag} onChange={(e) => setRules((prev) => prev.map((r) => (r.id === rule.id ? { ...r, endpointTag: e.target.value } : r)))} />
            <Input value={rule.preferredModels.join(",")}
              onChange={(e) => setRules((prev) => prev.map((r) => (r.id === rule.id ? { ...r, preferredModels: e.target.value.split(",").map((m) => m.trim()).filter(Boolean) } : r)))}
            />
            <Input value={rule.costCeilingUsd ?? ""} onChange={(e) => setRules((prev) => prev.map((r) => (r.id === rule.id ? { ...r, costCeilingUsd: e.target.value ? Number(e.target.value) : null } : r)))} />
            <Input value={rule.latencyThresholdMs ?? ""} onChange={(e) => setRules((prev) => prev.map((r) => (r.id === rule.id ? { ...r, latencyThresholdMs: e.target.value ? Number(e.target.value) : null } : r)))} />
            <Input value={rule.maxTokens ?? ""} onChange={(e) => setRules((prev) => prev.map((r) => (r.id === rule.id ? { ...r, maxTokens: e.target.value ? Number(e.target.value) : null } : r)))} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={rule.active} onChange={(e) => setRules((prev) => prev.map((r) => (r.id === rule.id ? { ...r, active: e.target.checked } : r)))} />
              Active
            </label>
          </div>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={() => updateRule(rule.id, rule)}>Save</Button>
            <Button size="sm" variant="danger" onClick={() => deleteRule(rule.id)}>Delete</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
