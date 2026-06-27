from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User, UserRole
from app.repositories.user_repo import UserRepository
from app.schemas.auth import ClerkTokenClaims


class AuthService:
    def __init__(self, session: AsyncSession) -> None:
        self.users = UserRepository(session)

    async def get_or_create_user(self, claims: ClerkTokenClaims) -> User:
        existing = await self.users.get_by_clerk_id(claims.sub)
        if existing:
            return await self._sync_profile(existing, claims)

        email = claims.email or f"{claims.sub}@users.clerk"
        full_name = claims.name or claims.given_name or email.split("@")[0]

        user = User(
            clerk_id=claims.sub,
            email=email,
            full_name=full_name,
            avatar_url=claims.picture,
            role=UserRole.CITIZEN,
        )
        return await self.users.create(user)

    async def _sync_profile(self, user: User, claims: ClerkTokenClaims) -> User:
        changed = False

        if claims.email and user.email != claims.email:
            user.email = claims.email
            changed = True

        if claims.name and user.full_name != claims.name:
            user.full_name = claims.name
            changed = True

        if claims.picture and user.avatar_url != claims.picture:
            user.avatar_url = claims.picture
            changed = True

        if changed:
            return await self.users.update(user)

        return user
