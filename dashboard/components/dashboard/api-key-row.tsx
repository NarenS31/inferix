"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { KeyVisibility } from "@/components/dashboard/key-visibility";

interface ApiKeyRowProps {
  id: string;
  name: string;
  keyValue: string;
  lastUsedAt: string | null;
}

export function ApiKeyRow({ id, name, keyValue, lastUsedAt }: ApiKeyRowProps): JSX.Element {
  const [currentKey, setCurrentKey] = useState(keyValue);
  const [loading, setLoading] = useState(false);

  async function regenerate(): Promise<void> {
    if (!confirm(`Revoke "${name}" and create a new key? The old key will stop working immediately.`)) return;
    setLoading(true);

    // Revoke old key
    await fetch(`/api/inferix/v1/keys/${id}`, { method: "DELETE" });

    // Create new key
    const res = await fetch("/api/inferix/v1/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setLoading(false);
    if (res.ok) {
      const data = (await res.json()) as { key: string };
      setCurrentKey(data.key);
    }
  }

  return (
    <div className="space-y-2 rounded-md border border-border p-3">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium">{name}</p>
        <Button variant="outline" size="sm" onClick={regenerate} disabled={loading} className="text-[12px] h-7 px-2">
          {loading ? "Regenerating..." : "Regenerate"}
        </Button>
      </div>
      <KeyVisibility value={currentKey} />
      {lastUsedAt ? (
        <p className="text-[11px] text-mutedForeground">Last used: {new Date(lastUsedAt).toLocaleDateString()}</p>
      ) : (
        <p className="text-[11px] text-mutedForeground">Never used</p>
      )}
    </div>
  );
}
