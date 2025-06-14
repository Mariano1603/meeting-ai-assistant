
import requests
from typing import List
from app.core.config import settings
from app.models.user import User
from app.models.meeting import Meeting
from app.models.task import Task

class SlackService:
    def __init__(self):
        self.bot_token = settings.slack_bot_token
        self.base_url = "https://slack.com/api"
    
    def _send_message(self, channel: str, text: str, blocks: List[dict] = None):
        """Send message to Slack channel"""
        if not self.bot_token:
            print("Slack bot token not configured")
            return False
        
        headers = {
            "Authorization": f"Bearer {self.bot_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "channel": channel,
            "text": text
        }
        
        if blocks:
            payload["blocks"] = blocks
        
        try:
            response = requests.post(
                f"{self.base_url}/chat.postMessage",
                json=payload,
                headers=headers
            )
            return response.status_code == 200
        except Exception as e:
            print(f"Failed to send Slack message: {e}")
            return False
    
    def send_task_summary(self, user_email: str, meeting: Meeting, tasks: List[Task]):
        """Send task summary to user via Slack DM"""
        
        # Create task blocks
        task_blocks = []
        for task in tasks:
            priority_emoji = {"high": "🔴", "medium": "🟡", "low": "🟢"}.get(task.priority.value, "⚪")
            due_date = task.due_date.strftime("%m/%d/%Y") if task.due_date else "No due date"
            
            task_blocks.append({
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"{priority_emoji} *{task.title}*\n{task.description}\n_Due: {due_date}_"
                }
            })
        
        blocks = [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": f"📋 Action Items from {meeting.title}"
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"Hi! Here are your action items from the recent meeting:"
                }
            },
            {
                "type": "divider"
            }
        ]
        
        blocks.extend(task_blocks)
        
        blocks.append({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": f"💡 View full meeting details in Meeting Whisperer"
            },
            "accessory": {
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "text": "Open Meeting"
                },
                "url": f"http://localhost:3000/dashboard/meetings/{meeting.id}"
            }
        })
        
        return self._send_message(
            channel=user_email,  # Send as DM to user email
            text=f"Action items from {meeting.title}",
            blocks=blocks
        )