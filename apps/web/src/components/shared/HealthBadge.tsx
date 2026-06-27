"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import type { HealthResponse } from "@/types";

export function HealthBadge() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiClient
      .getHealth()
      .then(setHealth)
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-danger/30 bg-danger/10 px-3 py-1 text-xs text-danger">
        <span className="h-2 w-2 rounded-full bg-danger" />
        API offline — start backend with make dev-api
      </span>
    );
  }

  if (!health) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
        <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground" />
        Checking API...
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
      <span className="h-2 w-2 rounded-full bg-primary" />
      {health.service} v{health.version} — {health.status}
    </span>
  );
}
