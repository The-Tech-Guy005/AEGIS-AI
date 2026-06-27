import type { HealthResponse, ReadinessResponse, UserProfile } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new ApiError(response.status, `API error: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export const apiClient = {
  getHealth: () => request<HealthResponse>("/v1/health"),

  getReadiness: () => request<ReadinessResponse>("/v1/health/ready"),

  getMe: (token: string) =>
    request<UserProfile>("/v1/auth/me", {
      headers: authHeaders(token),
    }),
};

export { ApiError };
