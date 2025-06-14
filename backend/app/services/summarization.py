import openai
import json
from typing import Dict, List
from app.core.config import settings

openai.api_key = settings.openai_api_key

class SummarizationService:
    @staticmethod
    async def summarize_meeting(transcription: str) -> Dict:
        """Generate meeting summary using OpenAI GPT"""
        
        prompt = f"""
        Please analyze this meeting transcription and provide:
        1. A concise summary (2-3 paragraphs)
        2. Key discussion points (bullet points)
        3. Important decisions made
        4. Next steps mentioned
        
        Format your response as JSON with the following structure:
        {{
            "summary": "Brief overview of the meeting...",
            "key_points": [
                "Point 1",
                "Point 2"
            ],
            "decisions": [
                "Decision 1",
                "Decision 2"
            ],
            "next_steps": [
                "Step 1",
                "Step 2"
            ]
        }}
        
        Meeting Transcription:
        {transcription}
        """
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert meeting analyzer. Always respond with valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1500,
                temperature=0.3
            )
            
            content = response.choices[0].message.content
            return json.loads(content)
            
        except Exception as e:
            raise Exception(f"Summarization failed: {str(e)}")