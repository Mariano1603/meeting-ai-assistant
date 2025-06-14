from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1.router import api_router

# Create Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Meeting Whisperer API",
    description="AI-powered meeting transcription and summarization API",
    version="1.0.0",
    # openapi_url=f"{settings.API_V1_STR}/openapi.json"
)


# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file for uploads
if not os.path.exists("uploads"):
    os.makedirs("uploads")

# Mount static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# Include API router
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {"message": "Meeting Whisperer API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)