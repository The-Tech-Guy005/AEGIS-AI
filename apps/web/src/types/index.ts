export interface HealthResponse {
  status: "healthy" | "unhealthy" | "degraded";
  service: string;
  version: string;
  timestamp?: string;
}

export interface ServiceCheck {
  name: string;
  status: "healthy" | "unhealthy" | "degraded";
  latency_ms?: number;
  message?: string;
}

export interface ReadinessResponse {
  status: "healthy" | "unhealthy" | "degraded";
  checks: ServiceCheck[];
  timestamp?: string;
}

export type UserRole = "admin" | "responder" | "analyst" | "citizen";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  organization_id: string | null;
}

export interface UserProfile {
  id: string;
  clerk_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export type IncidentStatus =
  | "reported"
  | "verified"
  | "active"
  | "contained"
  | "resolved"
  | "archived";

export type IncidentSeverity = "low" | "moderate" | "high" | "critical";

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  ai_risk_score: number | null;
  created_at: string;
}
