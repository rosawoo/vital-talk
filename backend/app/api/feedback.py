from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class FeedbackResponse(BaseModel):
    conversation_id: int
    empathy_score: float
    clarity_score: float
    emotional_alignment_score: float
    ethical_appropriateness_score: float
    cultural_sensitivity_score: float
    overall_score: float
    strengths: List[str]
    areas_for_improvement: List[str]
    summary: str
    
    class Config:
        from_attributes = True

@router.get("/{conversation_id}", response_model=FeedbackResponse)
async def get_feedback(conversation_id: int):
    # TODO: Generate real feedback using Coach agent
    return {
        "conversation_id": conversation_id,
        "empathy_score": 8.5,
        "clarity_score": 7.8,
        "emotional_alignment_score": 8.2,
        "ethical_appropriateness_score": 9.0,
        "cultural_sensitivity_score": 8.5,
        "overall_score": 8.4,
        "strengths": [
            "Good use of empathetic language",
            "Gave family time to process information",
            "Respected cultural considerations"
        ],
        "areas_for_improvement": [
            "Could have provided more specific medical details",
            "Might have checked for understanding more frequently"
        ],
        "summary": "You demonstrated strong empathy and cultural awareness. Consider being more explicit about treatment options and checking comprehension."
    }
