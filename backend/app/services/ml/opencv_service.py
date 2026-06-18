import random
from typing import Dict, Any

class OpenCVService:
    @staticmethod
    def analyze_leaf_health(image_path: str) -> Dict[str, Any]:
        """Mock OpenCV calculation for leaf health (ExG, GRVI)"""
        # In a real scenario, we would use cv2 to compute these indices
        # img = cv2.imread(image_path)
        # b, g, r = cv2.split(img)
        # ExG = 2*g - r - b ...
        
        exg = random.uniform(0.1, 0.9)
        grvi = random.uniform(-0.2, 0.8)
        
        # Health score based on dummy indices
        score = (exg * 50) + (grvi * 50)
        score = max(0, min(100, score + 20)) # shift it up a bit
        
        stress_level = "Low"
        if score < 40:
            stress_level = "High"
        elif score < 70:
            stress_level = "Moderate"
            
        return {
            "score": score,
            "exg_index": exg,
            "grvi_index": grvi,
            "stress_level": stress_level,
            "nutrient_warning": score < 50
        }
