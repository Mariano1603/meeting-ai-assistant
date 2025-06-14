import json
from datetime import datetime
from celery import current_task
from sqlalchemy.orm import Session

from app.workers.celery_app import celery_app
from app.core.database import SessionLocal, engine
from app.models.meeting import Meeting, MeetingStatus
from app.models.task import Task, TaskPriority
from app.models.user import User
from app.services.ai_service import AIService
from app.services.email_service import EmailService

def get_db():
    db = SessionLocal()
    try:
        return db
    finally:
        pass

@celery_app.task(bind=True)
async def process_meeting_task(self, meeting_id: int):
    """Background task to process meeting with AI"""
    db = get_db()
    
    try:
        # Update task status
        current_task.update_state(state='PROGRESS', meta={'progress': 0, 'status': 'Starting AI processing'})
        
        # Get meeting from database
        meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
        if not meeting:
            raise Exception("Meeting not found")
        
        # Update meeting status
        meeting.status = MeetingStatus.PROCESSING
        db.commit()
        
        # Initialize AI service
        ai_service = AIService()
        
        # Update progress
        current_task.update_state(state='PROGRESS', meta={'progress': 20, 'status': 'Transcribing audio'})
        
        # Process meeting with AI
        result = await ai_service.process_meeting(meeting.file_path)
        
        if "error" in result:
            meeting.status = MeetingStatus.FAILED
            db.commit()
            raise Exception(result["error"])
        
        # Update progress
        current_task.update_state(state='PROGRESS', meta={'progress': 80, 'status': 'Extracting tasks'})
        
        # Update meeting with results
        meeting.transcription = result["transcription"]
        meeting.summary = result["summary"]["summary"]
        meeting.key_points = json.dumps(result["summary"])
        meeting.status = MeetingStatus.COMPLETED
        meeting.processed_at = datetime.utcnow()
        
        # Create tasks in database
        for task_data in result["tasks"]:
            # Try to find assignee by name/email
            assignee = None
            if task_data.get("assignee"):
                assignee = db.query(User).filter(
                    (User.email == task_data["assignee"]) | 
                    (User.full_name.ilike(f"%{task_data['assignee']}%"))
                ).first()
            
            # Parse priority
            priority_map = {"high": TaskPriority.HIGH, "medium": TaskPriority.MEDIUM, "low": TaskPriority.LOW}
            priority = priority_map.get(task_data.get("priority", "medium"), TaskPriority.MEDIUM)
            
            # Parse due date
            due_date = None
            if task_data.get("due_date"):
                try:
                    due_date = datetime.strptime(task_data["due_date"], "%Y-%m-%d")
                except ValueError:
                    pass
            
            # Create task
            task = Task(
                title=task_data["title"],
                description=task_data["description"],
                priority=priority,
                due_date=due_date,
                meeting_id=meeting.id,
                assignee_id=assignee.id if assignee else None
            )
            db.add(task)
        
        db.commit()
        
        # Update progress
        current_task.update_state(state='PROGRESS', meta={'progress': 90, 'status': 'Sending notifications'})
        
        # Send notifications
        send_meeting_notifications.delay(meeting_id)
        
        # Final update
        current_task.update_state(state='SUCCESS', meta={'progress': 100, 'status': 'Processing completed'})
        
        return {
            "meeting_id": meeting_id,
            "status": "completed",
            "tasks_created": len(result["tasks"])
        }
        
    except Exception as e:
        # Update meeting status to failed
        if 'meeting' in locals():
            meeting.status = MeetingStatus.FAILED
            db.commit()
        
        current_task.update_state(
            state='FAILURE',
            meta={'error': str(e), 'progress': 0}
        )
        raise e
    
    finally:
        db.close()

@celery_app.task
def send_meeting_notifications(meeting_id: int):
    """Send email notifications to meeting participants"""
    db = get_db()
    
    try:
        meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
        if not meeting:
            return
        
        # Get all tasks for this meeting
        tasks = db.query(Task).filter(Task.meeting_id == meeting_id).all()
        
        # Group tasks by assignee
        tasks_by_user = {}
        for task in tasks:
            if task.assignee_id:
                if task.assignee_id not in tasks_by_user:
                    tasks_by_user[task.assignee_id] = []
                tasks_by_user[task.assignee_id].append(task)
        
        # Send personalized emails
        email_service = EmailService()
        for user_id, user_tasks in tasks_by_user.items():
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                email_service.send_task_summary(user, meeting, user_tasks)
        
        return {"notifications_sent": len(tasks_by_user)}
        
    except Exception as e:
        print(f"Failed to send notifications: {e}")
        return {"error": str(e)}
    
    finally:
        db.close()