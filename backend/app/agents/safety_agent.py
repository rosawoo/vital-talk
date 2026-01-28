from typing import Dict, Any
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from app.core.config import settings

class SafetyAgent:
    """
    Safety & Ethics Guard Agent
    Prevents unsafe advice and ensures ethical appropriateness
    """
    
    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0.2,  # Low temperature for consistent safety checks
            openai_api_key=settings.OPENAI_API_KEY
        )
    
    def check_response_safety(
        self,
        response: str,
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Check if agent response is safe and appropriate
        Returns: {safe: bool, issues: list, modified_response: str}
        """
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", self._build_safety_prompt()),
            ("human", f"Context: {context}\n\nAgent Response: {response}\n\nIs this safe and appropriate?")
        ])
        
        chain = prompt | self.llm
        result = chain.invoke({})
        
        # Parse response
        content = result.content.lower()
        
        if "unsafe" in content or "inappropriate" in content:
            return {
                "safe": False,
                "issues": self._extract_issues(result.content),
                "modified_response": self._get_safe_fallback(context)
            }
        
        return {
            "safe": True,
            "issues": [],
            "modified_response": response
        }
    
    def check_user_message_safety(
        self,
        user_message: str
    ) -> Dict[str, Any]:
        """Check if user's message is appropriate"""
        
        # Basic checks for extremely inappropriate content
        inappropriate_keywords = [
            "harm", "kill", "abuse"
        ]
        
        for keyword in inappropriate_keywords:
            if keyword in user_message.lower():
                return {
                    "safe": False,
                    "message": "Please maintain professional communication."
                }
        
        return {"safe": True}
    
    def _build_safety_prompt(self) -> str:
        return """You are a safety and ethics checker for a medical conversation simulation.

Check for:
1. **Medical Accuracy**: No false medical information or made-up treatments
2. **Ethical Guidelines**: Respects patient autonomy, beneficence, non-maleficence
3. **Professional Boundaries**: Maintains appropriate doctor-family relationship
4. **Cultural Sensitivity**: No offensive or culturally inappropriate content
5. **Emotional Safety**: No cruel or unnecessarily harsh language

Red Flags:
- Promising impossible outcomes
- Recommending unproven treatments
- Violating medical ethics
- Offensive language or stereotypes
- Inappropriate emotional manipulation

Respond with:
- "SAFE" if appropriate
- "UNSAFE: [reason]" if problematic"""

    def _extract_issues(self, response: str) -> list:
        """Extract safety issues from LLM response"""
        # Simple extraction - could be more sophisticated
        lines = response.split("\n")
        issues = [line.strip() for line in lines if ":" in line]
        return issues[:3]  # Top 3 issues
    
    def _get_safe_fallback(self, context: Dict[str, Any]) -> str:
        """Return a safe, generic response"""
        emotional_state = context.get("emotional_state", "uncertain")
        
        fallback_responses = {
            "denial": "I hear what you're saying, Doctor. I just need some time to process this.",
            "anger": "I'm feeling overwhelmed right now. Can we take a moment?",
            "sadness": "This is very difficult to hear. Thank you for being honest with me.",
            "acceptance": "I understand. What should we do next?",
            "bargaining": "Is there anything else we can try?"
        }
        
        return fallback_responses.get(emotional_state, "I need a moment to think about this.")
