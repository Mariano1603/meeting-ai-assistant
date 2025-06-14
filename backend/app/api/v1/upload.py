from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import os
import uuid
from typing import Optional

from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.user import User
from app.models.meeting import Meeting, MeetingStatus
from app.workers.ai_tasks import process_meeting_task

router = APIRouter()

ALLOWED_EXTENSIONS = {'.mp3', '.mp4', '.wav', '.m4a', '.ogg', '.webm'}
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB

@router.post("/meeting")
async def upload_meeting(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate file
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"File type {file_ext} not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Read file content
    file_content = await file.read()
    file_size = len(file_content)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400, 
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE // (1024*1024)}MB"
        )
    
    # Generate unique filename
    file_id = str(uuid.uuid4())
    filename = f"{file_id}{file_ext}"
    file_path = os.path.join("uploads", filename)
    
    # Ensure upload directory exists
    os.makedirs("uploads", exist_ok=True)
    
    # Save file
    with open(file_path, "wb") as f:
        f.write(file_content)
    
    # Create meeting record
    meeting = Meeting(
        title=title,
        description=description,
        file_path=file_path,
        file_name=file.filename,
        file_size=file_size,
        status=MeetingStatus.UPLOADED,
        owner_id=current_user.id
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    
    # Queue AI processing task
    process_meeting_task.delay(meeting.id)
    
    return JSONResponse(
        status_code=201,
        content={
            "message": "Meeting uploaded successfully",
            "meeting_id": meeting.id,
            "status": "uploaded",
            "processing": "AI processing will begin shortly"
        }
    )