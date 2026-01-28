from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class ScenarioResponse(BaseModel):
    id: int
    title: str
    description: str
    difficulty: str
    patient_age: Optional[int]
    patient_condition: Optional[str]
    
    class Config:
        from_attributes = True

@router.get("/", response_model=List[ScenarioResponse])
async def list_scenarios():
    # Return sample scenarios
    return [
        {
            "id": 1,
            "title": "Terminal Cancer - Family in Denial",
            "description": "75-year-old patient with stage 4 lung cancer. Adult daughter is in denial about prognosis.",
            "difficulty": "intermediate",
            "patient_age": 75,
            "patient_condition": "Stage 4 lung cancer with weeks to live"
        },
        {
            "id": 2,
            "title": "Sudden Cardiac Arrest - Spouse in Shock",
            "description": "58-year-old patient after cardiac arrest. Spouse is experiencing shock and anger.",
            "difficulty": "beginner",
            "patient_age": 58,
            "patient_condition": "Post-cardiac arrest, severe brain damage"
        },
        {
            "id": 3,
            "title": "Advanced Dementia - Family Disagreement",
            "description": "82-year-old with advanced dementia. Family members disagree on care approach.",
            "difficulty": "advanced",
            "patient_age": 82,
            "patient_condition": "Advanced dementia, recurrent aspiration pneumonia"
        }
    ]

@router.get("/{scenario_id}", response_model=ScenarioResponse)
async def get_scenario(scenario_id: int):
    scenarios = await list_scenarios()
    for scenario in scenarios:
        if scenario["id"] == scenario_id:
            return scenario
    raise HTTPException(status_code=404, detail="Scenario not found")
