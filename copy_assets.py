import shutil
import os

# Source files in the agent's workspace brain directory
source_dir = r"C:\Users\VICTUS\.gemini\antigravity-ide\brain\1e1b6608-3e35-430c-b0be-f03debc42443"

files_to_copy = {
    "luxury_skincare_hero_1785252970338.png": "luxury_skincare_hero.png",
    "glow_cream_jar_1785252986507.png": "glow_cream_jar.png",
    "hydrating_serum_dropper_1785253001148.png": "hydrating_serum_dropper.png",
    "scientific_skincare_lab_1785253018446.png": "scientific_skincare_lab.png"
}

# Target directory in the frontend public images folder
target_dir = r"c:\Users\VICTUS\Desktop\Cosmalac\frontend\public\images"

def main():
    if not os.path.exists(target_dir):
        os.makedirs(target_dir, exist_ok=True)
        print(f"Created target directory: {target_dir}")

    for src_name, dest_name in files_to_copy.items():
        src_path = os.path.join(source_dir, src_name)
        dest_path = os.path.join(target_dir, dest_name)
        
        if os.path.exists(src_path):
            try:
                shutil.copy(src_path, dest_path)
                print(f"✅ Successfully copied {src_name} -> {dest_name}")
            except Exception as e:
                print(f"❌ Failed to copy {src_name}: {e}")
        else:
            print(f"⚠️ Source file not found: {src_path}")

if __name__ == "__main__":
    main()
