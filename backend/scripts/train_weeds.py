import os
from ultralytics import YOLO

def main():
    # Path to the data.yaml file inside crop_and_weed dataset
    data_yaml_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../datasets/crop_and_weed/data.yaml"))
    
    if not os.path.exists(data_yaml_path):
        print(f"Error: Could not find {data_yaml_path}.")
        print("Please download the Crop and Weed dataset in YOLOv8 format and extract it to backend/datasets/crop_and_weed/")
        return

    print("Initializing YOLOv8 Object Detection Model for Weed Detection...")
    # Load a pretrained YOLOv8 detection model
    model = YOLO("yolov8n.pt")  

    print(f"Starting training using config: {data_yaml_path}")
    # Train the model
    results = model.train(
        data=data_yaml_path,
        epochs=50,  # Adjust epochs based on time and hardware
        imgsz=640,  # Standard YOLOv8 size
        batch=16,
        name="weed_detection_model",
        project="runs/detect",
        device="cpu"  # Change to "cuda" if you have an NVIDIA GPU or "mps" on Mac
    )

    print("Training complete!")
    print("The trained weights are saved in: runs/detect/weed_detection_model/weights/best.pt")

if __name__ == "__main__":
    main()
