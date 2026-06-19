from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import os
import shutil
import uuid
from celery.result import AsyncResult
from app.worker.tasks import process_image
from app.worker.celery_app import celery_app

router = APIRouter()

UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../uploads"))
os.makedirs(UPLOAD_DIR, exist_ok=True)

class ImageUploadResponse(BaseModel):
    task_id: str
    message: str

@router.post("/upload-image", response_model=ImageUploadResponse)
def upload_image(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
        
    # Create unique filename and save path
    file_ext = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
    unique_filename = f"{uuid.uuid4().hex}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
        
    # Enqueue the celery task
    task = process_image.delay(file_path, zone_id=1)
    
    return {
        "task_id": task.id,
        "message": "Image queued for processing successfully."
    }

@router.get("/analyze/{task_id}")
def get_analysis_status(task_id: str):
    task_result = AsyncResult(task_id, app=celery_app)
    
    if task_result.state == 'PENDING':
        return {"status": "pending", "message": "Task is waiting in queue or processing..."}
    elif task_result.state == 'SUCCESS':
        return {"status": "completed", "result": task_result.result}
    elif task_result.state == 'FAILURE':
        return {"status": "failed", "message": str(task_result.info)}
    else:
        return {"status": task_result.state.lower()}

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
