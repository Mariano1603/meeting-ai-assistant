import openai
import json
from typing import List, Dict
from app.core.config import settings

openai.api_key = settings.openai_api_key

class TaskExtractionService:
    @staticmethod
    async def extract_tasks(transcription: str, participants: List[str] = None) -> List[Dict]:
        """Extract action items and tasks from meeting transcription"""
        
        participants_info = ""
        if participants:
            participants_info = f"Known participants: {', '.join(participants)}"
        
        prompt = f"""
        Analyze this meeting transcription and extract all action items, tasks, and assignments.
        
        {participants_info}
        
        For each task, identify:
        1. What needs to be done (task description)
        2. Who should do it (if mentioned)
        3. When it should be completed (if mentioned)
        4. Priority level (high, medium, low)
        
        Format your response as JSON array:
        [
            {{
                "title": "Brief task title",
                "description": "Detailed description of what needs to be done",
                "assignee": "Person's name or email if mentioned, otherwise null",
                "due_date": "Date if mentioned (YYYY-MM-DD format), otherwise null",
                "priority": "high|medium|low",
                "context": "Brief context from the meeting"
            }}
        ]
        
        Meeting Transcription:
        {transcription}
        """
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert at extracting action items from meetings. Always respond with valid JSON array."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1000,
                temperature=0.2
            )
            
            content = response.choices[0].message.content
            return json.loads(content)
            
        except Exception as e:
            raise Exception(f"Task extraction failed: {str(e)}")
