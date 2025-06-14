from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.user import User
from app.models.meeting import Meeting, MeetingStatus
from app.schemas.meeting import Meeting as MeetingSchema, MeetingList, MeetingUpdate

router = APIRouter()

@router.get("/", response_model=MeetingList)
def get_meetings(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    status: Optional[MeetingStatus] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's meetings with pagination"""
    query = db.query(Meeting).filter(Meeting.owner_id == current_user.id)
    
    if status:
        query = query.filter(Meeting.status == status)
    
    total = query.count()
    meetings = query.offset((page - 1) * per_page).limit(per_page).all()
    
    return MeetingList(
        meetings=meetings,
        total=total,
        page=page,
        per_page=per_page
    )

@router.get("/{meeting_id}", response_model=MeetingSchema)
def get_meeting(
    meeting_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific meeting details"""
    meeting = db.query(Meeting).filter(
        Meeting.id == meeting_id,
        Meeting.owner_id == current_user.id
    ).first()
    
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    return meeting

@router.put("/{meeting_id}", response_model=MeetingSchema)
def update_meeting(
    meeting_id: int,
    meeting_data: MeetingUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update meeting details"""
    meeting = db.query(Meeting).filter(
        Meeting.id == meeting_id,
        Meeting.owner_id == current_user.id
    ).first()
    
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    # Update fields
    if meeting_data.title is not None:
        meeting.title = meeting_data.title
    if meeting_data.description is not None:
        meeting.description = meeting_data.description
    
    db.commit()
    db.refresh(meeting)
    return meeting

@router.delete("/{meeting_id}")
def delete_meeting(
    meeting_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete meeting"""
    meeting = db.query(Meeting).filter(
        Meeting.id == meeting_id,
        Meeting.owner_id == current_user.id
    ).first()
    
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    # Delete associated file
    import os
    if os.path.exists(meeting.file_path):
        os.remove(meeting.file_path)
    
    db.delete(meeting)
    db.commit()
    
    return {"message": "Meeting deleted successfully"}

@router.get("/{meeting_id}/status")
def get_meeting_status(
    meeting_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get meeting processing status"""
    meeting = db.query(Meeting).filter(
        Meeting.id == meeting_id,
        Meeting.owner_id == current_user.id
    ).first()
    
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    # Get task progress if processing
    progress = None
    if meeting.status == MeetingStatus.PROCESSING:
        # You can implement task progress tracking here
        progress = {"current_step": "Processing with AI", "percentage": 50}
    
    return {
        "meeting_id": meeting.id,
        "status": meeting.status,
        "progress": progress,
        "created_at": meeting.created_at,
        "processed_at": meeting.processed_at
    }
