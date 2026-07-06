import enum
import uuid
from datetime import UTC, datetime

from geoalchemy2 import Geometry
from sqlalchemy import DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class IncidentSeverity(enum.StrEnum):
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"
    CRITICAL = "critical"


class IncidentStatus(enum.StrEnum):
    REPORTED = "reported"
    VERIFIED = "verified"
    RESPONDING = "responding"
    RESOLVED = "resolved"
    CLOSED = "closed"


class Incident(Base):
    __tablename__ = "incidents"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")

    hazard_type_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("hazard_types.id"), nullable=False, index=True
    )
    severity: Mapped[IncidentSeverity] = mapped_column(
        Enum(
            IncidentSeverity,
            name="incident_severity",
            values_callable=lambda o: [e.value for e in o],
        ),
        nullable=False,
        default=IncidentSeverity.MODERATE,
    )
    status: Mapped[IncidentStatus] = mapped_column(
        Enum(
            IncidentStatus, name="incident_status", values_callable=lambda o: [e.value for e in o]
        ),
        nullable=False,
        default=IncidentStatus.REPORTED,
        index=True,
    )

    location: Mapped[str] = mapped_column(
        Geometry(geometry_type="POINT", srid=4326, spatial_index=True), nullable=False
    )
    address: Mapped[str | None] = mapped_column(String(500), nullable=True)

    reporter_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )

    hazard_type: Mapped["HazardType"] = relationship(lazy="joined")  # noqa: F821
    events: Mapped[list["IncidentEvent"]] = relationship(  # noqa: F821
        back_populates="incident", cascade="all, delete-orphan", order_by="IncidentEvent.created_at"
    )
    attachments: Mapped[list["Attachment"]] = relationship(  # noqa: F821
        back_populates="incident", cascade="all, delete-orphan"
    )
