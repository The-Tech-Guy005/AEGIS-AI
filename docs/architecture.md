# AEGIS AI Architecture

See the full architecture design in the project README and root documentation.

## Phase 0 (Complete)

- Monorepo scaffold
- FastAPI with `/v1/health` and `/v1/health/ready`
- Next.js landing page with API health badge
- Docker Compose: Postgres+PostGIS, Neo4j, Redis, MinIO
- Alembic migrations (PostGIS extension)
- GitHub Actions CI

## Next: Phase 1 — Auth & Users

JWT authentication, user/org models, login/register UI.
