from fastapi import APIRouter

from app.api.v1 import attachments, auth, hazard_types, health, incidents

api_router = APIRouter(prefix="/v1")

api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(hazard_types.router)
api_router.include_router(incidents.router)
api_router.include_router(attachments.router)
