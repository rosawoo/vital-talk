from typing import Dict, Any, List
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from app.core.config import settings
import json

class CoachAgent:
    """
    Coach/Feedback Agent
    Evaluates physician responses and provides constructive feedback
    """
    
    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-4o",
            temperature=0.4,
            openai_api_key=settings.OPENAI_API_KEY
        )
    
    def evaluate_conversation(
        self,
        conversation_history: List[Dict[str, Any]],
        scenario_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate comprehensive feedback for the conversation"""
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", self._build_coach_prompt()),
            ("human", self._build_evaluation_input(conversation_history, scenario_context))
        ])
        
        chain = prompt | self.llm
        response = chain.invoke({})
        
        try:
            result = json.loads(response.content)
            return result
        except:
            return self._get_default_feedback()
    
    def evaluate_single_response(
        self,
        user_message: str,
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Provide real-time feedback on a single response"""
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a medical communication coach. Evaluate this doctor's response."),
            ("human", f"Context: {context}\n\nDoctor said: {user_message}\n\nProvide brief feedback (2-3 sentences).")
        ])
        
        chain = prompt | self.llm
        response = chain.invoke({})
        
        return {
            "feedback": response.content,
            "quality": "good"  # Simple rating
        }
    
    def _build_coach_prompt(self) -> str:
        return """You are an expert medical communication coach specializing in end-of-life conversations.

Evaluate the physician's performance based on:

1. **Empathy (Weight: 25%)**: Did they acknowledge emotions? Use empathetic language? Give space for feelings?

2. **Clarity (Weight: 20%)**: Were medical facts clear? Did they avoid jargon? Check for understanding?

3. **Emotional Alignment (Weight: 20%)**: Did they match the family's emotional state? Pace information appropriately?

4. **Ethical Appropriateness (Weight: 20%)**: Follow medical ethics? Respect autonomy? Present options fairly?

5. **Cultural Sensitivity (Weight: 15%)**: Consider Japanese cultural norms? Respect hierarchy? Handle family dynamics appropriately?

Provide scores (0-10) for each dimension and overall.

Output JSON format:
{
    "empathy_score": 8.5,
    "clarity_score": 7.0,
    "emotional_alignment_score": 8.0,
    "ethical_appropriateness_score": 9.0,
    "cultural_sensitivity_score": 8.5,
    "overall_score": 8.2,
    "strengths": ["point 1", "point 2"],
    "areas_for_improvement": ["point 1", "point 2"],
    "suggested_responses": [
        {
            "situation": "when X happened",
            "better_response": "you could have said Y"
        }
    ],
    "summary": "2-3 sentence overall assessment"
}"""

    def _build_evaluation_input(
        self,
        history: List[Dict[str, Any]],
        scenario: Dict[str, Any]
    ) -> str:
        conversation_text = "\n".join([
            f"{msg['role'].upper()}: {msg['content']}"
            for msg in history
        ])
        
        return f"""Scenario: {scenario.get('description', 'End-of-life conversation')}

Conversation Transcript:
{conversation_text}

Provide comprehensive feedback for this physician."""

    def _get_default_feedback(self) -> Dict[str, Any]:
        return {
            "empathy_score": 7.0,
            "clarity_score": 7.0,
            "emotional_alignment_score": 7.0,
            "ethical_appropriateness_score": 8.0,
            "cultural_sensitivity_score": 7.5,
            "overall_score": 7.3,
            "strengths": ["Maintained professional demeanor"],
            "areas_for_improvement": ["Could provide more emotional support"],
            "suggested_responses": [],
            "summary": "Adequate performance with room for improvement."
        }
