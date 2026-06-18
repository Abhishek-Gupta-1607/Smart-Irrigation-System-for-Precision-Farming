import random
from typing import Dict, Any, List

class YoloService:
    def __init__(self, model_path: str = None):
        self.model_path = model_path
        # In a real scenario, we would load the YOLO model here:
        # self.model = YOLO(model_path)
    
    def detect_disease(self, image_path: str) -> Dict[str, Any]:
        """Mock disease detection"""
        diseases = ["Early Blight", "Late Blight", "Rust", "Powdery Mildew", "Bacterial Spot", "Leaf Curl", "Healthy"]
        disease = random.choice(diseases)
        
        confidence = random.uniform(0.75, 0.99) if disease != "Healthy" else random.uniform(0.90, 0.99)
        severity = random.uniform(10.0, 80.0) if disease != "Healthy" else 0.0
        
        treatment = "No treatment needed."
        if disease == "Early Blight" or disease == "Late Blight":
            treatment = "Apply fungicide containing chlorothalonil or copper. Remove infected leaves."
        elif disease == "Rust":
            treatment = "Apply sulfur-based fungicide. Ensure good air circulation."
            
        return {
            "disease_name": disease,
            "confidence": confidence,
            "bounding_boxes": [{"x": 100, "y": 100, "w": 50, "h": 50}],
            "severity_percentage": severity,
            "recommended_treatment": treatment
        }

    def detect_weeds(self, image_path: str) -> Dict[str, Any]:
        """Mock weed detection"""
        weed_percentage = random.uniform(5.0, 45.0)
        return {
            "weed_density": weed_percentage / 100.0,
            "weed_percentage": weed_percentage,
            "infested_zones": [{"x": 10, "y": 20, "w": 30, "h": 40}, {"x": 200, "y": 150, "w": 60, "h": 80}]
        }
