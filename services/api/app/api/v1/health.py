from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.dependencies import check_gemini, check_neo4j, check_postgres, check_redis
from app.schemas.common import HealthResponse, ReadinessResponse, ServiceStatus

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def liveness() -> HealthResponse:
    return HealthResponse(status=ServiceStatus.HEALTHY)


@router.get("/health/ready", response_model=ReadinessResponse)
async def readiness(db: AsyncSession = Depends(get_db)) -> ReadinessResponse:
    checks = [
        await check_postgres(db),
        await check_neo4j(),
        await check_redis(),
        await check_gemini(),
    ]

    unhealthy = [c for c in checks if c.status == ServiceStatus.UNHEALTHY]
    degraded = [c for c in checks if c.status == ServiceStatus.DEGRADED]

    if unhealthy:
        overall = ServiceStatus.UNHEALTHY
    elif degraded:
        overall = ServiceStatus.DEGRADED
    else:
        overall = ServiceStatus.HEALTHY

    return ReadinessResponse(status=overall, checks=checks)
