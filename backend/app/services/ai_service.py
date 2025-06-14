# backend/app/services/ai_service.py
from typing import Dict, List
from app.services.transcription import TranscriptionService
from app.services.summarization import SummarizationService
from app.services.task_extraction import TaskExtractionService

class AIService:
    """Main AI service that orchestrates all AI processing"""
    
    def __init__(self):
        self.transcription_service = TranscriptionService()
        self.summarization_service = SummarizationService()
        self.task_extraction_service = TaskExtractionService()
    
    async def process_meeting(self, file_path: str, participants: List[str] = None) -> Dict:
        """Complete AI processing pipeline for a meeting"""
        
        try:
            # Step 1: Transcribe audio
            transcription = await self.transcription_service.transcribe_audio(file_path)
            
            # Step 2: Generate summary
            summary_data = await self.summarization_service.summarize_meeting(transcription)
            
            # Step 3: Extract tasks
            tasks = await self.task_extraction_service.extract_tasks(transcription, participants)
            
            # Combine results into a single response
            return {
                "transcription": transcription,
                "summary": summary_data,
                "tasks": tasks,
                "participants": participants or [],
                "status": "success"
            }
            
        except Exception as e:
            # Handle errors and return a structured error response
            return {
                "transcription": None,
                "summary": None,
                "tasks": [],
                "participants": participants or [],
                "status": "error",
                "error_message": str(e)
            }