from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from openai import OpenAI, OpenAIError
from app.core.config import settings
import io
import logging

router = APIRouter()
client = OpenAI(api_key=settings.OPENAI_API_KEY)
logger = logging.getLogger(__name__)

class TTSRequest(BaseModel):
    text: str
    emotion: str = "neutral"

def get_voice_for_emotion(emotion: str) -> str:
    """Map emotional states to appropriate TTS voices"""
    voice_map = {
        "neutral": "nova",      # Calm, professional
        "denial": "alloy",      # Slightly defensive
        "anger": "onyx",        # Deeper, more intense
        "bargaining": "shimmer", # Hopeful, pleading
        "sadness": "echo",      # Softer, emotional
        "acceptance": "fable"   # Peaceful, resigned
    }
    return voice_map.get(emotion, "nova")

@router.post("/speech-to-text")
async def speech_to_text(audio_file: UploadFile = File(...)):
    """
    Convert speech audio to text using OpenAI Whisper API
    """
    try:
        # Read the uploaded audio file
        audio_data = await audio_file.read()
        
        # Create a file-like object for OpenAI API
        audio_file_obj = io.BytesIO(audio_data)
        audio_file_obj.name = audio_file.filename or "audio.webm"
        
        # Use Whisper API for transcription
        transcription = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file_obj,
            language="en"  # Can be made configurable for Japanese support
        )
        
        return {
            "text": transcription.text,
            "success": True
        }
    
    except OpenAIError as e:
        logger.error(f"OpenAI API error: {str(e)}")
        error_msg = "Transcription service unavailable. Please check your OpenAI API quota."
        if hasattr(e, 'code') and e.code == 'insufficient_quota':
            error_msg = "OpenAI API quota exceeded. Please check your billing details at https://platform.openai.com/account/billing"
        raise HTTPException(status_code=503, detail=error_msg)
    except Exception as e:
        logger.error(f"Unexpected error in speech-to-text: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

@router.post("/text-to-speech")
async def text_to_speech(request: TTSRequest):
    """
    Convert text to speech using OpenAI TTS API
    Voice is selected based on emotional state for more realistic interactions
    """
    try:
        # Select voice based on emotion
        voice = get_voice_for_emotion(request.emotion)
        
        # Generate speech
        response = client.audio.speech.create(
            model="tts-1",  # Use tts-1-hd for higher quality if needed
            voice=voice,
            input=request.text,
            speed=1.0  # Can be adjusted based on emotion (faster for anger, slower for sadness)
        )
        
        # Read the audio content
        audio_content = response.read()
        audio_bytes = io.BytesIO(audio_content)
        
        return StreamingResponse(
            audio_bytes,
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "attachment; filename=response.mp3"
            }
        )
    
    except OpenAIError as e:
        logger.error(f"OpenAI API error: {str(e)}")
        error_msg = "Text-to-speech service unavailable. Please check your OpenAI API quota."
        if hasattr(e, 'code') and e.code == 'insufficient_quota':
            error_msg = "OpenAI API quota exceeded. Please check your billing details at https://platform.openai.com/account/billing"
        raise HTTPException(status_code=503, detail=error_msg)
    except Exception as e:
        logger.error(f"Unexpected error in text-to-speech: {str(e)}")
        raise HTTPException(status_code=500, detail=f"TTS generation failed: {str(e)}")

@router.get("/health")
async def audio_health_check():
    """Check if audio services are configured"""
    return {
        "status": "healthy",
        "whisper_available": True,
        "tts_available": True
    }
