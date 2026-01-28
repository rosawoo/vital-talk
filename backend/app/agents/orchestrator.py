from typing import Dict, Any, List
import redis
import json
from app.agents.emotional_agent import EmotionalAgent
from app.agents.emotion_state_manager import EmotionStateManager
from app.agents.coach_agent import CoachAgent
from app.agents.safety_agent import SafetyAgent
from app.core.config import settings

class ConversationOrchestrator:
    """
    Conversation Orchestrator Agent
    Coordinates all agents and manages conversation state
    Handles pause/redo/branch functionality
    """
    
    def __init__(self):
        self.emotional_agent = EmotionalAgent()
        self.emotion_manager = EmotionStateManager()
        self.coach_agent = CoachAgent()
        self.safety_agent = SafetyAgent()
        
        # Redis for conversation state management
        self.redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
    
    async def start_conversation(
        self,
        conversation_id: int,
        scenario_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Initialize a new conversation"""
        
        initial_state = {
            "conversation_id": conversation_id,
            "scenario": scenario_context,
            "emotional_state": scenario_context.get("initial_emotional_state", "neutral"),
            "emotional_intensity": 5,
            "history": [],
            "checkpoints": [],
            "turn_count": 0
        }
        
        # Save to Redis
        self._save_state(conversation_id, initial_state)
        
        return {
            "status": "started",
            "initial_emotional_state": initial_state["emotional_state"]
        }
    
    async def process_message(
        self,
        conversation_id: int,
        user_message: str
    ) -> Dict[str, Any]:
        """
        Process user message through the agent pipeline
        1. Safety check on user input
        2. Evaluate emotional state transition
        3. Generate agent response
        4. Safety check on agent response
        5. Update state
        """
        
        # Load conversation state
        state = self._load_state(conversation_id)
        if not state:
            return {"error": "Conversation not found"}
        
        # Step 1: Safety check on user input
        safety_check = self.safety_agent.check_user_message_safety(user_message)
        if not safety_check["safe"]:
            return {
                "role": "system",
                "content": safety_check["message"],
                "type": "warning"
            }
        
        # Step 2: Create checkpoint before processing (for redo functionality)
        self._create_checkpoint(conversation_id, state)
        
        # Add user message to history
        state["history"].append({
            "role": "user",
            "content": user_message,
            "emotional_state": state["emotional_state"]
        })
        
        # Step 3: Evaluate emotional state transition
        emotion_eval = self.emotion_manager.evaluate_transition(
            current_state=state["emotional_state"],
            user_message=user_message,
            conversation_history=state["history"],
            scenario_context=state["scenario"]
        )
        
        # Update emotional state
        new_emotional_state = emotion_eval["new_state"]
        state["emotional_state"] = new_emotional_state
        state["emotional_intensity"] = emotion_eval["intensity"]
        
        # Step 4: Generate agent response
        agent_response = self.emotional_agent.generate_response(
            user_message=user_message,
            emotional_state=new_emotional_state,
            scenario_context=state["scenario"],
            conversation_history=state["history"]
        )
        
        # Step 5: Safety check on agent response
        safety_result = self.safety_agent.check_response_safety(
            response=agent_response,
            context={
                "emotional_state": new_emotional_state,
                "scenario": state["scenario"]
            }
        )
        
        final_response = safety_result["modified_response"]
        
        # Add agent response to history
        state["history"].append({
            "role": "agent",
            "content": final_response,
            "emotional_state": new_emotional_state
        })
        
        state["turn_count"] += 1
        
        # Save updated state
        self._save_state(conversation_id, state)
        
        return {
            "role": "agent",
            "content": final_response,
            "emotional_state": new_emotional_state,
            "emotional_intensity": emotion_eval["intensity"],
            "transition_reasoning": emotion_eval.get("reasoning", ""),
            "type": "message"
        }
    
    async def pause_conversation(self, conversation_id: int) -> Dict[str, Any]:
        """Pause and save conversation state"""
        state = self._load_state(conversation_id)
        if state:
            state["status"] = "paused"
            self._save_state(conversation_id, state)
            return {"status": "paused"}
        return {"error": "Conversation not found"}
    
    async def redo_last_turn(self, conversation_id: int) -> Dict[str, Any]:
        """Rewind to last checkpoint"""
        checkpoint_key = f"conversation:{conversation_id}:checkpoint"
        checkpoint_data = self.redis_client.get(checkpoint_key)
        
        if checkpoint_data:
            # Restore from checkpoint
            state = json.loads(checkpoint_data)
            self._save_state(conversation_id, state)
            return {
                "status": "rewound",
                "message": "Last turn has been undone. You can try a different response."
            }
        
        return {"error": "No checkpoint available"}
    
    async def get_coaching_hint(
        self,
        conversation_id: int,
        context: str = "general"
    ) -> Dict[str, Any]:
        """Get real-time coaching hint"""
        state = self._load_state(conversation_id)
        if not state:
            return {"error": "Conversation not found"}
        
        hint = self.coach_agent.evaluate_single_response(
            user_message=state["history"][-1]["content"] if state["history"] else "",
            context={
                "emotional_state": state["emotional_state"],
                "scenario": state["scenario"]
            }
        )
        
        return hint
    
    async def get_final_feedback(self, conversation_id: int) -> Dict[str, Any]:
        """Generate comprehensive feedback for completed conversation"""
        state = self._load_state(conversation_id)
        if not state:
            return {"error": "Conversation not found"}
        
        feedback = self.coach_agent.evaluate_conversation(
            conversation_history=state["history"],
            scenario_context=state["scenario"]
        )
        
        return feedback
    
    def _save_state(self, conversation_id: int, state: Dict[str, Any]):
        """Save conversation state to Redis"""
        key = f"conversation:{conversation_id}:state"
        self.redis_client.set(key, json.dumps(state))
        self.redis_client.expire(key, 86400)  # 24 hour TTL
    
    def _load_state(self, conversation_id: int) -> Dict[str, Any]:
        """Load conversation state from Redis"""
        key = f"conversation:{conversation_id}:state"
        data = self.redis_client.get(key)
        return json.loads(data) if data else None
    
    def _create_checkpoint(self, conversation_id: int, state: Dict[str, Any]):
        """Create checkpoint for redo functionality"""
        checkpoint_key = f"conversation:{conversation_id}:checkpoint"
        # Save current state as checkpoint
        checkpoint_state = json.loads(json.dumps(state))  # Deep copy
        self.redis_client.set(checkpoint_key, json.dumps(checkpoint_state))
        self.redis_client.expire(checkpoint_key, 3600)  # 1 hour TTL
