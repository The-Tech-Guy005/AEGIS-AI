# AEGIS AI

**Adaptive Emergency Geospatial Intelligence System**

AI-powered hazard response platform for real-time incident management, geospatial visualization, infrastructure impact modeling, and intelligent response planning.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Mapbox |
| Backend | FastAPI, Python 3.12 |
| Database | PostgreSQL 16 + PostGIS, Neo4j 5 |
| Cache/Queue | Redis 7, Celery |
| AI | Google Gemini 2.0 Flash |
| Storage | MinIO (S3-compatible) |

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+
- Python 3.12+

### Setup

```bash
# Clone and enter project
cd "HACKHAZARDS PROJECT"

# Copy environment variables
cp .env.example .env

# Start infrastructure (Postgres, Neo4j, Redis, MinIO)
make up

# Install dependencies
make setup

# Run database migrations
make migrate

# Start development servers (in separate terminals)
make dev-api   # FastAPI on http://localhost:8000
make dev-web   # Next.js on http://localhost:3000
```

### Verify

- Frontend: http://localhost:3000
- API docs: http://localhost:8000/docs
- Health check: http://localhost:8000/v1/health

## Project Structure

```
aegis-ai/
├── apps/web/           # Next.js frontend
├── services/api/       # FastAPI backend
├── infra/docker/       # Docker Compose configs
├── infra/terraform/    # Production IaC
├── docs/               # Architecture & API docs
└── scripts/            # Dev utility scripts
```

## Documentation

- [Architecture](docs/architecture.md)
- [API Reference](docs/api-reference.md)
- [Database Schema](docs/database-schema.md)

## License

Proprietary — HACKHAZARDS 2026
