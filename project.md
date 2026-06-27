# AEGIS AI

Adaptive Emergency Geospatial Intelligence System

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS 4, **Clerk Auth** |
| Backend | FastAPI, Python 3.12+ |
| Database | PostgreSQL 16 + PostGIS, Neo4j 5 |
| Cache/Queue | Redis 7 |
| AI | Google Gemini 2.0 Flash |
| Maps | Mapbox (Phase 3) |
| Storage | MinIO (S3-compatible) |

## Current Status: Phase 1 Complete (Clerk Auth)

- Clerk sign-in / sign-up on `/login` and `/register`
- Protected routes: `/dashboard`, `/map`
- Backend `/v1/auth/me` with Clerk JWT verification
- User sync to PostgreSQL on first API call

## Quick Start

```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local

# Add your Clerk keys from https://dashboard.clerk.com to both files
# Set CLERK_JWKS_URL in .env (Backend → API Keys → JWKS URL)

make up
make setup
make migrate
make dev-api     # http://localhost:8000
make dev-web     # http://localhost:3000
```

## Clerk Setup

1. Create a free app at [clerk.com](https://dashboard.clerk.com)
2. Copy **Publishable Key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in `apps/web/.env.local`
3. Copy **Secret Key** → `CLERK_SECRET_KEY` in `apps/web/.env.local`
4. Copy **JWKS URL** → `CLERK_JWKS_URL` in root `.env` (for backend token verification)

## Next: Phase 2 — Incident Core

Incident CRUD, hazard types, timeline, attachments.

## Rules

- Production-ready code only — no placeholders
- Clean architecture, domain-driven modules
- Ask before deleting anything
- Explain every file
