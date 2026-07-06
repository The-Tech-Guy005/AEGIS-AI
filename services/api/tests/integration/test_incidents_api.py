import uuid
from datetime import UTC, datetime
from unittest.mock import AsyncMock, patch

import pytest
from httpx import ASGITransport, AsyncClient

from app.core.exceptions import NotFoundError
from app.core.security import get_current_user
from app.main import app
from app.models.hazard_type import HazardType
from app.models.incident import Incident, IncidentSeverity, IncidentStatus
from app.models.user import User, UserRole
from app.repositories.incident_repo import IncidentRepository

HAZARD_TYPE_ID = uuid.uuid4()


def _fake_incident() -> Incident:
    incident = Incident(
        id=uuid.uuid4(),
        title="Grass fire on Route 9",
        description="Visible smoke, no injuries reported",
        hazard_type_id=HAZARD_TYPE_ID,
        severity=IncidentSeverity.HIGH,
        status=IncidentStatus.REPORTED,
        address="Route 9, near mile marker 4",
        reporter_id=uuid.uuid4(),
        location=IncidentRepository.make_point(34.05, -118.25),
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )
    incident.hazard_type = HazardType(
        id=HAZARD_TYPE_ID, code="WILDFIRE", name="Wildfire", color="#FF4500"
    )
    return incident


def _fake_user() -> User:
    return User(
        id=uuid.uuid4(),
        clerk_id="clerk_abc",
        email="citizen@example.com",
        full_name="Jamie Citizen",
        role=UserRole.CITIZEN,
    )


@pytest.fixture(autouse=True)
def override_auth():
    app.dependency_overrides[get_current_user] = _fake_user
    yield
    app.dependency_overrides.pop(get_current_user, None)


@pytest.mark.asyncio
async def test_get_incident_not_found(client: AsyncClient) -> None:
    with patch(
        "app.api.v1.incidents.IncidentService.get_incident",
        new_callable=AsyncMock,
        side_effect=NotFoundError("Incident", "missing"),
    ):
        response = await client.get(f"/v1/incidents/{uuid.uuid4()}")

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_create_incident_requires_auth() -> None:
    app.dependency_overrides.pop(get_current_user, None)
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post(
            "/v1/incidents",
            json={
                "title": "Unauthenticated report",
                "hazard_type_id": str(HAZARD_TYPE_ID),
                "latitude": 34.05,
                "longitude": -118.25,
            },
        )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_create_incident_validates_payload(client: AsyncClient) -> None:
    response = await client.post(
        "/v1/incidents",
        json={
            "title": "ab",
            "hazard_type_id": str(HAZARD_TYPE_ID),
            "latitude": 999,
            "longitude": 0,
        },
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_create_incident_success(client: AsyncClient) -> None:
    with patch(
        "app.api.v1.incidents.IncidentService.create_incident",
        new_callable=AsyncMock,
        return_value=_fake_incident(),
    ):
        response = await client.post(
            "/v1/incidents",
            json={
                "title": "Grass fire on Route 9",
                "hazard_type_id": str(HAZARD_TYPE_ID),
                "severity": "high",
                "latitude": 34.05,
                "longitude": -118.25,
                "address": "Route 9, near mile marker 4",
            },
        )

    assert response.status_code == 201
    body = response.json()
    assert body["title"] == "Grass fire on Route 9"
    assert body["severity"] == "high"
