from datetime import UTC, datetime
from enum import Enum

from pydantic import BaseModel, Field


class ServiceStatus(str, Enum):
    HEALTHY = "healthy"
    UNHEALTHY = "unhealthy"
    DEGRADED = "degraded"


class ServiceCheck(BaseModel):
    name: str
    status: ServiceStatus
    latency_ms: float | None = None
    message: str | None = None


class HealthResponse(BaseModel):
    status: ServiceStatus
    service: str = "aegis-api"
    version: str = "0.1.0"
    timestamp: datetime = Field(default_factory=lambda: datetime.now(UTC))


class ReadinessResponse(BaseModel):
    status: ServiceStatus
    checks: list[ServiceCheck]
    timestamp: datetime = Field(default_factory=lambda: datetime.now(UTC))
