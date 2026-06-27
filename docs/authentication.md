# Authentication (Clerk)

AEGIS AI uses [Clerk](https://clerk.com) for frontend authentication and verifies Clerk session JWTs on the FastAPI backend.

## Flow

1. User signs in via Clerk UI on `/login` or `/register`
2. Clerk middleware protects `/dashboard` and `/map`
3. Frontend sends `Authorization: Bearer <clerk_jwt>` to `/v1/auth/me`
4. Backend verifies JWT against Clerk JWKS and creates/syncs user in Postgres

## Environment Variables

| Variable | Location | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `apps/web/.env.local` | Clerk frontend SDK |
| `CLERK_SECRET_KEY` | `apps/web/.env.local` | Clerk server SDK |
| `CLERK_JWKS_URL` | root `.env` | Backend JWT verification |

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/v1/auth/me` | Bearer JWT | Get or create user profile |
