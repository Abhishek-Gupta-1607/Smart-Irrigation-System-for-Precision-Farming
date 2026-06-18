from fastapi import APIRouter
from app.api.endpoints.api_router import router as main_router

api_router = APIRouter()
api_router.include_router(main_router, tags=["main"])
