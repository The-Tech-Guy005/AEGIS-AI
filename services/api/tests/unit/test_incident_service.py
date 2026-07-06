import uuid
from unittest.mock import AsyncMock, MagicMock

import pytest

from app.core.exceptions import NotFoundError
from app.models.incident import Incident, IncidentSeverity, IncidentStatus
from app.models.user import User, UserRole
from app.schemas.incident import IncidentCreate, IncidentUpdate
from app.services.incident_service import IncidentService


def _make_user() -> User:
    return User(
        id=uuid.uuid4(),
        clerk_id="clerk_123",
        email="responder@example.com",
        full_name="Test Responder",
        role=UserRole.RESPONDER,
    )


@pytest.fixture
def service() -> IncidentService:
    svc = IncidentService.__new__(IncidentService)  # bypass __init__'s DB session wiring
    svc.session = AsyncMock()
    svc.incidents = AsyncMock()
    svc.events = AsyncMock()
    svc.hazard_types = AsyncMock()
    return svc


@pytest.mark.asyncio
async def test_create_incident_raises_when_hazard_type_missing(service: IncidentService) -> None:
    service.hazard_types.get_by_id.return_value = None
    payload = IncidentCreate(
        title="Brush fire near ridge",
        hazard_type_id=uuid.uuid4(),
        latitude=34.05,
        longitude=-118.25,
    )

    with pytest.raises(NotFoundError):
        await service.create_incident(payload, _make_user())


@pytest.mark.asyncio
async def test_create_incident_logs_created_event(service: IncidentService) -> None:
    hazard_type = MagicMock(id=uuid.uuid4())
    service.hazard_types.get_by_id.return_value = hazard_type

    reporter = _make_user()
    created_incident = Incident(
        id=uuid.uuid4(),
        title="Brush fire near ridge",
        hazard_type_id=hazard_type.id,
        severity=IncidentSeverity.MODERATE,
        status=IncidentStatus.REPORTED,
        reporter_id=reporter.id,
    )
    service.incidents.create.return_value = created_incident

    payload = IncidentCreate(
        title="Brush fire near ridge",
        hazard_type_id=hazard_type.id,
        latitude=34.05,
        longitude=-118.25,
    )

    result = await service.create_incident(payload, reporter)

    assert result is created_incident
    service.incidents.create.assert_awaited_once()
    service.events.create.assert_awaited_once()


@pytest.mark.asyncio
async def test_update_incident_logs_status_change_event(service: IncidentService) -> None:
    actor = _make_user()
    existing = Incident(
        id=uuid.uuid4(),
        title="Flooded intersection",
        hazard_type_id=uuid.uuid4(),
        severity=IncidentSeverity.LOW,
        status=IncidentStatus.REPORTED,
    )
    service.incidents.get_by_id.return_value = existing
    service.incidents.update.return_value = existing

    payload = IncidentUpdate(status=IncidentStatus.VERIFIED)
    result = await service.update_incident(existing.id, payload, actor)

    assert result.status == IncidentStatus.VERIFIED
    service.events.create.assert_awaited_once()


@pytest.mark.asyncio
async def test_get_incident_not_found(service: IncidentService) -> None:
    service.incidents.get_by_id.return_value = None

    with pytest.raises(NotFoundError):
        await service.get_incident(uuid.uuid4())
