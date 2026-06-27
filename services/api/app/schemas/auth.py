from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

from app.models.user import UserRole


class UserProfileResponse(BaseModel):
    id: UUID
    clerk_id: str
    email: EmailStr
    full_name: str
    role: UserRole
    avatar_url: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ClerkTokenClaims(BaseModel):
    sub: str = Field(description="Clerk user ID")
    email: str | None = None
    name: str | None = None
    given_name: str | None = None
    family_name: str | None = None
    picture: str | None = None
