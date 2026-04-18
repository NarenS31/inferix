"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function KeyVisibility({ value }: { value: string }): JSX.Element {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-3">
      <code className="block rounded-md bg-muted p-3 text-xs text-foreground">
        {show ? value : `${value.slice(0, 6)}${"*".repeat(Math.max(0, value.length - 10))}${value.slice(-4)}`}
      </code>
      <Button variant="outline" size="sm" onClick={() => setShow((s) => !s)}>
        {show ? "Hide" : "Show"} API Key
      </Button>
    </div>
  );
}
