from sqlalchemy import Column, Integer, String, Text, JSON, Enum, DateTime
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class DifficultyLevel(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

class Scenario(Base):
    __tablename__ = "scenarios"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(Enum(DifficultyLevel), nullable=False)
    
    # Patient context
    patient_age = Column(Integer)
    patient_condition = Column(Text)
    patient_prognosis = Column(Text)
    
    # Family context
    family_relationship = Column(String)
    family_background = Column(Text)
    
    # Emotional baseline
    initial_emotional_state = Column(String, default="neutral")
    
    # Conversation goals
    conversation_goals = Column(JSON)  # List of goals
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
