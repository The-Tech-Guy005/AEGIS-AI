#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> AEGIS AI — Development Setup"

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

echo "==> Starting Docker services..."
docker compose -f infra/docker/docker-compose.yml up -d

echo "==> Waiting for Postgres..."
until docker exec aegis-postgres pg_isready -U aegis -d aegis > /dev/null 2>&1; do
  sleep 1
done

echo "==> Setting up Python backend..."
cd services/api
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
alembic upgrade head
deactivate
cd "$ROOT_DIR"

echo "==> Setting up Next.js frontend..."
cd apps/web
npm install
cd "$ROOT_DIR"

echo ""
echo "Setup complete!"
echo ""
echo "  make dev-api   → http://localhost:8000"
echo "  make dev-web   → http://localhost:3000"
echo "  API docs       → http://localhost:8000/docs"
