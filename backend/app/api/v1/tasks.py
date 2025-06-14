from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.user import User
from app.models.task import Task, TaskStatus
from app.models.meeting import Meeting
from app.schemas.task import Task as TaskSchema, TaskUpdate, TaskCreate

router = APIRouter()

@router.get("/", response_model=List[TaskSchema])
def get_user_tasks(
    status: TaskStatus = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all tasks assigned to current user"""
    query = db.query(Task).filter(Task.assignee_id == current_user.id)
    
    if status:
        query = query.filter(Task.status == status)
    
    tasks = query.order_by(Task.created_at.desc()).all()
    return tasks

@router.get("/meeting/{meeting_id}", response_model=List[TaskSchema])
def get_meeting_tasks(
    meeting_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all tasks from a specific meeting"""
    # Verify user owns the meeting
    meeting = db.query(Meeting).filter(
        Meeting.id == meeting_id,
        Meeting.owner_id == current_user.id
    ).first()
    
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    tasks = db.query(Task).filter(Task.meeting_id == meeting_id).all()
    return tasks

@router.post("/", response_model=TaskSchema)
def create_task(
    task_data: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new task"""
    # Verify user owns the meeting
    meeting = db.query(Meeting).filter(
        Meeting.id == task_data.meeting_id,
        Meeting.owner_id == current_user.id
    ).first()
    
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    task = Task(**task_data.dict())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.put("/{task_id}", response_model=TaskSchema)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update task details"""
    task = db.query(Task).filter(Task.id == task_id).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Check if user can update this task (owner of meeting or assignee)
    meeting = db.query(Meeting).filter(Meeting.id == task.meeting_id).first()
    if meeting.owner_id != current_user.id and task.assignee_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this task")
    
    # Update fields
    update_data = task_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)
    
    # Set completion timestamp
    if task_data.status == TaskStatus.COMPLETED and not task.completed_at:
        from datetime import datetime
        task.completed_at = datetime.utcnow()
    
    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete task"""
    task = db.query(Task).filter(Task.id == task_id).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Check if user can delete this task (owner of meeting only)
    meeting = db.query(Meeting).filter(Meeting.id == task.meeting_id).first()
    if meeting.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this task")
    
    db.delete(task)
    db.commit()
    
    return {"message": "Task deleted successfully"}