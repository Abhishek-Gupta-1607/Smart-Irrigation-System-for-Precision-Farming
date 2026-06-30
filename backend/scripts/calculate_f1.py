import os
import glob
from ultralytics import YOLO
from sklearn.metrics import classification_report, accuracy_score
import warnings

# Suppress YOLO progress bars and warnings for clean output
warnings.filterwarnings('ignore')

def get_latest_model(pattern):
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    search_pattern = os.path.join(base_dir, "**", pattern, "**", "weights", "best.pt")
    files = glob.glob(search_pattern, recursive=True)
    if not files:
        return None
    return max(files, key=os.path.getmtime)

def main():
    model_path = get_latest_model("disease_detection_model*")
    
    if not model_path:
        print("Error: Could not find trained weights (best.pt).")
        return
        
    print(f"Loading Model: {model_path}")
    model = YOLO(model_path)
    
    # Path to the validation split we created
    val_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../datasets/plant_village_mini_split/val"))
    
    if not os.path.exists(val_dir):
        print(f"Error: Could not find validation dataset at {val_dir}")
        return

    print("Running AI Predictions on Validation Set... (This might take a minute)")
    
    y_true = []
    y_pred = []
    
    classes = sorted(os.listdir(val_dir))
    
    for class_idx, class_name in enumerate(classes):
        class_dir = os.path.join(val_dir, class_name)
        if not os.path.isdir(class_dir):
            continue
            
        images = os.listdir(class_dir)
        for img_name in images:
            img_path = os.path.join(class_dir, img_name)
            
            # Run prediction (verbose=False to keep terminal clean)
            results = model(img_path, verbose=False)
            
            # The top1 prediction index
            pred_idx = results[0].probs.top1
            pred_class = results[0].names[pred_idx]
            
            y_true.append(class_name)
            y_pred.append(pred_class)

    print("\n==================================================")
    print("📊 GLOBAL AI PERFORMANCE METRICS")
    print("==================================================\n")
    
    report = classification_report(y_true, y_pred, output_dict=True, zero_division=0)
    
    # Macro Average treats all classes equally (good for balanced datasets)
    macro_precision = report['macro avg']['precision'] * 100
    macro_recall = report['macro avg']['recall'] * 100
    macro_f1 = report['macro avg']['f1-score'] * 100
    accuracy = accuracy_score(y_true, y_pred) * 100
    
    print(f"✅ Overall Accuracy: {accuracy:.2f}%")
    print(f"✅ Global Precision: {macro_precision:.2f}%")
    print(f"✅ Global Recall:    {macro_recall:.2f}%")
    print(f"✅ Global F1-Score:  {macro_f1:.2f}%")
    print("\n(Note: These are 'Macro-Averaged' scores across all diseases)")

if __name__ == "__main__":
    main()
