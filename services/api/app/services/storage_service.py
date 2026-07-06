import uuid
from functools import lru_cache

import boto3
from botocore.client import Config as BotoConfig

from app.config import settings

PRESIGNED_URL_TTL_SECONDS = 900  # 15 minutes


@lru_cache
def _get_s3_client():
    return boto3.client(
        "s3",
        endpoint_url=settings.s3_endpoint,
        aws_access_key_id=settings.s3_access_key,
        aws_secret_access_key=settings.s3_secret_key,
        region_name=settings.s3_region,
        config=BotoConfig(signature_version="s3v4"),
        use_ssl=settings.s3_use_ssl,
    )


class StorageService:
    """Thin wrapper around MinIO/S3 for incident attachments."""

    def __init__(self) -> None:
        self.client = _get_s3_client()
        self.bucket = settings.s3_bucket

    def build_file_key(self, incident_id: uuid.UUID, file_name: str) -> str:
        safe_name = file_name.replace("/", "_")
        return f"incidents/{incident_id}/{uuid.uuid4()}_{safe_name}"

    def ensure_bucket(self) -> None:
        existing = self.client.list_buckets().get("Buckets", [])
        if not any(b["Name"] == self.bucket for b in existing):
            self.client.create_bucket(Bucket=self.bucket)

    def presigned_upload_url(self, file_key: str, content_type: str) -> str:
        return self.client.generate_presigned_url(
            "put_object",
            Params={"Bucket": self.bucket, "Key": file_key, "ContentType": content_type},
            ExpiresIn=PRESIGNED_URL_TTL_SECONDS,
        )

    def presigned_download_url(self, file_key: str) -> str:
        return self.client.generate_presigned_url(
            "get_object",
            Params={"Bucket": self.bucket, "Key": file_key},
            ExpiresIn=PRESIGNED_URL_TTL_SECONDS,
        )
