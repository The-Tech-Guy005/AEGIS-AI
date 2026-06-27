from functools import lru_cache

import jwt
from jwt import PyJWKClient

from app.config import settings
from app.core.exceptions import UnauthorizedError
from app.schemas.auth import ClerkTokenClaims


@lru_cache
def _get_jwks_client() -> PyJWKClient:
    if not settings.clerk_jwks_url:
        raise UnauthorizedError("Clerk JWKS URL is not configured")
    return PyJWKClient(settings.clerk_jwks_url)


def verify_clerk_token(token: str) -> ClerkTokenClaims:
    if not settings.clerk_jwks_url:
        raise UnauthorizedError("Clerk authentication is not configured")

    try:
        signing_key = _get_jwks_client().get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            options={"verify_aud": False},
        )
    except jwt.PyJWTError as exc:
        raise UnauthorizedError("Invalid or expired Clerk token") from exc

    sub = payload.get("sub")
    if not sub:
        raise UnauthorizedError("Clerk token missing subject claim")

    full_name = payload.get("name")
    if not full_name:
        given = payload.get("given_name", "")
        family = payload.get("family_name", "")
        full_name = f"{given} {family}".strip() or None

    return ClerkTokenClaims(
        sub=sub,
        email=payload.get("email"),
        name=full_name,
        given_name=payload.get("given_name"),
        family_name=payload.get("family_name"),
        picture=payload.get("picture"),
    )
