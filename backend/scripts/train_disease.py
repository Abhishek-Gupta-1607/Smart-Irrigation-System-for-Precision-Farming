import os
from ultralytics import YOLO

def main():
    # Path to your miniature plant village dataset (faster training)
    dataset_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../datasets/plant_village_mini"))
    
    if not os.path.exists(dataset_dir) or not os.listdir(dataset_dir):
        print(f"Error: Dataset directory {dataset_dir} is empty or doesn't exist.")
        print("Please run `python create_mini_dataset.py` first.")
        return

    print("Initializing YOLOv8 Classification Model for Disease Detection...")
    # Load a pretrained YOLOv8 classification model
    model = YOLO("yolov8n-cls.pt")  

    print(f"Starting training on dataset at: {dataset_dir}")
    # Train the model
    results = model.train(
        data=dataset_dir,
        epochs=3,   # Train for 3 epochs for a quick test
        imgsz=224,  # Standard size for classification
        batch=16,   # Smaller batch size for laptop CPU
        name="disease_detection_model",
        project="runs/classify",
        device="cpu"  # Force CPU for MacBook
    )

    print("Training complete!")
    print("The trained weights are saved in: runs/classify/disease_detection_model/weights/best.pt")

if __name__ == "__main__":
    main()
