from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.models.attachment import Attachment
from app.models.incident_event import IncidentEvent, IncidentEventType
from app.models.user import User
from app.repositories.attachment_repo import AttachmentRepository
from app.repositories.incident_event_repo import IncidentEventRepository
from app.repositories.incident_repo import IncidentRepository
from app.schemas.attachment import AttachmentUploadRequest
from app.services.storage_service import PRESIGNED_URL_TTL_SECONDS, StorageService


class AttachmentService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.attachments = AttachmentRepository(session)
        self.incidents = IncidentRepository(session)
        self.events = IncidentEventRepository(session)
        self.storage = StorageService()

    async def request_upload(
        self, incident_id: UUID, payload: AttachmentUploadRequest, uploader: User
    ) -> tuple[Attachment, str]:
        incident = await self.incidents.get_by_id(incident_id)
        if incident is None:
            raise NotFoundError("Incident", str(incident_id))

        file_key = self.storage.build_file_key(incident_id, payload.file_name)

        attachment = await self.attachments.create(
            Attachment(
                incident_id=incident_id,
                file_key=file_key,
                file_name=payload.file_name,
                content_type=payload.content_type,
                size_bytes=payload.size_bytes,
                uploaded_by=uploader.id,
            )
        )

        await self.events.create(
            IncidentEvent(
                incident_id=incident_id,
                event_type=IncidentEventType.ATTACHMENT_ADDED,
                note=f"Attachment added: {payload.file_name}",
                actor_id=uploader.id,
            )
        )

        upload_url = self.storage.presigned_upload_url(file_key, payload.content_type)
        return attachment, upload_url

    async def list_for_incident(self, incident_id: UUID) -> list[Attachment]:
        incident = await self.incidents.get_by_id(incident_id)
        if incident is None:
            raise NotFoundError("Incident", str(incident_id))
        return await self.attachments.list_by_incident(incident_id)

    def download_url_for(self, attachment: Attachment) -> str:
        return self.storage.presigned_download_url(attachment.file_key)


__all__ = ["AttachmentService", "PRESIGNED_URL_TTL_SECONDS"]
