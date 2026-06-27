"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import type { UserProfile } from "@/types";

interface DashboardProfileProps {
  clerkUserId: string;
  email: string;
  fullName: string;
  imageUrl?: string;
}

export function DashboardProfile({
  clerkUserId,
  email,
  fullName,
  imageUrl,
}: DashboardProfileProps) {
  const { getToken } = useAuth();
  const [backendUser, setBackendUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) {
        setError("Unable to retrieve Clerk session token.");
        return;
      }

      const profile = await apiClient.getMe(token);
      setBackendUser(profile);
    } catch {
      setError("Backend profile sync unavailable. Ensure the API is running.");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section className="rounded-xl border border-border bg-card/40 p-6">
        <h2 className="mb-4 text-lg font-semibold">Clerk Session</h2>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Name</dt>
            <dd className="font-medium">{fullName}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium">{email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Clerk User ID</dt>
            <dd className="break-all font-mono text-xs">{clerkUserId}</dd>
          </div>
        </dl>
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={fullName}
            className="mt-4 h-12 w-12 rounded-full border border-border"
          />
        )}
      </section>

      <section className="rounded-xl border border-border bg-card/40 p-6">
        <h2 className="mb-4 text-lg font-semibold">Backend Profile</h2>
        {loading && <p className="text-sm text-muted-foreground">Syncing with API...</p>}
        {error && <p className="text-sm text-danger">{error}</p>}
        {!loading && !error && backendUser && (
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Role</dt>
              <dd className="font-medium capitalize">{backendUser.role}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Database ID</dt>
              <dd className="break-all font-mono text-xs">{backendUser.id}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Synced At</dt>
              <dd className="font-medium">
                {new Date(backendUser.updated_at).toLocaleString()}
              </dd>
            </div>
          </dl>
        )}
      </section>
    </div>
  );
}
