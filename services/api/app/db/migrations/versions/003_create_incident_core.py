"""Create hazard_types, incidents, incident_events, attachments tables."""

from collections.abc import Sequence

import geoalchemy2
import sqlalchemy as sa
from alembic import op

revision: str = "003_create_incident_core"
down_revision: str | None = "002_create_users"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

incident_severity = sa.Enum("low", "moderate", "high", "critical", name="incident_severity")
incident_status = sa.Enum(
    "reported", "verified", "responding", "resolved", "closed", name="incident_status"
)
incident_event_type = sa.Enum(
    "created", "status_changed", "severity_changed", "note", "attachment_added",
    name="incident_event_type",
)


def upgrade() -> None:
    incident_severity.create(op.get_bind(), checkfirst=True)
    incident_status.create(op.get_bind(), checkfirst=True)
    incident_event_type.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "hazard_types",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("code", sa.String(length=50), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("color", sa.String(length=7), nullable=False, server_default="#808080"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_hazard_types_code", "hazard_types", ["code"], unique=True)

    op.create_table(
        "incidents",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False, server_default=""),
        sa.Column("hazard_type_id", sa.UUID(), nullable=False),
        sa.Column("severity", incident_severity, nullable=False, server_default="moderate"),
        sa.Column("status", incident_status, nullable=False, server_default="reported"),
        sa.Column(
            "location",
            geoalchemy2.Geometry(geometry_type="POINT", srid=4326, spatial_index=False),
            nullable=False,
        ),
        sa.Column("address", sa.String(length=500), nullable=True),
        sa.Column("reporter_id", sa.UUID(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["hazard_type_id"], ["hazard_types.id"]),
        sa.ForeignKeyConstraint(["reporter_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_incidents_hazard_type_id", "incidents", ["hazard_type_id"])
    op.create_index("ix_incidents_status", "incidents", ["status"])
    op.execute(
        "CREATE INDEX ix_incidents_location ON incidents USING GIST (location)"
    )

    op.create_table(
        "incident_events",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("incident_id", sa.UUID(), nullable=False),
        sa.Column("event_type", incident_event_type, nullable=False),
        sa.Column("note", sa.Text(), nullable=True),
        sa.Column("actor_id", sa.UUID(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["incident_id"], ["incidents.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["actor_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_incident_events_incident_id", "incident_events", ["incident_id"])

    op.create_table(
        "attachments",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("incident_id", sa.UUID(), nullable=False),
        sa.Column("file_key", sa.String(length=1024), nullable=False),
        sa.Column("file_name", sa.String(length=255), nullable=False),
        sa.Column("content_type", sa.String(length=100), nullable=False),
        sa.Column("size_bytes", sa.BigInteger(), nullable=False, server_default="0"),
        sa.Column("uploaded_by", sa.UUID(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["incident_id"], ["incidents.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["uploaded_by"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_attachments_incident_id", "attachments", ["incident_id"])


def downgrade() -> None:
    op.drop_table("attachments")
    op.drop_table("incident_events")
    op.execute("DROP INDEX IF EXISTS ix_incidents_location")
    op.drop_index("ix_incidents_status", table_name="incidents")
    op.drop_index("ix_incidents_hazard_type_id", table_name="incidents")
    op.drop_table("incidents")
    op.drop_index("ix_hazard_types_code", table_name="hazard_types")
    op.drop_table("hazard_types")

    incident_event_type.drop(op.get_bind(), checkfirst=True)
    incident_status.drop(op.get_bind(), checkfirst=True)
    incident_severity.drop(op.get_bind(), checkfirst=True)
