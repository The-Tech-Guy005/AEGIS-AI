import enum
import uuid
from datetime import UTC, datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class IncidentEventType(str, enum.Enum):
    CREATED = "created"
    STATUS_CHANGED = "status_changed"
    SEVERITY_CHANGED = "severity_changed"
    NOTE = "note"
    ATTACHMENT_ADDED = "attachment_added"


class IncidentEvent(Base):
    __tablename__ = "incident_events"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    incident_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False, index=True
    )
    event_type: Mapped[IncidentEventType] = mapped_column(
        Enum(IncidentEventType, name="incident_event_type", values_callable=lambda o: [e.value for e in o]),
        nullable=False,
    )
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    actor_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    incident: Mapped["Incident"] = relationship(back_populates="events")  # noqa: F821
