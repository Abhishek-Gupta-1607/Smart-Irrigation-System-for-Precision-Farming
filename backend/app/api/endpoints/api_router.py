from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any

router = APIRouter()

class ImageUploadResponse(BaseModel):
    task_id: str
    message: str

@router.post("/upload-image", response_model=ImageUploadResponse)
def upload_image():
    # In a real app, this would accept an UploadFile, save it, 
    # and enqueue a celery task.
    return {
        "task_id": "dummy-task-id",
        "message": "Image queued for processing."
    }

@router.get("/analyze/{task_id}")
def get_analysis_status(task_id: str):
    return {"status": "completed", "result": "Mock results"}

@router.get("/dashboard")
def get_dashboard_summary():
    return {
        "water_saved_liters": 12500,
        "disease_alerts": 2,
        "active_zones": 4
    }

@router.get("/irrigation-plan")
def get_irrigation_plan():
    return [
        {
            "zone_id": 1,
            "zone_name": "North Wheat Field",
            "recommendation": "Irrigate Now",
            "water_quantity_liters": 450.5,
            "duration_minutes": 22,
            "reasoning": "Soil moisture is 28% (below 35% threshold). No rain expected."
        }
    ]
