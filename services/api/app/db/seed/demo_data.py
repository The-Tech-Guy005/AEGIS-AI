"""Demo seed data for Phase 2 (Incident Core). Idempotent — safe to re-run."""

import asyncio

from app.db.seed.hazard_types import HAZARD_TYPES
from app.db.session import async_session_factory
from app.models.hazard_type import HazardType
from app.repositories.hazard_type_repo import HazardTypeRepository


async def seed_hazard_types() -> int:
    async with async_session_factory() as session:
        repo = HazardTypeRepository(session)
        created = 0

        for entry in HAZARD_TYPES:
            if await repo.get_by_code(entry["code"]) is None:
                session.add(
                    HazardType(
                        code=entry["code"],
                        name=entry["name"],
                        color=entry["color"],
                    )
                )
                created += 1

        await session.commit()
        return created


async def run() -> None:
    created = await seed_hazard_types()
    print(
        f"Seeded {created} new hazard type(s); "
        f"{len(HAZARD_TYPES) - created} already present."
    )


def main() -> None:
    asyncio.run(run())


if __name__ == "__main__":
    main()