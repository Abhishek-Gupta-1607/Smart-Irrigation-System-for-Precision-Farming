import os
from ultralytics import YOLO

def main():
    # Path to your plant village dataset
    dataset_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../datasets/plant_village"))
    
    if not os.path.exists(dataset_dir) or not os.listdir(dataset_dir):
        print(f"Error: Dataset directory {dataset_dir} is empty or doesn't exist.")
        print("Please download the PlantVillage dataset from Kaggle and extract it here.")
        return

    print("Initializing YOLOv8 Classification Model for Disease Detection...")
    # Load a pretrained YOLOv8 classification model
    model = YOLO("yolov8n-cls.pt")  

    print(f"Starting training on dataset at: {dataset_dir}")
    # Train the model
    results = model.train(
        data=dataset_dir,
        epochs=50,  # Adjust epochs based on time and hardware
        imgsz=224,  # Standard size for classification
        batch=32,
        name="disease_detection_model",
        project="runs/classify",
        device="cpu"  # Change to "cuda" if you have an NVIDIA GPU or "mps" on Mac
    )

    print("Training complete!")
    print("The trained weights are saved in: runs/classify/disease_detection_model/weights/best.pt")

if __name__ == "__main__":
    main()
