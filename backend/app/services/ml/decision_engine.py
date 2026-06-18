from typing import Dict, Any

class DecisionEngine:
    @staticmethod
    def generate_irrigation_recommendation(
        moisture_pct: float,
        water_req_factor: float,
        weather_forecast: Dict[str, Any],
        disease_severity: float,
        weed_density: float,
        health_score: float
    ) -> Dict[str, Any]:
        
        # Base decision on soil moisture
        base_threshold = 40.0
        
        # Adjust threshold based on crop stage (water_req_factor)
        threshold = base_threshold * water_req_factor
        
        # If it's going to rain a lot, lower the threshold (need less irrigation)
        if weather_forecast.get("rain_forecast", 0) > 10.0:
            threshold -= 10.0
            
        # If diseased heavily, overwatering might be bad (e.g. fungi), lower threshold
        if disease_severity > 30.0:
            threshold -= 5.0
            
        irrigate_now = moisture_pct < threshold
        
        # Calculate amount
        quantity = 0.0
        duration = 0
        reasoning = f"Current soil moisture is {moisture_pct:.1f}%. Threshold for current stage is {threshold:.1f}%."
        
        if irrigate_now:
            quantity = (threshold - moisture_pct) * 50 # dummy multiplier for Liters/hectare
            duration = int(quantity / 20) # 20 liters per minute flow rate assumption
            
            if weather_forecast.get("rain_forecast", 0) > 0:
                reasoning += f" Rain forecast ({weather_forecast['rain_forecast']}mm) considered."
                
            if disease_severity > 0:
                 reasoning += f" Adjusted for disease severity ({disease_severity}%)."
        else:
             reasoning += " Sufficient moisture. No irrigation needed."

        return {
            "recommendation": "Irrigate Now" if irrigate_now else "Wait",
            "water_quantity": quantity,
            "duration_minutes": duration,
            "reasoning": reasoning
        }
