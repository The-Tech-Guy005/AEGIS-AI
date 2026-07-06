from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class AttachmentUploadRequest(BaseModel):
    """Client asks for a presigned URL before uploading directly to MinIO/S3."""

    file_name: str = Field(min_length=1, max_length=255)
    content_type: str = Field(min_length=1, max_length=100)
    size_bytes: int = Field(gt=0, le=25_000_000)  # 25 MB cap


class AttachmentUploadResponse(BaseModel):
    attachment_id: UUID
    upload_url: str
    file_key: str
    expires_in_seconds: int


class AttachmentResponse(BaseModel):
    id: UUID
    file_name: str
    content_type: str
    size_bytes: int
    uploaded_by: UUID | None
    created_at: datetime
    download_url: str | None = None

    model_config = {"from_attributes": True}
