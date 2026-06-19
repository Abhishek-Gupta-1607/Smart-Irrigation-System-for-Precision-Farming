from app.worker.celery_app import celery_app
from app.services.ml.yolo_service import YoloService
from app.services.ml.resnet_service import ResnetService
from app.services.ml.opencv_service import OpenCVService
from app.services.ml.decision_engine import DecisionEngine

from app.services.weather_service import WeatherService

yolo = YoloService()
resnet = ResnetService()
weather_api = WeatherService()

@celery_app.task(name="app.worker.tasks.process_image")
def process_image(image_path: str, zone_id: int):
    # 1. Disease Detection
    disease_result = yolo.detect_disease(image_path)
    
    # 2. Weed Detection
    weed_result = yolo.detect_weeds(image_path)
    
    # 3. Growth Stage
    stage_result = resnet.classify_growth_stage(image_path)
    
    # 4. Soil Moisture
    moisture_result = resnet.estimate_soil_moisture(image_path)
    
    # 5. Leaf Health
    health_result = OpenCVService.analyze_leaf_health(image_path)
    
    # Fetch Live Weather
    weather = weather_api.get_weather_forecast(lat=28.6139, lon=77.2090) # Default to Delhi for now
    
    # 6. Decision Engine
    irrigation_rec = DecisionEngine.generate_irrigation_recommendation(
        moisture_pct=moisture_result["estimated_moisture"],
        water_req_factor=stage_result["water_requirement_factor"],
        weather_forecast=weather,
        disease_severity=disease_result["severity_percentage"],
        weed_density=weed_result["weed_density"],
        health_score=health_result["score"]
    )
    
    return {
        "status": "success",
        "disease": disease_result,
        "weed": weed_result,
        "stage": stage_result,
        "moisture": moisture_result,
        "health": health_result,
        "irrigation_recommendation": irrigation_rec
    }
