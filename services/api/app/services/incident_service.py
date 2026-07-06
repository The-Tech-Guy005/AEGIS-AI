from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.models.incident import Incident, IncidentStatus
from app.models.incident_event import IncidentEvent, IncidentEventType
from app.models.user import User
from app.repositories.hazard_type_repo import HazardTypeRepository
from app.repositories.incident_event_repo import IncidentEventRepository
from app.repositories.incident_repo import IncidentRepository
from app.schemas.incident import IncidentCreate, IncidentUpdate


class IncidentService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.incidents = IncidentRepository(session)
        self.events = IncidentEventRepository(session)
        self.hazard_types = HazardTypeRepository(session)

    async def create_incident(self, payload: IncidentCreate, reporter: User) -> Incident:
        hazard_type = await self.hazard_types.get_by_id(payload.hazard_type_id)
        if hazard_type is None:
            raise NotFoundError("HazardType", str(payload.hazard_type_id))

        incident = Incident(
            title=payload.title,
            description=payload.description,
            hazard_type_id=payload.hazard_type_id,
            severity=payload.severity,
            status=IncidentStatus.REPORTED,
            location=IncidentRepository.make_point(payload.latitude, payload.longitude),
            address=payload.address,
            reporter_id=reporter.id,
        )
        incident = await self.incidents.create(incident)

        await self.events.create(
            IncidentEvent(
                incident_id=incident.id,
                event_type=IncidentEventType.CREATED,
                note=f"Incident reported: {incident.title}",
                actor_id=reporter.id,
            )
        )
        return incident

    async def get_incident(self, incident_id: UUID) -> Incident:
        incident = await self.incidents.get_by_id(incident_id)
        if incident is None:
            raise NotFoundError("Incident", str(incident_id))
        return incident

    async def update_incident(
        self, incident_id: UUID, payload: IncidentUpdate, actor: User
    ) -> Incident:
        incident = await self.get_incident(incident_id)

        if payload.title is not None:
            incident.title = payload.title
        if payload.description is not None:
            incident.description = payload.description
        if payload.address is not None:
            incident.address = payload.address

        if payload.severity is not None and payload.severity != incident.severity:
            incident.severity = payload.severity
            await self.events.create(
                IncidentEvent(
                    incident_id=incident.id,
                    event_type=IncidentEventType.SEVERITY_CHANGED,
                    note=f"Severity changed to {payload.severity.value}",
                    actor_id=actor.id,
                )
            )

        if payload.status is not None and payload.status != incident.status:
            incident.status = payload.status
            await self.events.create(
                IncidentEvent(
                    incident_id=incident.id,
                    event_type=IncidentEventType.STATUS_CHANGED,
                    note=f"Status changed to {payload.status.value}",
                    actor_id=actor.id,
                )
            )

        return await self.incidents.update(incident)

    async def list_incidents(
        self,
        *,
        limit: int,
        offset: int,
        status: IncidentStatus | None,
        hazard_type_id: UUID | None,
        near_lat: float | None,
        near_lng: float | None,
        radius_meters: float | None,
    ) -> tuple[list[Incident], int]:
        return await self.incidents.list_paginated(
            limit=limit,
            offset=offset,
            status=status,
            hazard_type_id=hazard_type_id,
            near_lat=near_lat,
            near_lng=near_lng,
            radius_meters=radius_meters,
        )

    async def get_timeline(self, incident_id: UUID) -> list[IncidentEvent]:
        await self.get_incident(incident_id)  # 404 if missing
        return await self.events.list_by_incident(incident_id)
