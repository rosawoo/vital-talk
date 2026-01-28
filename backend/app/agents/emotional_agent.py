from typing import Dict, Any
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from app.core.config import settings

class EmotionalAgent:
    """
    Patient/Family Emotional Agent
    Simulates the human counterpart with emotional consistency
    """
    
    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0.7,
            openai_api_key=settings.OPENAI_API_KEY
        )
        
    def generate_response(
        self, 
        user_message: str,
        emotional_state: str,
        scenario_context: Dict[str, Any],
        conversation_history: list
    ) -> str:
        """Generate emotionally consistent response"""
        
        # Build context-aware prompt
        prompt = ChatPromptTemplate.from_messages([
            ("system", self._build_system_prompt(emotional_state, scenario_context)),
            ("human", "{history}\n\nDoctor: {message}\n\nRespond as the family member:")
        ])
        
        # Format conversation history
        history_text = self._format_history(conversation_history)
        
        # Generate response
        chain = prompt | self.llm
        response = chain.invoke({
            "history": history_text,
            "message": user_message
        })
        
        return response.content
    
    def _build_system_prompt(self, emotional_state: str, scenario: Dict[str, Any]) -> str:
        """Build role-playing system prompt based on emotional state"""
        
        emotional_instructions = {
            "denial": "You are in denial about the severity of the situation. You keep insisting there must be another option, another treatment. You interrupt with hope-seeking questions. You may become agitated when faced with bad news.",
            "anger": "You are angry and frustrated. You may raise your voice, blame others, or question the competence of the medical team. You feel helpless and express that through anger.",
            "bargaining": "You are trying to negotiate. You ask 'what if' questions, propose alternative timelines, and seek any possible way to change the outcome. You're willing to try anything.",
            "sadness": "You are deeply sad and grieving. You speak slowly, may cry, and express feelings of loss and hopelessness. You need emotional support and understanding.",
            "acceptance": "You are coming to terms with the situation. You ask practical questions about next steps, comfort care, and how to make the patient comfortable. You're more receptive to information.",
            "neutral": "You are uncertain and seeking information. You're processing what's happening and need clarity from the doctor."
        }
        
        return f"""You are roleplaying as a family member in an end-of-life conversation scenario.

Scenario Context:
- Patient: {scenario.get('patient_condition', 'Serious condition')}
- Your relationship: {scenario.get('family_relationship', 'Family member')}
- Background: {scenario.get('family_background', 'You care deeply about the patient')}

Current Emotional State: {emotional_state}
{emotional_instructions.get(emotional_state, emotional_instructions['neutral'])}

Important Guidelines:
- Stay in character with your emotional state
- Be realistic - emotions don't change instantly
- React authentically to what the doctor says
- Use natural, conversational Japanese or English
- Show emotion through your words, not by stating "I feel X"
- Keep responses concise (2-3 sentences typically)

Remember: You are a real person in crisis, not a textbook example. Be human."""

    def _format_history(self, history: list) -> str:
        """Format conversation history for context"""
        if not history:
            return "Beginning of conversation."
        
        formatted = []
        for msg in history[-5:]:  # Last 5 messages for context
            role = "Doctor" if msg["role"] == "user" else "Family"
            formatted.append(f"{role}: {msg['content']}")
        
        return "\n".join(formatted)
