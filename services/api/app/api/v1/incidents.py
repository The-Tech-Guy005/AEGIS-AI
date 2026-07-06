from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.incident import IncidentStatus
from app.models.user import User
from app.schemas.incident import (
    IncidentCreate,
    IncidentEventResponse,
    IncidentListItem,
    IncidentResponse,
    IncidentUpdate,
    PaginatedIncidents,
)
from app.services.incident_service import IncidentService

router = APIRouter(prefix="/incidents", tags=["incidents"])


@router.post("", response_model=IncidentResponse, status_code=201)
async def create_incident(
    payload: IncidentCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> IncidentResponse:
    service = IncidentService(db)
    incident = await service.create_incident(payload, current_user)
    return IncidentResponse.from_model(incident)


@router.get("", response_model=PaginatedIncidents)
async def list_incidents(
    db: Annotated[AsyncSession, Depends(get_db)],
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    offset: Annotated[int, Query(ge=0)] = 0,
    status: IncidentStatus | None = None,
    hazard_type_id: UUID | None = None,
    near_lat: Annotated[float | None, Query(ge=-90, le=90)] = None,
    near_lng: Annotated[float | None, Query(ge=-180, le=180)] = None,
    radius_meters: Annotated[float | None, Query(gt=0, le=200_000)] = None,
) -> PaginatedIncidents:
    service = IncidentService(db)
    incidents, total = await service.list_incidents(
        limit=limit,
        offset=offset,
        status=status,
        hazard_type_id=hazard_type_id,
        near_lat=near_lat,
        near_lng=near_lng,
        radius_meters=radius_meters,
    )
    return PaginatedIncidents(
        items=[IncidentListItem.from_model(i) for i in incidents],
        total=total,
        limit=limit,
        offset=offset,
    )


@router.get("/{incident_id}", response_model=IncidentResponse)
async def get_incident(
    incident_id: UUID,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> IncidentResponse:
    service = IncidentService(db)
    incident = await service.get_incident(incident_id)
    return IncidentResponse.from_model(incident)


@router.patch("/{incident_id}", response_model=IncidentResponse)
async def update_incident(
    incident_id: UUID,
    payload: IncidentUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> IncidentResponse:
    service = IncidentService(db)
    incident = await service.update_incident(incident_id, payload, current_user)
    return IncidentResponse.from_model(incident)


@router.get("/{incident_id}/timeline", response_model=list[IncidentEventResponse])
async def get_incident_timeline(
    incident_id: UUID,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[IncidentEventResponse]:
    service = IncidentService(db)
    events = await service.get_timeline(incident_id)
    return [IncidentEventResponse.model_validate(e) for e in events]
