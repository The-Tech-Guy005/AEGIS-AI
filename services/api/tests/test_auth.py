from unittest.mock import patch

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_me_missing_token(client: AsyncClient) -> None:
    response = await client.get("/v1/auth/me")
    assert response.status_code == 401
    assert response.json()["detail"] == "Missing bearer token"


@pytest.mark.asyncio
async def test_get_me_invalid_token(client: AsyncClient) -> None:
    from app.core.exceptions import UnauthorizedError

    with patch(
        "app.core.security.verify_clerk_token",
        side_effect=UnauthorizedError("Invalid or expired Clerk token"),
    ):
        response = await client.get(
            "/v1/auth/me",
            headers={"Authorization": "Bearer invalid-token"},
        )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid or expired Clerk token"


@pytest.mark.asyncio
async def test_get_me_clerk_not_configured(client: AsyncClient) -> None:
    from app.core.exceptions import UnauthorizedError

    with patch(
        "app.core.security.verify_clerk_token",
        side_effect=UnauthorizedError("Clerk authentication is not configured"),
    ):
        response = await client.get(
            "/v1/auth/me",
            headers={"Authorization": "Bearer some-token"},
        )
    assert response.status_code == 401
    assert "Clerk authentication is not configured" in response.json()["detail"]
