from fastapi import APIRouter

from backend.api.endpoints import auth

api_router = APIRouter()

api_router.include_router(
    auth.router,
    tags=["Authentication"]
)
