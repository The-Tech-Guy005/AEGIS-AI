from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.hazard_type import HazardType


class HazardTypeRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_all(self) -> list[HazardType]:
        result = await self.session.execute(select(HazardType).order_by(HazardType.name))
        return list(result.scalars().all())

    async def get_by_id(self, hazard_type_id: UUID) -> HazardType | None:
        result = await self.session.execute(
            select(HazardType).where(HazardType.id == hazard_type_id)
        )
        return result.scalar_one_or_none()

    async def get_by_code(self, code: str) -> HazardType | None:
        result = await self.session.execute(select(HazardType).where(HazardType.code == code))
        return result.scalar_one_or_none()
