.PHONY: help setup dev up down logs migrate seed test lint format

help:
	@echo "AEGIS AI — Development Commands"
	@echo ""
	@echo "  make setup     Install all dependencies"
	@echo "  make up        Start Docker services"
	@echo "  make down      Stop Docker services"
	@echo "  make dev       Start backend + frontend in dev mode"
	@echo "  make migrate   Run database migrations"
	@echo "  make seed      Seed demo data"
	@echo "  make test      Run all tests"
	@echo "  make lint      Run linters"
	@echo "  make format    Format code"

setup:
	@echo "Setting up backend..."
	cd services/api && python3 -m venv .venv && . .venv/bin/activate && pip install -e ".[dev]"
	@echo "Setting up frontend..."
	cd apps/web && npm install
	@test -f apps/web/.env.local || cp apps/web/.env.example apps/web/.env.local
	@echo "Copy .env.example to .env if not exists..."
	@test -f .env || cp .env.example .env
	@echo "Setup complete."

up:
	docker compose -f infra/docker/docker-compose.yml up -d

down:
	docker compose -f infra/docker/docker-compose.yml down

logs:
	docker compose -f infra/docker/docker-compose.yml logs -f

migrate:
	cd services/api && . .venv/bin/activate && alembic upgrade head

seed:
	cd services/api && . .venv/bin/activate && python -m app.db.seed.demo_data

dev-api:
	cd services/api && . .venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-web:
	cd apps/web && npm run dev

test:
	cd services/api && . .venv/bin/activate && pytest tests/ -v
	cd apps/web && npm run test --if-present

lint:
	cd services/api && . .venv/bin/activate && ruff check app tests && mypy app
	cd apps/web && npm run lint

format:
	cd services/api && . .venv/bin/activate && ruff format app tests
	cd apps/web && npm run format --if-present
