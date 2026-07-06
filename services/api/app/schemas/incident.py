from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID

from geoalchemy2.shape import to_shape
from pydantic import BaseModel, Field, computed_field

from app.models.incident import IncidentSeverity, IncidentStatus
from app.models.incident_event import IncidentEventType

if TYPE_CHECKING:
    from app.models.incident import Incident


class HazardTypeResponse(BaseModel):
    id: UUID
    code: str
    name: str
    color: str

    model_config = {"from_attributes": True}


class IncidentCreate(BaseModel):
    title: str = Field(min_length=3, max_length=255)
    description: str = Field(default="", max_length=5000)
    hazard_type_id: UUID
    severity: IncidentSeverity = IncidentSeverity.MODERATE
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    address: str | None = Field(default=None, max_length=500)


class IncidentUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=255)
    description: str | None = Field(default=None, max_length=5000)
    severity: IncidentSeverity | None = None
    status: IncidentStatus | None = None
    address: str | None = Field(default=None, max_length=500)


class IncidentResponse(BaseModel):
    id: UUID
    title: str
    description: str
    severity: IncidentSeverity
    status: IncidentStatus
    address: str | None
    hazard_type: HazardTypeResponse
    reporter_id: UUID | None
    latitude: float
    longitude: float
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

    @classmethod
    def from_model(cls, incident: "Incident") -> "IncidentResponse":
        point = to_shape(incident.location)
        return cls(
            id=incident.id,
            title=incident.title,
            description=incident.description,
            severity=incident.severity,
            status=incident.status,
            address=incident.address,
            hazard_type=HazardTypeResponse.model_validate(incident.hazard_type),
            reporter_id=incident.reporter_id,
            latitude=point.y,
            longitude=point.x,
            created_at=incident.created_at,
            updated_at=incident.updated_at,
        )


class IncidentListItem(BaseModel):
    """Lighter-weight shape for list views / map pins."""

    id: UUID
    title: str
    severity: IncidentSeverity
    status: IncidentStatus
    hazard_type: HazardTypeResponse
    latitude: float
    longitude: float
    created_at: datetime

    model_config = {"from_attributes": True}

    @classmethod
    def from_model(cls, incident: "Incident") -> "IncidentListItem":
        point = to_shape(incident.location)
        return cls(
            id=incident.id,
            title=incident.title,
            severity=incident.severity,
            status=incident.status,
            hazard_type=HazardTypeResponse.model_validate(incident.hazard_type),
            latitude=point.y,
            longitude=point.x,
            created_at=incident.created_at,
        )


class IncidentEventResponse(BaseModel):
    id: UUID
    event_type: IncidentEventType
    note: str | None
    actor_id: UUID | None
    created_at: datetime

    model_config = {"from_attributes": True}


class PaginatedIncidents(BaseModel):
    items: list[IncidentListItem]
    total: int
    limit: int
    offset: int

    @computed_field
    @property
    def has_more(self) -> bool:
        return self.offset + len(self.items) < self.total
