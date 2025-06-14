import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List
from datetime import datetime

from app.core.config import settings
from app.models.user import User
from app.models.meeting import Meeting
from app.models.task import Task

class EmailService:
    def __init__(self):
        self.smtp_host = settings.smtp_host
        self.smtp_port = settings.smtp_port
        self.smtp_user = settings.smtp_user
        self.smtp_password = settings.smtp_password
    
    def _send_email(self, to_email: str, subject: str, html_content: str):
        """Send email using SMTP"""
        if not all([self.smtp_host, self.smtp_user, self.smtp_password]):
            print("Email service not configured")
            return False
        
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.smtp_user
            msg['To'] = to_email
            
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.send_message(msg)
            
            return True
        except Exception as e:
            print(f"Failed to send email: {e}")
            return False
    
    def send_task_summary(self, user: User, meeting: Meeting, tasks: List[Task]):
        """Send personalized task summary to user"""
        
        # Generate task list HTML
        task_list_html = ""
        for task in tasks:
            priority_color = {
                "high": "#ff4444",
                "medium": "#ff8800", 
                "low": "#44ff44"
            }.get(task.priority.value, "#888888")
            
            due_date_str = task.due_date.strftime("%B %d, %Y") if task.due_date else "No due date"
            
            task_list_html += f"""
            <div style="border-left: 4px solid {priority_color}; padding-left: 15px; margin: 15px 0;">
                <h3 style="margin: 0; color: #333;">{task.title}</h3>
                <p style="margin: 5px 0; color: #666;">{task.description}</p>
                <p style="margin: 5px 0; font-size: 12px; color: #999;">
                    Priority: {task.priority.value.title()} | Due: {due_date_str}
                </p>
            </div>
            """
        
        # Email HTML template
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Meeting Action Items - {meeting.title}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h1 style="color: #2c3e50; margin: 0;">Meeting Action Items</h1>
                <p style="margin: 10px 0 0 0; color: #666;">From: {meeting.title}</p>
                <p style="margin: 5px 0 0 0; color: #666;">Date: {meeting.created_at.strftime("%B %d, %Y")}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h2 style="color: #2c3e50;">Hi {user.full_name},</h2>
                <p>Here are your action items from the recent meeting:</p>
            </div>
            
            <div style="background: #ffffff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px;">
                <h3 style="color: #2c3e50; margin-top: 0;">Your Tasks ({len(tasks)})</h3>
                {task_list_html}
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #e8f4f8; border-radius: 8px;">
                <p style="margin: 0; font-size: 14px; color: #666;">
                    💡 <strong>Tip:</strong> Log into Meeting Whisperer to update task status and view the full meeting summary.
                </p>
            </div>
            
            <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #999;">
                <p>Sent by Meeting Whisperer - AI-Powered Meeting Assistant</p>
            </div>
        </body>
        </html>
        """
        
        subject = f"Action Items from {meeting.title}"
        return self._send_email(user.email, subject, html_content)
    
    def send_meeting_completed_notification(self, user: User, meeting: Meeting):
        """Send notification when meeting processing is completed"""
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #c3e6cb;">
                <h1 style="color: #155724; margin: 0;">✅ Meeting Processing Complete</h1>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h2 style="color: #2c3e50;">Hi {user.full_name},</h2>
                <p>Your meeting "<strong>{meeting.title}</strong>" has been successfully processed by our AI.</p>
            </div>
            
            <div style="background: #ffffff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px;">
                <h3 style="color: #2c3e50; margin-top: 0;">What's Ready:</h3>
                <ul style="padding-left: 20px;">
                    <li>📝 Full meeting transcription</li>
                    <li>📋 Intelligent meeting summary</li>
                    <li>✅ Extracted action items</li>
                    <li>👥 Task assignments</li>
                </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3000/dashboard/meetings/{meeting.id}" 
                   style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    View Meeting Results
                </a>
            </div>
        </body>
        </html>
        """
        
        subject = f"Meeting '{meeting.title}' - Processing Complete"
        return self._send_email(user.email, subject, html_content)