from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.meeting import MeetingStatus

class MeetingBase(BaseModel):
    title: str
    description: Optional[str] = None

class MeetingCreate(MeetingBase):
    pass

class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

class Meeting(MeetingBase):
    id: int
    file_name: str
    file_size: Optional[int]
    duration: Optional[float]
    status: MeetingStatus
    transcription: Optional[str]
    summary: Optional[str]
    key_points: Optional[str]
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime]
    processed_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class MeetingList(BaseModel):
    meetings: List[Meeting]
    total: int
    page: int
    per_page: int