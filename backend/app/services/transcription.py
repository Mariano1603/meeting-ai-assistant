

import openai
from typing import Optional
from app.core.config import settings

openai.api_key = settings.openai_api_key

class TranscriptionService:
    @staticmethod
    async def transcribe_audio(file_path: str) -> str:
        """Transcribe audio file using OpenAI Whisper API"""
        try:
            with open(file_path, "rb") as audio_file:
                transcript = openai.Audio.transcribe(
                    model="whisper-1",
                    file=audio_file,
                    response_format="text"
                )
            return transcript
        except Exception as e:
            raise Exception(f"Transcription failed: {str(e)}")
        



# Second type impl
# class TranscriptionService:
#     @staticmethod
#     async def transcribe_audio(file_path: str) -> str:
#         """Transcribe audio file using OpenAI Whisper API"""
#         try:
#             with open(file_path, "rb") as audio_file:
#                 transcript = openai.Audio.transcribe(
#                     model="whisper-1",
#                     file=audio_file,
#                     response_format="text"
#                 )
#             return {
#                 "transcription": transcription,
#                 "summary": summary_data,
#                 "tasks": tasks,
#                 "status": "completed"
#             }
            
#         except Exception as e:
#             return {
#                 "error": str(e),
#                 "status": "failed"
#             } transcript
#         except Exception as e:
#             raise Exception(f"Transcription failed: {str(e)}")