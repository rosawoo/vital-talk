from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import List, Optional
import json
from app.agents.orchestrator import ConversationOrchestrator

router = APIRouter()
orchestrator = ConversationOrchestrator()

class ConversationStart(BaseModel):
    scenario_id: int
    user_id: int

class ConversationResponse(BaseModel):
    id: int
    scenario_id: int
    status: str
    current_emotional_state: str
    
    class Config:
        from_attributes = True

class MessageRequest(BaseModel):
    conversation_id: int
    content: str

class MessageResponse(BaseModel):
    role: str
    content: str
    emotional_state: Optional[str]

# Mock scenario data - in production this would come from database
MOCK_SCENARIOS = {
    1: {
        "id": 1,
        "title": "Terminal Cancer - Family in Denial",
        "description": "75-year-old patient with stage 4 lung cancer. Adult daughter is in denial about prognosis.",
        "patient_condition": "Stage 4 lung cancer with weeks to live",
        "patient_age": 75,
        "family_relationship": "Adult daughter",
        "family_background": "Only child who has been very close to parent. Works as a nurse.",
        "initial_emotional_state": "denial"
    },
    2: {
        "id": 2,
        "title": "Sudden Cardiac Arrest - Spouse in Shock",
        "description": "58-year-old patient after cardiac arrest. Spouse is experiencing shock and anger.",
        "patient_condition": "Post-cardiac arrest, severe brain damage",
        "patient_age": 58,
        "family_relationship": "Spouse",
        "family_background": "Married 30 years. No other family nearby.",
        "initial_emotional_state": "anger"
    },
    3: {
        "id": 3,
        "title": "Advanced Dementia - Family Disagreement",
        "description": "82-year-old with advanced dementia. Family members disagree on care approach.",
        "patient_condition": "Advanced dementia, recurrent aspiration pneumonia",
        "patient_age": 82,
        "family_relationship": "Adult children (multiple)",
        "family_background": "Three adult children with different opinions on care.",
        "initial_emotional_state": "bargaining"
    }
}

@router.post("/start", response_model=ConversationResponse)
async def start_conversation(conversation: ConversationStart):
    # Get scenario context
    scenario_context = MOCK_SCENARIOS.get(conversation.scenario_id)
    if not scenario_context:
        scenario_context = MOCK_SCENARIOS[1]  # Default scenario
    
    # Initialize conversation with orchestrator
    conversation_id = conversation.scenario_id * 1000 + conversation.user_id  # Simple ID generation
    
    result = await orchestrator.start_conversation(
        conversation_id=conversation_id,
        scenario_context=scenario_context
    )
    
    return {
        "id": conversation_id,
        "scenario_id": conversation.scenario_id,
        "status": "in_progress",
        "current_emotional_state": result["initial_emotional_state"]
    }

@router.websocket("/ws/{conversation_id}")
async def websocket_endpoint(websocket: WebSocket, conversation_id: int):
    await websocket.accept()
    
    # Send initial greeting from agent
    await websocket.send_json({
        "role": "agent",
        "content": "Doctor... thank you for taking the time to speak with me. I know you're busy.",
        "emotional_state": "neutral",
        "type": "message"
    })
    
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Handle different message types
            msg_type = message_data.get("type", "message")
            
            if msg_type == "message":
                user_message = message_data.get("content", "")
                
                # Process through orchestrator
                response = await orchestrator.process_message(
                    conversation_id=conversation_id,
                    user_message=user_message
                )
                
                await websocket.send_json(response)
            
            elif msg_type == "redo":
                # Handle redo request
                result = await orchestrator.redo_last_turn(conversation_id)
                await websocket.send_json({
                    "type": "system",
                    "content": result.get("message", "Conversation rewound"),
                    "status": result.get("status")
                })
            
            elif msg_type == "hint":
                # Get coaching hint
                hint = await orchestrator.get_coaching_hint(conversation_id)
                await websocket.send_json({
                    "type": "hint",
                    "content": hint.get("feedback", ""),
                    "quality": hint.get("quality")
                })
            
    except WebSocketDisconnect:
        print(f"Client disconnected from conversation {conversation_id}")
        await orchestrator.pause_conversation(conversation_id)

@router.post("/pause/{conversation_id}")
async def pause_conversation(conversation_id: int):
    result = await orchestrator.pause_conversation(conversation_id)
    return result

@router.post("/resume/{conversation_id}")
async def resume_conversation(conversation_id: int):
    # TODO: Implement resume logic
    return {"status": "in_progress", "conversation_id": conversation_id}

@router.post("/redo/{conversation_id}")
async def redo_last_message(conversation_id: int):
    result = await orchestrator.redo_last_turn(conversation_id)
    return result

@router.get("/{conversation_id}/feedback")
async def get_conversation_feedback(conversation_id: int):
    feedback = await orchestrator.get_final_feedback(conversation_id)
    return feedback
