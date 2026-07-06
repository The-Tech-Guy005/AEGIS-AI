from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.attachment import (
    AttachmentResponse,
    AttachmentUploadRequest,
    AttachmentUploadResponse,
)
from app.services.attachment_service import PRESIGNED_URL_TTL_SECONDS, AttachmentService

router = APIRouter(prefix="/incidents/{incident_id}/attachments", tags=["attachments"])


@router.post("", response_model=AttachmentUploadResponse, status_code=201)
async def request_attachment_upload(
    incident_id: UUID,
    payload: AttachmentUploadRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> AttachmentUploadResponse:
    service = AttachmentService(db)
    attachment, upload_url = await service.request_upload(incident_id, payload, current_user)
    return AttachmentUploadResponse(
        attachment_id=attachment.id,
        upload_url=upload_url,
        file_key=attachment.file_key,
        expires_in_seconds=PRESIGNED_URL_TTL_SECONDS,
    )


@router.get("", response_model=list[AttachmentResponse])
async def list_attachments(
    incident_id: UUID,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[AttachmentResponse]:
    service = AttachmentService(db)
    attachments = await service.list_for_incident(incident_id)
    responses = []
    for attachment in attachments:
        response = AttachmentResponse.model_validate(attachment)
        response.download_url = service.download_url_for(attachment)
        responses.append(response)
    return responses
