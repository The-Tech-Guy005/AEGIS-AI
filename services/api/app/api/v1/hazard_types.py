from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.repositories.hazard_type_repo import HazardTypeRepository
from app.schemas.incident import HazardTypeResponse

router = APIRouter(prefix="/hazard-types", tags=["hazard-types"])


@router.get("", response_model=list[HazardTypeResponse])
async def list_hazard_types(db: Annotated[AsyncSession, Depends(get_db)]) -> list[HazardTypeResponse]:
    repo = HazardTypeRepository(db)
    hazard_types = await repo.list_all()
    return [HazardTypeResponse.model_validate(h) for h in hazard_types]
