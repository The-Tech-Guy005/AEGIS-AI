import time

from neo4j import AsyncGraphDatabase, AsyncDriver
from redis.asyncio import Redis
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.schemas.common import ServiceCheck, ServiceStatus

_neo4j_driver: AsyncDriver | None = None
_redis_client: Redis | None = None


def get_neo4j_driver() -> AsyncDriver:
    global _neo4j_driver
    if _neo4j_driver is None:
        _neo4j_driver = AsyncGraphDatabase.driver(
            settings.neo4j_uri,
            auth=(settings.neo4j_user, settings.neo4j_password),
        )
    return _neo4j_driver


def get_redis_client() -> Redis:
    global _redis_client
    if _redis_client is None:
        _redis_client = Redis.from_url(settings.redis_url, decode_responses=True)
    return _redis_client


async def check_postgres(session: AsyncSession) -> ServiceCheck:
    start = time.perf_counter()
    try:
        await session.execute(text("SELECT 1"))
        latency = (time.perf_counter() - start) * 1000
        return ServiceCheck(name="postgres", status=ServiceStatus.HEALTHY, latency_ms=round(latency, 2))
    except Exception as exc:
        return ServiceCheck(name="postgres", status=ServiceStatus.UNHEALTHY, message=str(exc))


async def check_neo4j() -> ServiceCheck:
    start = time.perf_counter()
    try:
        driver = get_neo4j_driver()
        async with driver.session() as session:
            result = await session.run("RETURN 1 AS n")
            await result.single()
        latency = (time.perf_counter() - start) * 1000
        return ServiceCheck(name="neo4j", status=ServiceStatus.HEALTHY, latency_ms=round(latency, 2))
    except Exception as exc:
        return ServiceCheck(name="neo4j", status=ServiceStatus.UNHEALTHY, message=str(exc))


async def check_redis() -> ServiceCheck:
    start = time.perf_counter()
    try:
        client = get_redis_client()
        await client.ping()
        latency = (time.perf_counter() - start) * 1000
        return ServiceCheck(name="redis", status=ServiceStatus.HEALTHY, latency_ms=round(latency, 2))
    except Exception as exc:
        return ServiceCheck(name="redis", status=ServiceStatus.UNHEALTHY, message=str(exc))


async def check_gemini() -> ServiceCheck:
    if not settings.gemini_api_key:
        return ServiceCheck(
            name="gemini",
            status=ServiceStatus.DEGRADED,
            message="GEMINI_API_KEY not configured",
        )
    return ServiceCheck(name="gemini", status=ServiceStatus.HEALTHY, message="API key configured")
