from sqlalchemy import Column, Integer, Float, Text, JSON, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)
    
    # Scores
    empathy_score = Column(Float)
    clarity_score = Column(Float)
    emotional_alignment_score = Column(Float)
    ethical_appropriateness_score = Column(Float)
    cultural_sensitivity_score = Column(Float)
    
    # Overall assessment
    overall_score = Column(Float)
    
    # Detailed feedback
    strengths = Column(JSON)  # List of strengths
    areas_for_improvement = Column(JSON)  # List of areas to improve
    suggested_responses = Column(JSON)  # Alternative responses
    
    # Narrative feedback
    summary = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
