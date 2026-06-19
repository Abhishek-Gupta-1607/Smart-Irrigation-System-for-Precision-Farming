import os
import httpx
from typing import Dict, Any

class WeatherService:
    def __init__(self):
        # Provide your OpenWeatherMap API key in the environment
        self.api_key = os.getenv("OPENWEATHER_API_KEY", "")
        self.base_url = "https://api.openweathermap.org/data/2.5/weather"

    def get_weather_forecast(self, lat: float = 28.6139, lon: float = 77.2090) -> Dict[str, Any]:
        """Fetch real weather using OpenWeatherMap API, or fallback if no key is provided."""
        if not self.api_key:
            # Fallback to mock data if API key is not configured yet
            return {
                "temperature": 25.0,
                "humidity": 60.0,
                "rain_forecast": 0.0,  # mm
                "wind_speed": 5.0
            }
            
        try:
            params = {
                "lat": lat,
                "lon": lon,
                "appid": self.api_key,
                "units": "metric"
            }
            response = httpx.get(self.base_url, params=params, timeout=5.0)
            response.raise_for_status()
            data = response.json()
            
            # Simple parsing of current weather to estimate rain forecast
            rain = data.get("rain", {}).get("1h", 0.0)
            temp = data.get("main", {}).get("temp", 25.0)
            humidity = data.get("main", {}).get("humidity", 60.0)
            wind = data.get("wind", {}).get("speed", 5.0)
            
            return {
                "temperature": temp,
                "humidity": humidity,
                "rain_forecast": rain,
                "wind_speed": wind
            }
        except Exception as e:
            print(f"Error fetching weather: {e}")
            return {
                "temperature": 25.0,
                "humidity": 60.0,
                "rain_forecast": 0.0,
                "wind_speed": 5.0
            }
