from typing import Annotated

from fastapi import APIRouter, Depends

from app.core.security import get_current_user
from app.models.user import User
from app.schemas.auth import UserProfileResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/me", response_model=UserProfileResponse)
async def get_me(current_user: Annotated[User, Depends(get_current_user)]) -> User:
    return current_user
