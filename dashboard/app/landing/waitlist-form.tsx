"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

type Status = "idle" | "loading" | "success" | "duplicate" | "error";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else if (res.status === 409) {
        setStatus("duplicate");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-success/10 border border-success/25 flex items-center justify-center">
          <CheckCircle size={24} className="text-success" />
        </div>
        <p className="font-display font-semibold text-lg">You&apos;re on the list!</p>
        <p className="text-mutedForeground text-sm">We&apos;ll reach out when your spot is ready.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          placeholder="you@company.com"
          className="flex-1 px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-mutedForeground text-sm focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="flex items-center gap-2 px-5 py-3 bg-accent text-background font-semibold rounded-lg text-sm hover:opacity-90 disabled:opacity-60 transition-opacity whitespace-nowrap"
        >
          {status === "loading" ? (
            <>
              <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
              Joining...
            </>
          ) : (
            <>
              Join waitlist <ArrowRight size={15} />
            </>
          )}
        </button>
      </div>
      {(status === "duplicate" || status === "error") && (
        <div className="mt-3 flex items-center gap-2 text-sm text-warning">
          <AlertCircle size={14} />
          {status === "duplicate"
            ? "You're already on the waitlist!"
            : "Something went wrong. Please try again."}
        </div>
      )}
    </form>
  );
}
