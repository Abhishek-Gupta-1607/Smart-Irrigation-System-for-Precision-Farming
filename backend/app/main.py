from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.base import Base
from app.db.session import engine
from app.api.endpoints import api_router

# Create tables if they don't exist (in a real app use Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AgriVision AI",
    description="Smart Irrigation System for Precision Farming",
    version="1.0.0"
)

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to AgriVision AI API"}
