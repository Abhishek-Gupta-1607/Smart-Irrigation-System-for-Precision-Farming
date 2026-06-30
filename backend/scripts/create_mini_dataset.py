import os
import shutil
import random

def create_mini_dataset(source_dir, dest_dir, images_per_class=10):
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)
        
    classes = [d for d in os.listdir(source_dir) if os.path.isdir(os.path.join(source_dir, d))]
    
    total_copied = 0
    for cls in classes:
        cls_source = os.path.join(source_dir, cls)
        cls_dest = os.path.join(dest_dir, cls)
        
        if not os.path.exists(cls_dest):
            os.makedirs(cls_dest)
            
        images = [f for f in os.listdir(cls_source) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        # Shuffle to get random images
        random.shuffle(images)
        
        selected_images = images[:images_per_class]
        for img in selected_images:
            shutil.copy2(os.path.join(cls_source, img), os.path.join(cls_dest, img))
            total_copied += 1
            
        print(f"Copied {len(selected_images)} images for class {cls}")
        
    print(f"\nSuccessfully created mini dataset with {total_copied} total images at: {dest_dir}")

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.dirname(__file__))
    source = os.path.join(base_dir, "datasets", "plant_village", "plantvillage dataset", "segmented")
    
    # Fallback to normal plant_village if segmented folder doesn't exist
    if not os.path.exists(source):
        source = os.path.join(base_dir, "datasets", "plant_village")
        
    dest = os.path.join(base_dir, "datasets", "plant_village_mini")
    
    if os.path.exists(source):
        print(f"Sampling 10 images per class from {source}...")
        create_mini_dataset(source, dest, images_per_class=10)
    else:
        print(f"Could not find the source dataset at {source}")
