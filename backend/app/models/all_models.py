from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(String, default="farmer") # farmer, admin, officer, researcher
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    farms = relationship("Farm", back_populates="owner")

class Farm(Base):
    __tablename__ = "farms"
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, nullable=False)
    location = Column(String) # GeoJSON or String
    total_area = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="farms")
    zones = relationship("FarmZone", back_populates="farm")

class FarmZone(Base):
    __tablename__ = "farm_zones"
    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"))
    name = Column(String, nullable=False)
    crop_type = Column(String) # Wheat, Rice, etc.
    area = Column(Float)
    
    farm = relationship("Farm", back_populates="zones")
    images = relationship("Image", back_populates="zone")

class Image(Base):
    __tablename__ = "images"
    id = Column(Integer, primary_key=True, index=True)
    zone_id = Column(Integer, ForeignKey("farm_zones.id"))
    file_path = Column(String, nullable=False)
    image_type = Column(String) # drone, cctv, smartphone
    captured_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="pending") # pending, processing, completed, failed
    
    zone = relationship("FarmZone", back_populates="images")
    disease_detections = relationship("DiseaseDetection", back_populates="image")
    weed_detections = relationship("WeedDetection", back_populates="image")
    health_score = relationship("HealthScore", back_populates="image", uselist=False)
    soil_moisture = relationship("SoilMoistureRecord", back_populates="image", uselist=False)
    growth_stage = relationship("GrowthStage", back_populates="image", uselist=False)

class DiseaseDetection(Base):
    __tablename__ = "disease_detections"
    id = Column(Integer, primary_key=True, index=True)
    image_id = Column(Integer, ForeignKey("images.id"))
    disease_name = Column(String)
    confidence = Column(Float)
    bounding_boxes = Column(JSON) # List of dicts
    severity_percentage = Column(Float)
    recommended_treatment = Column(Text)
    
    image = relationship("Image", back_populates="disease_detections")

class WeedDetection(Base):
    __tablename__ = "weed_detections"
    id = Column(Integer, primary_key=True, index=True)
    image_id = Column(Integer, ForeignKey("images.id"))
    weed_density = Column(Float)
    weed_percentage = Column(Float)
    infested_zones = Column(JSON) # Bounding boxes
    
    image = relationship("Image", back_populates="weed_detections")

class HealthScore(Base):
    __tablename__ = "health_scores"
    id = Column(Integer, primary_key=True, index=True)
    image_id = Column(Integer, ForeignKey("images.id"), unique=True)
    score = Column(Float) # 0-100
    exg_index = Column(Float)
    grvi_index = Column(Float)
    stress_level = Column(String)
    nutrient_warning = Column(Boolean, default=False)
    
    image = relationship("Image", back_populates="health_score")

class SoilMoistureRecord(Base):
    __tablename__ = "soil_moisture_records"
    id = Column(Integer, primary_key=True, index=True)
    image_id = Column(Integer, ForeignKey("images.id"), unique=True)
    estimated_moisture = Column(Float) # Percentage
    confidence_interval = Column(Float)
    
    image = relationship("Image", back_populates="soil_moisture")

class GrowthStage(Base):
    __tablename__ = "growth_stages"
    id = Column(Integer, primary_key=True, index=True)
    image_id = Column(Integer, ForeignKey("images.id"), unique=True)
    current_stage = Column(String)
    estimated_days_to_next = Column(Integer)
    water_requirement_factor = Column(Float)
    
    image = relationship("Image", back_populates="growth_stage")

class IrrigationRecommendation(Base):
    __tablename__ = "irrigation_recommendations"
    id = Column(Integer, primary_key=True, index=True)
    zone_id = Column(Integer, ForeignKey("farm_zones.id"))
    recommendation = Column(String) # Irrigate Now / Wait
    water_quantity = Column(Float) # Liters
    duration_minutes = Column(Integer)
    reasoning = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
class WeatherRecord(Base):
    __tablename__ = "weather_records"
    id = Column(Integer, primary_key=True, index=True)
    zone_id = Column(Integer, ForeignKey("farm_zones.id"))
    temperature = Column(Float)
    humidity = Column(Float)
    rain_forecast = Column(Float)
    wind_speed = Column(Float)
    et0_estimation = Column(Float)
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())
