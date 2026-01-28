from typing import Dict, Any, List
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from app.core.config import settings
import json

class EmotionStateManager:
    """
    Manages emotional state transitions
    Ensures realistic emotion evolution during conversation
    """
    
    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0.3,  # Lower temperature for more consistent state management
            openai_api_key=settings.OPENAI_API_KEY
        )
        
        # Emotion transition probabilities
        self.transition_rules = {
            "denial": {
                "empathetic_response": ["denial", "sadness", "anger"],
                "factual_response": ["denial", "anger"],
                "dismissive_response": ["anger"]
            },
            "anger": {
                "empathetic_response": ["anger", "sadness", "bargaining"],
                "factual_response": ["anger"],
                "dismissive_response": ["anger"]
            },
            "bargaining": {
                "empathetic_response": ["bargaining", "sadness", "acceptance"],
                "factual_response": ["bargaining", "sadness"],
                "dismissive_response": ["anger", "bargaining"]
            },
            "sadness": {
                "empathetic_response": ["sadness", "acceptance"],
                "factual_response": ["sadness"],
                "dismissive_response": ["sadness", "anger"]
            },
            "acceptance": {
                "empathetic_response": ["acceptance"],
                "factual_response": ["acceptance"],
                "dismissive_response": ["sadness", "acceptance"]
            }
        }
    
    def evaluate_transition(
        self,
        current_state: str,
        user_message: str,
        conversation_history: List[Dict[str, Any]],
        scenario_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Evaluate if emotional state should transition
        Returns new state and intensity
        """
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", self._build_evaluation_prompt()),
            ("human", self._build_evaluation_input(
                current_state, user_message, conversation_history, scenario_context
            ))
        ])
        
        chain = prompt | self.llm
        response = chain.invoke({})
        
        # Parse response
        try:
            result = json.loads(response.content)
            return {
                "new_state": result.get("new_state", current_state),
                "intensity": result.get("intensity", 5),
                "reasoning": result.get("reasoning", "")
            }
        except:
            # Fallback if parsing fails
            return {
                "new_state": current_state,
                "intensity": 5,
                "reasoning": "Failed to parse evaluation"
            }
    
    def _build_evaluation_prompt(self) -> str:
        return """You are an emotion state manager for a medical conversation simulation.

Your job is to evaluate if the family member's emotional state should change based on the doctor's response.

Emotional States:
- denial: Refusing to accept the situation
- anger: Frustration, blame, raised emotions
- bargaining: Seeking alternatives, "what if" thinking
- sadness: Grief, tears, despair
- acceptance: Coming to terms, practical focus

Evaluation Criteria:
1. Did the doctor show empathy? (Empathetic responses help transition from anger to sadness/acceptance)
2. Was the doctor dismissive? (Can escalate to anger)
3. Was the doctor overly clinical/factual? (Can maintain current state or cause anger)
4. How long has the person been in current state? (Natural progression over time)

Output JSON format:
{
    "new_state": "emotion_name",
    "intensity": 1-10,
    "reasoning": "Brief explanation"
}

Keep transitions realistic - people don't jump from anger to acceptance instantly."""

    def _build_evaluation_input(
        self,
        current_state: str,
        user_message: str,
        history: List[Dict[str, Any]],
        scenario: Dict[str, Any]
    ) -> str:
        history_text = "\n".join([
            f"{msg['role']}: {msg['content']}" 
            for msg in history[-3:]
        ])
        
        return f"""Current Emotional State: {current_state}
Conversation turns so far: {len(history)}

Recent History:
{history_text}

Doctor's Latest Message:
{user_message}

Evaluate the emotional state transition."""
