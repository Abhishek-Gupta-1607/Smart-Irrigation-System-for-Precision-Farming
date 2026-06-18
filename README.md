# AgriVision AI – Smart Irrigation System for Precision Farming

AgriVision AI is an industry-level, SaaS-grade agriculture intelligence platform designed to reduce water consumption and increase crop health and yield through Computer Vision, Weather Intelligence, and Explainable AI.

## Architecture

*   **Backend**: FastAPI, PostgreSQL, Redis, Celery.
*   **Frontend**: React, Vite, TailwindCSS.
*   **AI Models**: YOLOv8 (Disease/Weeds), ResNet50 (Crop Stage), OpenCV (Leaf Health).
*   **Deployment**: Fully Dockerized (Docker Compose).

## Modules Included

1.  **Disease Detection**: YOLOv8-based model to detect diseases like Blight, Rust, etc., and recommend treatment.
2.  **Weed Detection**: Detects crop vs. weeds and generates infestation density maps.
3.  **Crop Growth Stage**: Classifies stages (Germination -> Maturity) and adjusts water requirements.
4.  **Leaf Health Analysis**: Calculates ExG, GRVI indices using OpenCV for stress estimation.
5.  **Soil Moisture**: CNN regression fallback for estimating moisture levels from RGB images.
6.  **Smart Decision Engine**: Uses ML outputs + weather forecasts to generate precise irrigation plans.

## Getting Started

### Prerequisites
*   Docker Desktop / Docker Compose installed.

### Run Locally

1. Build and start the entire stack:
   ```bash
   docker-compose up --build
   ```

2. Access the applications:
   *   **Frontend Dashboard**: [http://localhost:3000](http://localhost:3000)
   *   **Backend API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
   *   **Celery Worker**: Runs automatically in the background.

## Database & Models

Currently utilizing PostgreSQL. When you first start the application, SQLAlchemy will automatically construct the required schema (`users`, `farms`, `farm_zones`, `images`, detections, etc.).

## Note on AI Models

This initial repository includes structural stubs and wrappers for the PyTorch YOLOv8 and ResNet50 models in `backend/app/services/ml/`. You can easily swap out the simulated `random.choice` logic with actual `.pt` or `.onnx` weight loading once your datasets (PlantVillage, CropAndWeed, etc.) are trained.
