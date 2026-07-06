from uuid import UUID

from geoalchemy2 import Geography
from geoalchemy2.functions import ST_DWithin, ST_MakePoint, ST_SetSRID
from geoalchemy2.shape import from_shape
from shapely.geometry import Point
from sqlalchemy import cast, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.incident import Incident, IncidentStatus


class IncidentRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, incident: Incident) -> Incident:
        self.session.add(incident)
        await self.session.flush()
        await self.session.refresh(incident, attribute_names=["hazard_type"])
        return incident

    async def get_by_id(self, incident_id: UUID) -> Incident | None:
        result = await self.session.execute(select(Incident).where(Incident.id == incident_id))
        return result.scalar_one_or_none()

    async def update(self, incident: Incident) -> Incident:
        await self.session.flush()
        await self.session.refresh(incident, attribute_names=["hazard_type"])
        return incident

    async def delete(self, incident: Incident) -> None:
        await self.session.delete(incident)
        await self.session.flush()

    async def list_paginated(
        self,
        *,
        limit: int = 20,
        offset: int = 0,
        status: IncidentStatus | None = None,
        hazard_type_id: UUID | None = None,
        near_lat: float | None = None,
        near_lng: float | None = None,
        radius_meters: float | None = None,
    ) -> tuple[list[Incident], int]:
        query = select(Incident)
        count_query = select(func.count()).select_from(Incident)

        if status is not None:
            query = query.where(Incident.status == status)
            count_query = count_query.where(Incident.status == status)

        if hazard_type_id is not None:
            query = query.where(Incident.hazard_type_id == hazard_type_id)
            count_query = count_query.where(Incident.hazard_type_id == hazard_type_id)

        if near_lat is not None and near_lng is not None and radius_meters is not None:
            origin = ST_SetSRID(ST_MakePoint(near_lng, near_lat), 4326)
            within = ST_DWithin(
                cast(Incident.location, Geography),
                cast(origin, Geography),
                radius_meters,
            )
            query = query.where(within)
            count_query = count_query.where(within)

        query = query.order_by(Incident.created_at.desc()).limit(limit).offset(offset)

        total = (await self.session.execute(count_query)).scalar_one()
        rows = (await self.session.execute(query)).scalars().all()
        return list(rows), total

    @staticmethod
    def make_point(latitude: float, longitude: float) -> object:
        return from_shape(Point(longitude, latitude), srid=4326)
