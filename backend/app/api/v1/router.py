from fastapi import APIRouter
from app.api.v1 import auth, meetings, upload, tasks

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(upload.router, prefix="/upload", tags=["upload"])
api_router.include_router(meetings.router, prefix="/meetings", tags=["meetings"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])